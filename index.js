const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const dbCustomer = require('./customer_queries')
const dbCars = require('./cars_queries.js')
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

app.get('/customer', dbCustomer.getCustomer)
app.get('/customer/:id', dbCustomer.getCustomerById)
app.post('/customer', dbCustomer.createCustomer)
app.put('/customer/:id', dbCustomer.updateCustomer)
app.delete('/customer/:id', dbCustomer.deleteCustomer)

app.get('/cars', dbCars.getCars)
app.get('/cars/:id', dbCars.getCars)
app.post('/cars', dbCars.createCars)
app.put('/cars/:id', dbCars.updateCars)
app.delete('/cars/:id', dbCars.deleteCars)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})