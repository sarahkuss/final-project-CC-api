import express from 'express'
import cors from 'cors'
import functions from 'firebase-functions'
import { addOrganization, deleteOrganization, getAllOrganizations, updateOrganization } from './src/organizations.js'

const PORT = 3000

const app = express()
app.use(cors())
app.use(express.json())

app.get('/organizations', getAllOrganizations)
app.post('/organizations', addOrganization)
app.delete('/organizations/:orgId', deleteOrganization)
app.patch('/organizations/:orgId', updateOrganization)


app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}...`)
})

export const api = functions.https.onRequest(app)
