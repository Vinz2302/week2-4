const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/customer', db.getCustomer)
app.get('/customer/:id', db.getCustomerById)
app.post('/customer', db.createCustomer)
app.put('/customer/:id', db.updateCustomer)
app.delete('/customer/:id', db.deleteCustomer)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})