import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api")

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

// const task = new Tasks({
//     description: "Eat some food",
//     completed: true
// })

// task.save()
//     .then(() => console.log(task))
//     .catch(error => console.log(error))