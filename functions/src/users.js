import { hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb';
import { usersCollection } from "./dbConnect.js";
import { secretKey, salt } from '../secrets.js';

export async function login(req, res) {
  const {email, password} = req.body
  if(!email || !password) {
    res.status(400).send({message: 'Email and password both required'})
    return
  }
  const hashedPassword = hashSync(password, salt)
  let user = await usersCollection.findOne({email: email.toLowerCase(), password: hashedPassword})
  if(!user) {
    res.status(401).send({message: "Invalid email or password"})
    return
  }
  delete user.password
  const token = jwt.sign(user, secretKey)
  res.send({user, token})
}


export async function signup(req, res) {
  const {email, password, firstName, lastName} = req.body
  if(!email || !password) {
    res.status(400).send({message: 'Email and password both required.'})
    return
  }
  // Check to see if email already exists
  const check = await usersCollection.findOne({email: email.toLowerCase()})
  if(check) {
    res.status(401).send({message: 'Email already in use, please try logging in.'})
    return
  }
  const hashedPassword = hashSync(password, salt)
  await usersCollection.insertOne({email: email.toLowerCase(), password: hashedPassword, firstName, lastName})
  login(req, res)
}

export async function addFavOrg(req, res) {
  const userId = {'_id': new ObjectId(req.params.userId)}
  const orgId = new ObjectId(req.params.orgId)
  const user = await usersCollection.findOne(userId)
  try {
    const result = await usersCollection.updateOne(
      userId,
      {$addToSet: {favorites: orgId}}
      )
      if(result.modifiedCount === 1) {
        // res.send({message: 'Organization added to favorites'})
        const updatedUser = await usersCollection.findOne(userId)
        delete updatedUser.password
        res.send(updatedUser)
      } else {
        res.status(404).send({message: 'user not found'})
      }
      
    } catch (error) {
      console.error(error)
      res.status(500).send({message: 'server error'})
    }
}