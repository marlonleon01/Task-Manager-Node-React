import express from "express";
import User from "../models/user.js"
import jwt from "jsonwebtoken"
import auth from "../middlewares/auth.js";

const userRouter = new express.Router()

userRouter.post("/users", async (req, res) => {
    const user = new User(req.body)

    try {
        const token = jwt.sign({_id: user._id.toString()}, "thismynewcourse")
        user.tokens = user.tokens.concat({token})

        await user.save()
        res.status(201).send(user)
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

userRouter.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
})

userRouter.get("/users/:id", async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

userRouter.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid update!"})
    }

    try {
        const user = await User.findById(req.params.id)
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

userRouter.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})


export default userRouter