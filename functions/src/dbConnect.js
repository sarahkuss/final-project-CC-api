import { MongoClient } from "mongodb";
import { mongoURI } from "../secrets.js";

export const client = new MongoClient(mongoURI)

const db = client.db("conservation")

export const organizationsCollection = db.collection("organizations")
export const usersCollection = db.collection("users")