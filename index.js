const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
var multer = require('multer');
var upload = multer();
app.use(upload.array()); 
app.use(express.static('public'));

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    // The `host` parameter is required for other databases
    // host: 'localhost'
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

const ShoppingList = sequelize.define('lists', { list: Sequelize.TEXT, name: Sequelize.STRING, password: Sequelize.STRING });

sequelize.sync()
    .then(() => {
        console.log(`Database & tables created!`);
    });


/*
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
*/


app.get('/', (req, res) => res.send('Shopping list backend'));

app.get('/list/:id', function (req, res) {
    ShoppingList.findByPk(req.params.id).then(list => res.json(list));
});

app.post('/getList', function (req, res) {
    
    res.json({})
});

app.post('/createList', function (req, res) {
    
    res.json({})
});

app.post('/addElement', function (req, res) {
    
    res.json({})
});

app.post('/updateElement', function (req, res) {
    
    res.json({})
});

app.post('/removeElement', function (req, res) {
    
    res.json({})
});




app.listen(port, () => console.log(`shopping list backend listening on port ${port}!`));