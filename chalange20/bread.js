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

app.get('/', (req, res) => {
    let result = [];
    let filterData = false;

    if (req.query.check_id && req.query.id) {
        result.push(`id = ${req.query.id}`);
        filterData = true;
    }
    if (req.query.check_String && req.query.String) {
        result.push(`String = '${req.query.String}'`);
        filterData = true;
    }
    if (req.query.check_Integer && req.query.Integer) {
        result.push(`Integer = ${req.query.Integer}`);
        filterData = true;
    }
    if (req.query.check_Float && req.query.Float) {
        result.push(`Float = '${req.query.Float}'`);
        filterData = true;
    }
    if (req.query.check_Date && req.query.startDate && req.query.endDate) {
        result.push(`Date BETWEEN '${req.query.startDate}' AND '${req.query.endDate}'`);
        filterData = true;
    }
    if (req.query.check_Boolean && req.query.Boolean) {
        console.log('ini masuk');
        result.push(`Boolean = '${req.query.Boolean}'`);
        filterData = true;
    }

    let sql = `Select * from bread`;
    if (filterData) {
        sql = sql + ` WHERE ${result.join(' AND ')}`
        console.log(sql)
    }
    db.all(sql, (err, row) => {
        res.render('index', {
            data: row,
            query: req.query
        });
    });
});

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

// add
app.get('/add', (req, res) => {
    res.render('add');
});

app.listen(3008, () => {
    console.log("web ini berjalan di localhost:3008")
})