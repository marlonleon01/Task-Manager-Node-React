import mongoose from "mongoose"

const Tasks = mongoose.model("tasks", {
    description: {
        type: String,
        trim: true,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }
})

export default Tasks