import express from "express";
import User from "../models/user.js"
import auth from "../middlewares/auth.js";
import multer from "multer"
import sharp from "sharp"
import { sendWelcomeEmail } from "../emails/account.js";
const userRouter = new express.Router()

userRouter.post("/users", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

userRouter.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send()
    }
})

userRouter.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

userRouter.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

userRouter.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
})

userRouter.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid update!"})
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

userRouter.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.deleteOne({_id: req.user._id})
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Upload jpg, jpeg, or png file!"))
        }
        cb(null, true)
    }
})

userRouter.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

userRouter.delete("/users/me/avatar", auth, async (req, res) => {
    try {
        if (!req.user.avatar) {
            res.status(404).send()
        }

        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

userRouter.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set("Content-Type", "image/png").send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

export default userRouter