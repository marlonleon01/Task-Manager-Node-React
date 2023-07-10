import mongoose from "mongoose";

const connectionURL = "mongodb://127.0.0.1:27017/task-manager-api"

mongoose.connect(connectionURL)
    
const User = mongoose.model("User", {
    name: {
        type: String,
    },
    age: {
        type: Number,
    }
})

const me = new User({
    name: "Marlon",
    age: 23
})

me.save()
    .then(() => {
        console.log(me)
    }).catch((error) => {
        console.log("Error", error)
    })