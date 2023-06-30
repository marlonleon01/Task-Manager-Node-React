import { MongoClient } from "mongodb"

const connectionURL = "mongodb://127.0.0.1:27017"
const client = new MongoClient(connectionURL)
const databaseName = "task-manager"

const connectToDatabase = async () => {
    try {
        await client.connect()
    } catch(error) {
        console.log(error)
    }

    const db = client.db(databaseName)
}

connectToDatabase()