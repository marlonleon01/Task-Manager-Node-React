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

taskRouter.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
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

taskRouter.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const isAllowed = ["description", "completed"]
    const isValidOperation = updates.every(update => isAllowed.includes(update))
    
    if (!isValidOperation) {
        res.status(400).send({error: "Invalid update!"})
    }

    try {
        const task = await Task.findById(req.params.id)
        updates.forEach(update => task[update] = req.body[update])
        await task.save()
        
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

taskRouter.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

export default taskRouter
