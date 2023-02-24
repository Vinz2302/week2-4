const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const dbCustomer = require('./customer_queries')
const dbCars = require('./cars_queries.js')
const dbBooking = require('./booking_queries.js')
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
app.get('/cars/:id', dbCars.getCarsById)
app.post('/cars', dbCars.createCars)
app.put('/cars/:id', dbCars.updateCars)
app.delete('/cars/:id', dbCars.deleteCars)

app.get('/booking', dbBooking.getBooking)
app.get('/booking/:id', dbBooking.getBookingById)
app.post('/booking', dbBooking.createBooking)
app.put('/booking/:id', dbBooking.updateBooking)
app.delete('/booking/:id', dbBooking.deleteBooking)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})