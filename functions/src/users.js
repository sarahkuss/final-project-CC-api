import { hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken'
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
  const {email, password} = req.body
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
  await usersCollection.insertOne({email: email.toLowerCase(), password: hashedPassword})
  login(req, res)
}