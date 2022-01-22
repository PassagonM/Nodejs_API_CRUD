let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req,res)=>{
    return res.send({ 
        error: false,
        message: 'Welcome to test node crud api',
    })
})

let dbConnect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_api'
})
dbConnect.connect();

app.get('/all', (req, res) => {
    dbConnect.query('SELECT * FROM books', (error, results, fields) => {
        if(error) throw error;
        
        let message = ""
        if(results === undefined || results.length == 0){
            message = "Table is empty";
        } else {
            message = "Get Success";
        }
        return res.send({
            error: false, 
            data: results, 
            message: message
        });
    })
})

app.post('/add', (req, res) => {
    let something = req.body.something;
    let someauthor = req.body.someauthor;

    if (!something || !someauthor) {
        return res.status(400).send({
            error: true, 
            message: 'Please provide name and author'
        });
    } else {
        dbConnect.query('INSERT INTO books (name, author) VALUE(?,?)', [something, someauthor], (error, results, fields) => {
            if (error) throw error;
            return res.send({ 
                error:false,
                data: results, message: "Add data Success!!"
            })
        })
    }
})

app.get('/data/:id', (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(400).send({
            error:true,
            message: "Don't have ID!!!"
        });
    } else {
        dbConnect.query("SELECT * FROM books WHERE id = ?", id, (error, results, fields) => {
            if (error) throw error;

            let godmessage = "";
            if (results === undefined || results.length == 0) {
                godmessage = "FIX say not found data!!"
            } else {
                godmessage = "Success !!!"
            }

            return res.send({
                error: false,
                data: results[0],
                message: godmessage
            })
        })
    }
})

app.put('/data', (req, res) => {
    let id = req.body.id;
    let something = req.body.something;
    let someauthor = req.body.someauthor;

    if (!id || !someauthor || !something) {
        return res.status(400).send({
            error: true,
            message: 'Fix say you are so noob!!!'
        });
    } else {
        dbConnect.query('UPDATE books set name = ?, author = ? WHERE id = ?', [something, someauthor, id], (error, results, fields) => {
            if (error) throw error;

            let godmessage = "";
            if (results.changedRows === 0) {
                godmessage = "Fix say not found";
            } else {
                godmessage = "Update success!!";
            }
            return res.send({
                error: false,
                data: results,
                message: godmessage
            })
        })
    }
})

app.delete('/data' ,(req, res) => {
    let id = req.body.id

    if (!id){
        return res.status(400).send({
            error: true,
            message: 'God say you are so noob!!'
        });
    } else {
        dbConnect.query('DELETE FROM books WHERE id = ?', [id], (error, results, fields) => {
            if (error) throw error;

            let godmessage = "";
            if (results.affectedRows === 0) {
                godmessage = "Fix say not found";
            } else {
                godmessage = "Success deleted!!";
            }
            return res.send({
                error: false,
                data: results,
                message: godmessage
            })
        })
    }
})

app.listen(3000, () =>{
    console.log('Running on port 3000');
})

module.exports = app;