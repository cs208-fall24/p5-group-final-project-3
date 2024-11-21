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

app.get('/', function (req, res) {
  console.log('GET called')
  res.render('index')
})

app.get('/student1', function (req, res) {
  console.log('GET called')
  res.render('student1')
})

app.get('/student2', function (req, res) {
  console.log('GET called')
  res.render('student2')
})

app.get('/student3', function (req, res) {
  console.log('GET called')
  res.render('student3')
})


// Begin: Added for Student3 - Christopher Smith

db.run(`CREATE TABLE comments3 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT NOT NULL)`)

// Build the table and render the comments page
app.get('/student3/comments', function (req, res) {
  const local = { comments: [] }
  db.each('SELECT id, comment FROM comments3', function (err, row) {
      if (err) {
      console.log(err)
      } else {
          local.comments.push({ id: row.id, comment: row.comment })
      }
  }, function (err, numrows) {
      if (!err) {
      res.render('student3/comments', local)
      } else {
      console.log(err)
      }
  })
    console.log('GET called')

})
//Add a comment
app.post('/', function (req, res) {
    console.log('adding comments3 item')
    const stmt = db.prepare('INSERT INTO comments3 (comment) VALUES (?)')
    stmt.run(req.body.comments3)
    stmt.finalize()
})

// Delete a comment
app.post('/delete', function (req, res) {
    console.log('deleting comments3 item')
    //TODO you will need to delete here
    const stmt = db.prepare('DELETE FROM comments3 where id = (?)')
    stmt.run(req.body.id)
    stmt.finalize()
})

// End: Added for Student3 - Christopher Smith

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
