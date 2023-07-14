import User from "../models/user.js"
import jwt from "jsonwebtoken"

async function auth(req, res, next) {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, "thisismynewcourse")
        const user = await User.findOne({_id: decoded._id, "tokens.token": token})

        if (!user) {
            throw new Error()
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).send({error: "Please authenticate."})
    }
}

export default auth