const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
var multer = require('multer');
var upload = multer();
app.use(upload.array());
app.use(express.static('public'));

const bcrypt = require('bcrypt');
const saltRounds = 10;

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


app.post('/getList', function (req, res) {


    ShoppingList.findByPk(req.body.id).then(list => {
        bcrypt.compare(req.body.password, list.password, function(error, response) {
            if(response){
                res.send(list.list);
            } else {

                res.status(401).json({error: 'Invalid password'});
            }
        }); 
    
    }).catch(error => {
        res.status(404).json({error: 'List not found'});
    });

});

app.post('/createList', function (req, res) {
    
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        ShoppingList.create({
            name: req.body.name,
            list: '{"data": []}',
            password: hash
        }).then((response) => {
            res.json({
                newListId: response.id
            })
        });
      });
});

app.post('/addElement', function (req, res) {
    ShoppingList.findByPk(req.body.id).then(list => {
        bcrypt.compare(req.body.password, list.password, (error, response) => {
            if(response){
                // TODO update list, then send answer
                let data = JSON.parse(list.list);
                data = data.data;
                let nameAlreadyExists = false;
                data.forEach(element => {
                    if(element.name.toLowerCase() == req.body.item ){
                        nameAlreadyExists = true;
                    }
                });
                
                if(!nameAlreadyExists){
                    data.push({name: req.body.item, active: false});
                    list.update({
                        list: JSON.stringify({data: data})
                    }).then(
                        res.json(data)
                    )

                } else {
                    res.json(data);
                }
                
            } else {

                res.status(401).json({error: 'Invalid password'});
            }
        }); 
    
    }).catch(error => {
        res.status(404).json({error: 'List not found'});
    });
});

app.post('/updateElement', function (req, res) {
    ShoppingList.findByPk(req.body.id).then(list => {
        bcrypt.compare(req.body.password, list.password, function(error, response) {
            if(response){
                // TODO update list, then send answer
                res.send(list.list);
            } else {

                res.status(401).json({error: 'Invalid password'});
            }
        }); 
    
    }).catch(error => {
        res.status(404).json({error: 'List not found'});
    });
});

app.post('/removeElement', function (req, res) {
    ShoppingList.findByPk(req.body.id).then(list => {
        bcrypt.compare(req.body.password, list.password, function(error, response) {
            if(response){
                // TODO update list, then send answer
                res.send(list.list);
            } else {

                res.status(401).json({error: 'Invalid password'});
            }
        }); 
    
    }).catch(error => {
        res.status(404).json({error: 'List not found'});
    });
});




app.listen(port, () => console.log(`shopping list backend listening on port ${port}!`));