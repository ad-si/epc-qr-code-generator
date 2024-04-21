const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000
const persons = JSON.parse(process.env['persons'])
const password = process.env['password']

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('dist'))

app.post('/api/persons', (req, res, next) => {
  if (req.body.password && req.body.password === password) {
    res.send(
      persons.filter(person => person.isActive)
    )
  }
  else {
    next()
  }
})

app.use((err, _req, res) => {
  res
    .status(500)
    .json({ error: err.message })
})

app.listen(
  port,
  () => console.info(`Server is listenting at http://localhost:${port}`)
)
