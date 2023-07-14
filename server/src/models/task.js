import mongoose from "mongoose"

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const Tasks = mongoose.model("tasks", taskSchema)

export default Tasks