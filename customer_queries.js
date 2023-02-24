const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: '35.187.248.198',
    database: 'trial_week2_4_vincent',
    password: 'd3v3l0p8015',
    port: 5432,
})
const getCustomer = (req, res) => {
  pool.query('SELECT * FROM customer ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getCustomerById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM customer WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const createCustomer = (req, res) => {
  const { id, name, nik, phone_number } = req.body

  pool.query('INSERT INTO customer VALUES ($1, $2, $3, $4) RETURNING*', [id, name, nik, phone_number], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`Customer added with ID: ${results.rows[0].id}`)
  })
}

const updateCustomer = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, nik, phone_number } = req.body

  pool.query(
    'UPDATE customer SET name = $1, nik = $2, phone_number = $3 WHERE id = $4',
    [ name, nik, phone_number, id ],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`Customer modified with ID: ${id}`)
    }
  )
}

const deleteCustomer = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM customer WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`Customer deleted with ID: ${id}`)
  })
}

module.exports = {
  getCustomer,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
}
