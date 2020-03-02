const express = require('express');
const app = express();
const path = require('path');
let fs = require('fs');
var bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const dbFile = __dirname + "/bread.db";

let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) throw err;
    console.log("Koneksi ke database berhasil!");
});

module.exports = db;
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.use('/', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
    let sql = 'SELECT  * FROM bread';
    console.log(sql)
    db.all(sql, (err, db) => {
        if (err) throw err;
        res.render('index', {
            sqlite3: db
        })
    })
})
app.get('/add', function (req, res) {
    res.render('add')
})
app.post('/add', function (req, res) {
    const {
        String,
        Integer,
        Float,
        Date,
        Boolean
    } = req.body
    let sql = `INSERT INTO bread (String, Integer, Float, Date, Boolean) VALUES ('${String}','${Integer}','${Float}', '${Date}','${Boolean}')`;
    console.log(sql)
    db.run(sql, (err) => {
        if (err) throw err;
        res.redirect('/')
    })
})

app.get('/delete/:id', function (req, res) {
    let id = req.params.id
    let sql = 'DELETE FROM bread WHERE id = ?';
    db.run(sql, [id], (err, row) => {
        if (err) throw err;
        console.log('Deleted successfully');
        res.redirect('/')
    })
})
app.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    let sql = `SELECT  * FROM bread WHERE id = ${id}`;
    db.get(sql, (err, db) => {
        if (err) throw err;
        res.render('edit', {
            item: db
        });
    })
})

app.post('/edit/:id', (req, res) => {
    const {
        String,
        Integer,
        Float,
        Date,
        Boolean
    } = req.body
    let id = req.params.id;
    let sql = `UPDATE bread set String = '${String}', Integer = '${Integer}', Float = '${Float}', Date = '${Date}', Boolean = '${Boolean}'
    WHERE id = ${id}`;
    db.run(sql, (err, db) => {
        if (err) throw err;
        res.redirect('/')
    })
})
app.listen(3007, () => {
    console.log("web ini berjalan di localhost:3007")
}) 