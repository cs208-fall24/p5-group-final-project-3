import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

db.run(`CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task TEXT NOT NULL)`)

app.get('/', function (req, res) {
  console.log('GET called')
  res.render('index')
})

app.get('/student1', function (req, res) {
  console.log('GET called')
  res.render('student1')
})

app.get('/student1b', function (req, res) {
  console.log('GET called')
  const local = { tasks: [] }
  db.each('SELECT id, task FROM comments', function (err, row) {
      if (err) {
      console.log(err)
      } else {
      local.tasks.push({ id: row.id, task: row.task })
      }
  }, function (err, numrows) {
      if (!err) {
          res.render('student1b', local)
      } else {
      console.log(err)
      }
  })
})

app.post('/', function (req, res) {
  console.log('adding comment')
  const stmt = db.prepare('INSERT INTO comments (task) VALUES (?)')
  stmt.run(req.body.comments)
  stmt.finalize()
  console.log('GET called')
  const local = { tasks: [] }
  db.each('SELECT id, task FROM comments', function (err, row) {
      if (err) {
      console.log(err)
      } else {
      local.tasks.push({ id: row.id, task: row.task })
      }
  }, function (err, numrows) {
      if (!err) {
          res.render('student1b', local)
      } else {
      console.log(err)
      }
  })
})

app.post('/delete', function (req, res) {
  console.log('deleting comment')
  const stmt = db.prepare('DELETE FROM comments where id = (?)')
  stmt.run(req.body.id)
  stmt.finalize()
  console.log('GET called')
  const local = { tasks: [] }
  db.each('SELECT id, task FROM comments', function (err, row) {
      if (err) {
      console.log(err)
      } else {
      local.tasks.push({ id: row.id, task: row.task })
      }
  }, function (err, numrows) {
      if (!err) {
          res.render('student1b', local)
      } else {
      console.log(err)
      }
  })
})

app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})

app.get('/student3', function (req, res) {
  console.log('GET called')
  res.render('student3')
})

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
