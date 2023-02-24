const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: '35.187.248.198',
    database: 'trial_week2_4_vincent',
    password: 'd3v3l0p8015',
    port: 5432,
})
const getBooking = (req, res) => {
  pool.query('SELECT * FROM booking ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getBookingById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM booking WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const createBooking = (req, res) => {
  const { id, customer_id, cars_id, start_time, end_time, total_cost, finished } = req.body

  pool.query('INSERT INTO booking VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING*', [id, customer_id, cars_id, start_time, end_time, total_cost, finished], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`Booking added with ID: ${results.rows[0].id}`)
  })
}

const updateBooking = (req, res) => {
  const id = parseInt(req.params.id)
  const { customer_id, cars_id, start_time, end_time, total_cost, finished } = req.body

  pool.query(
    'UPDATE booking SET customer_id = $1, cars_id = $2, start_time = $3, end_time = $4, total_cost = $5, finished = $6 WHERE id = $7',
    [ customer_id, cars_id, start_time, end_time, total_cost, finished, id ],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`Booking modified with ID: ${id}`)
    }
  )
}

const deleteBooking = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM booking WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`Booking deleted with ID: ${id}`)
  })
}

module.exports = {
  getBooking,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
}
