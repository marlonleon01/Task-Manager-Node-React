import { MongoClient } from "mongodb"

const connectionURL = "mongodb://127.0.0.1:27017"
const client = new MongoClient(connectionURL)
const databaseName = "task-manager"

const connectToDatabase = async () => {
    try {
        await client.connect()
        console.log("Connected correctly")
        const db = client.db(databaseName)

        // db.collection("users").insertOne({
        //     name: "Marlon",
        //     age: 23
        // }).then((result, error) => {
        //     if (error) {
        //         return console.log("Unabled to insert documents")
        //     }

        //     console.log(result.acknowledged, result.insertedId)
        // })

        // db.collection("users").insertMany([
        //     {
        //         name: "Jen",
        //         age: 28
        //     }, 
        //     {
        //         name: "Gunther",
        //         age: 27
        //     }
        // ]).then((result, error) => {
        //     if (error) {
        //         return console.log("Unabled to insert documents")
        //     }

        //     console.log(result.insertedCount)
        // })

        db.collection("tasks").insertMany([
            {
                description: "Clean the house",
                completed: true
            },
            {
                description: "Go to gym",
                completed: false
            },
            {
                description: "Walk dogs",
                completed: true
            }
        ]).then((result, error) => {
            if (error) {
                return console.log("Unable to insert documents")
            }

            console.log(result.acknowledged, result.insertedCount, result.insertedIds)
        })

    } catch(error) {
        console.log("Unabled to connect to the database")
    }
}

connectToDatabase()