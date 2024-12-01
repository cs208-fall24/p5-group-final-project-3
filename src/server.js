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

// Begin: Added for Student3 - Christopher Smith

db.run(`CREATE TABLE comment_table_3 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment3 TEXT NOT NULL)`)

  //Display main page
  app.get('/student3', function (req, res) {
    const local = { comments3: [] }
    db.each('SELECT id, comment3 FROM comment_table_3', function (err, row) {
        if (err) {
        console.log(err)
        } else {
            local.comments3.push({ id: row.id, comment3: row.comment3 })
        }
    }, function (err, numrows) {
        if (!err) {
        res.render('student3', local)
        } else {
        console.log(err)
        }
    })
    console.log('GET called')
  })

  //Display comments page
  app.get('/student3/comments3', function (req, res) {
    const local = { comments3: [] }
    db.each('SELECT id, comment3 FROM comment_table_3', function (err, row) {
        if (err) {
        console.log(err)
        } else {
            local.comments3.push({ id: row.id, comment3: row.comment3 })
        }
    }, function (err, numrows) {
        if (!err) {
        res.render('student3/comments3', local)
        } else {
        console.log(err)
        }
    })
    console.log('GET called')

})

app.post('/comments3', function (req, res) {
    console.log('adding comment_table_3 item')
    const stmt = db.prepare('INSERT INTO comment_table_3 (comment3) VALUES (?)')
    stmt.run(req.body.comment_table_3)
    stmt.finalize()
})

app.post('/comments3/delete', function (req, res) {
  console.log('deleting comment_table_3 item')
    const stmt = db.prepare('DELETE FROM comment_table_3 where id = (?)')
    stmt.run(req.body.id)
    stmt.finalize()
})

app.post('/comments3/edit', function (req, res) {
  console.log('editing comment_table_3 item')
    const stmt = db.prepare('UPDATE comment_table_3 SET comment3 = (?) WHERE id = (?)')
    stmt.run(req.body.update_comment_3, req.body.id)
    stmt.finalize()
})

// End: Added for Student3 - Christopher Smith

// Start the web server
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
