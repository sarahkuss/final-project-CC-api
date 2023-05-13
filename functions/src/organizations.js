import { organizationsCollection } from "./dbConnect.js"
import { ObjectId } from "mongodb"

// GET ALL
export async function getAllOrganizations(req, res) {
  const organizations = await organizationsCollection.find({}).toArray()
  res.send(organizations)
}

// POST
export async function addOrganization(req, res) {
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
  const orgId = {'_id': new ObjectId(req.params.orgId)}
  const updateOrg = { $set: req.body }
  const returnOption = { returnNewDocument: true}

  const query = await organizationsCollection.findOneAndUpdate(orgId, updateOrg, returnOption)
  .catch(err => res.status(500).send(err))
  await getAllOrganizations(req, res)
  res.status(201).send({message: 'Organization has been updated'})
}