import mongoose from "mongoose";
import validator from "validator"

const connectionURL = "mongodb://127.0.0.1:27017/task-manager-api"

mongoose.connect(connectionURL)
    
const User = mongoose.model("User", {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password cannot contain 'password'")
            }
        }
    }
})

// const me = new User({
//     name: "Matthew",
//     email: "mat@gmail.com",
//     password: "phone098!"
// })

// me.save()
//     .then(() => {
//         console.log(me)
//     }).catch((error) => {
//         console.log("Error", error)
//     })

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

const task = new Tasks({
    description: "Eat some food",
    completed: true
})

task.save()
    .then(() => console.log(task))
    .catch(error => console.log(error))