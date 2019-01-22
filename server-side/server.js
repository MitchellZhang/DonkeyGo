var express = require('express'),
  app = express(),
  port = process.env.PORT || 3088,
  //mongoose = require('mongoose'),
  Task = require('./src/api/models/productsModel'),
  bodyParser = require('body-parser');

//mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost/Tododb');


app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

/*MySql connection*/
var connection = require('express-myconnection'),
  mysql = require('mysql');


app.use(
  connection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'donkey_go_schema',
    debug: false //set true if you wanna see debug logger
  }, 'request')
);

/*var routes = require('./src/api/routes/productsRoute');
routes(app);*/
//RESTful route
var router = express.Router();


/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
router.use(function (req, res, next) {
  console.log(req.method, req.url);
  next();
});

var curut = router.route('/products');


//show the CRUD interface | GET
curut.get(function (req, res, next) {


  req.getConnection(function (err, conn) {

    if (err) return next("Cannot Connect");

    var query = conn.query('SELECT * FROM products WHERE is_removed!=\'1\'', function (err, rows) {
      console.log(rows)

      if (err) {
        console.log(err);
        return next("Mysql error, check your query");
      }

      //res.render('products',{title:"RESTful Crud Example",data:rows});
      res.send({
        list: rows,
        pagination: {},
      });
    });

  });

});
//post data to DB | POST
curut.post(function (req, res, next) {

  //validation
  //req.assert('title','Title is required').notEmpty();
  // req.assert('email','A valid email is required').isEmail();
  // req.assert('password','Enter a password 6 - 20').len(6,20);

  // var errors = req.validationErrors();
  // if(errors){
  //     res.status(422).json(errors);
  //     return;
  // }

  //get data
  var data = {
    title: req.body.title,
    description: req.body.description,
    original_price: req.body.original_price,
    real_price: req.body.real_price,
    // email:req.body.email,
    // password:req.body.password
  };

  //inserting into mysql
  req.getConnection(function (err, conn) {

    if (err) return next("Cannot Connect");

    var query = conn.query("INSERT INTO products set ? ", data, function (err, rows) {
      console.log('rows:');
      console.log(rows);

      if (err) {
        console.log(err);
        return next("Mysql error, check your query");
      }
      conn.query('SELECT * FROM products WHERE is_removed!=\'1\'', function (err, rows) {
        console.log(rows)

        if (err) {
          console.log(err);
          return next("Mysql error, check your query");
        }

        //res.render('products',{title:"RESTful Crud Example",data:rows});
        res.send({
          list: rows,
          pagination: {},
        });
      });

      //res.sendStatus(200);

    });

  });

});


//now for Single route (GET,DELETE,PUT)
var curut2 = router.route('/products/:product_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/user/:user_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
curut2.all(function (req, res, next) {
  console.log("You need to smth about curut2 Route ? Do it here");
  console.log(req.params);
  next();
});

//get data to update
curut2.get(function (req, res, next) {

  var product_id = req.params.product_id;

  req.getConnection(function (err, conn) {

    if (err) return next("Cannot Connect");

    var query = conn.query("SELECT * FROM products WHERE product_id = ? AND is_removed!='1'", [product_id], function (err, rows) {

      if (err) {
        console.log(err);
        return next("Mysql error, check your query");
      }

      //if user not found
      if (rows.length < 1)
        return res.send("User Not found");

      //res.render('edit',{title:"Edit user",data:rows});
      //res.writeHead(200,{'Content-Type':'application/json'});-go
      res.send(rows[0]);
    });

  });

});

//update data
curut2.put(function (req, res, next) {
  var product_id = req.params.product_id;

  //validation
  req.assert('name', 'Name is required').notEmpty();
  req.assert('email', 'A valid email is required').isEmail();
  req.assert('password', 'Enter a password 6 - 20').len(6, 20);

  var errors = req.validationErrors();
  if (errors) {
    res.status(422).json(errors);
    return;
  }

  //get data
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };

  //inserting into mysql
  req.getConnection(function (err, conn) {

    if (err) return next("Cannot Connect");

    var query = conn.query("UPDATE products set ? WHERE product_id = ? AND is_removed!='1'", [data, product_id], function (err, rows) {

      if (err) {
        console.log(err);
        return next("Mysql error, check your query");
      }

      res.sendStatus(200);

    });

  });

});

var curut2 = router.route('/products/remove');
//delete data
curut2.post(function (req, res, next) {

  var product_id = req.params.product_id;

  req.getConnection(function (err, conn) {

    if (err) return next("Cannot Connect");
    let data={
      is_removed : 1
    }

    var query = conn.query("UPDATE products set ? WHERE product_id = ? ", [data, product_id], function (err, rows) {

      if (err) {
        console.log(err);
        return next("Mysql error, check your query");
      }

      conn.query('SELECT * FROM products WHERE is_removed!=\'1\'', function (err, rows) {
        console.log(rows)

        if (err) {
          console.log(err);
          return next("Mysql error, check your query");
        }

        //res.render('products',{title:"RESTful Crud Example",data:rows});
        res.send({
          list: rows,
          pagination: {},
        });
      });

    });
  });
});

//now we need to apply our router here
app.use('/api', router);

app.listen(port);


console.log('todo list RESTful API server started on: ' + port);