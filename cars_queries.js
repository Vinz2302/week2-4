const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: '35.187.248.198',
    database: 'trial_week2_4_vincent',
    password: 'd3v3l0p8015',
    port: 5432,
})
const getCars = (req, res) => {
  pool.query('SELECT * FROM cars ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getCarsById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM cars WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const createCars = (req, res) => {
  const { id, name, rent_price_daily, stock } = req.body

  pool.query('INSERT INTO cars VALUES ($1, $2, $3, $4) RETURNING*', [id, name, rent_price_daily, stock], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).send(`Cars added with ID: ${results.rows[0].id}`)
  })
}

const updateCars = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, rent_price_daily, stock } = req.body

  pool.query(
    'UPDATE cars SET name = $1, rent_price_daily = $2, stock = $3 WHERE id = $4',
    [ name, rent_price_daily, stock, id ],
    (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).send(`Cars modified with ID: ${id}`)
    }
  )
}

const deleteCars = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM cars WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`Cars deleted with ID: ${id}`)
  })
}

module.exports = {
  getCars,
  getCarsById,
  createCars,
  updateCars,
  deleteCars,
}
