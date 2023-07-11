import express from "express"
import "./db/mongoose.js"
import Task from "./models/task.js"
import router from "./routers/user.js"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(router)

//Tasks Endpoints
app.post("/tasks", async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send()
    }
})

app.get("/tasks/:id", async (req, res) => {
    const _id = req.params.id
    
    try {
        const task = await Task.findById(_id)

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

app.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body)
    const isAllowed = ["description", "completed"]
    const isValidOperation = updates.every(update => isAllowed.includes(update))
    
    if (!isValidOperation) {
        res.status(400).send({error: "Invalid update!"})
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

app.delete("/tasks/:id", async (req, res) => {
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

//Port to listen on
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})