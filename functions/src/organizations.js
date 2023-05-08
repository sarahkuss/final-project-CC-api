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
  const orgId = {'_id': new ObjectId(req.params.orgId)}
  await organizationsCollection
  .findOneAndDelete( orgId )
  .catch(err => {
    res.status(500).send(err)
    return
  })
  res.status(201).send({message: 'Organization has been deleted'})
}

// PATCH
export async function updateOrganization(req, res) {
  const orgId = {'_id': new ObjectId(req.params.orgId)}
  const updateOrg = { $set: req.body }
  const returnOption = { returnNewDocument: true}

  const query = await organizationsCollection.findOneAndUpdate(orgId, updateOrg, returnOption)
  .catch(err => res.status(500).send(err))
  res.status(201).send({message: 'Organization has been updated'})
}