const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const router = require('express').Router()

app.use(bodyParser.json()) 
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

/* app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
}); */

/* app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
});

app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', res.method)
  next()
}); */

/* app.get('/user/:id', (req, res) => {
  res.send('USER')
}) */

/* app.use('/user/:id', (req, res, next) => {
  console.log('Request URL:', req.originalUrl)
  next()
}, (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
}) */

/* app.get('/user/:id', (req, res, next) => {
  console.log('ID:', req.params.id)
  next('route')
}, (req, res, next) => {
  res.send('User Info')
})

// handler for the /user/:id path, which prints the user ID
app.get('/user/:id', (req, res, next) => {
  res.send(req.params.id)
}) */

/* app.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, (req, res, next) => {
  // send a regular response
  res.send('regular')
})

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', (req, res, next) => {
  res.send('special')
}) */

/* function logOriginalUrl (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}

function logMethod (req, res, next) {
  console.log('Request Type:', req.method)
  next()
}

const logStuff = [logOriginalUrl, logMethod]
app.get('/user/:id', logStuff, (req, res, next) => {
  res.send('User Info')
}) */

// predicate the router with a check and bail out when needed
router.use((req, res, next) => {
  if (!req.headers['x-auth']) return next('router')
  next()
})

router.get('/user/:id', (req, res) => {
  res.send('hello, user!')
})

// use the router and 401 anything falling through
app.use('/admin', router, (req, res) => {
  res.sendStatus(401)
})

// mount the router on the app
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});