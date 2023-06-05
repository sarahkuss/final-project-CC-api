import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import { organizationsCollection } from "./dbConnect.js"
import { secretKey } from "../secrets.js"

// GET ALL
export async function getAllOrganizations(req, res) {
  const organizations = await organizationsCollection.find({}).toArray()
  res.send(organizations)
}

// POST
export async function addOrganization(req, res) {
  const token = req.headers.authorization
  if(!token) {
    res.status(401).send({message: "Unauthorized. A valid token is required."})
    return
  }
  const decoded = jwt.verify(token, secretKey)
  if(!decoded) {
    res.status(401).send({message: "Unauthorized. A valid token is required."})
    return
  }
  const newOrganization = req.body
  await organizationsCollection
  .insertOne(newOrganization)
  .catch(err => {
    res.status(500).send(err)
    return
  })
  getAllOrganizations(req,res)
}

// DELETE
export async function deleteOrganization(req, res) {
  const token = req.headers.authorization
  if(!token) {
    res.status(401).send({message: "Unauthorized. A valid token is required."})
    return
  }
  const decoded = jwt.verify(token, secretKey)
  if(!decoded) {
    res.status(401).send({message: "Unauthorized. A valid token is required."})
    return
  }
  try{
  const orgId = {'_id': new ObjectId(req.params.orgId)}
  await organizationsCollection.findOneAndDelete( orgId )
  await getAllOrganizations(req, res)
  } catch(error) {
  res.status(500).send({message: 'Error while deleting'})
 }
}

// PATCH
export async function updateOrganization(req, res) {
  if(!req.headers.check || req.headers.check !== 'isAdmin') {
    res.status(401).send({message: 'not authorized'})
    return
  }
  const orgId = {'_id': new ObjectId(req.params.orgId)}
  const updateOrg = { $set: req.body }
  const returnOption = { returnNewDocument: true}

  const query = await organizationsCollection.findOneAndUpdate(orgId, updateOrg, returnOption)
  .catch(err => res.status(500).send(err))
  await getAllOrganizations(req, res)
  res.status(201).send({message: 'Organization has been updated'})
}