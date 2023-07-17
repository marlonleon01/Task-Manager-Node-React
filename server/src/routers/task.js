import express from "express"
import Task from "../models/task.js"
import auth from "../middlewares/auth.js"
const taskRouter = new express.Router()

taskRouter.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

taskRouter.get("/tasks", auth, async (req, res) => {
    const match = {}
    
    if (req.query.completed) {
        match.completed = req.query.completed === "true"
    }

    try {
        await req.user.populate({
            path: "tasks",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        })

        res.send(req.user.tasks)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})

taskRouter.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id
    
    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

taskRouter.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const isAllowed = ["description", "completed"]
    const isValidOperation = updates.every(update => isAllowed.includes(update))
    
    if (!isValidOperation) {
        res.status(400).send({error: "Invalid update!"})
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        
        if (!task) {
            return res.status(404).send()
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

taskRouter.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

export default taskRouter
