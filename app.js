const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan');
const methodOverride = require('method-override');
const ejs = require('ejs');
const moment = require('moment');

// Database 
const connection_string = process.env.DATABASE_URL;
const promise = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: promise });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

app.listen(80, () => {
	console.log('Listening on http://localhost:8010');
});

app.get('/', (req, res, next) => {
	let result_object = [];
	let db = pgp(connection_string);

	db.any('select * from meals', [true])
		.then(data => {
			res.render('pages/home', {
				meals: data
			});
		})
		.catch(error => {
			console.log('ERROR:', error);
		})
		.finally(db.$pool.end);
});

app.get('/add-meal', (req, res, next) => {
	res.render('pages/add-meal');
});

app.get('/api/meals', function(req, res) {
	let result_object = [];
	let db = pgp(connection_string);

	db.any('select * from meals', [true])
		.then(data => {
			res.json({ status: 'success', data });
		})
		.catch(error => {
			console.log('ERROR:', error);
		})
		.finally(db.$pool.end);
});

/**
 * Add a new meal to the database using PUT method
 */
app.put('/api/meals', function(req, res) {
	let name = req.body.name,
		description = req.body.description;

	let db = pgp(connection_string);
	db.any('INSERT INTO meals(name, description) values($1, $2)', [name, description])
		.then(data => {
			res.json({ message: name + ' was added to your meal list!' });
		})
		.catch(error => {
			res.json({ status: 500, statusText: error });
		})
		.finally(db.$pool.end);
});

/**
 * Update a meal record
 */
app.post('/api/meals/:id', function(req, res) {

	let db = pgp(connection_string);
	db.any('update meals SET pending = $1 WHERE id = $2', [req.body.pending, req.params.id])
		.then(data => {
			// db.any('select $1 from meals', [req.params.id])
			// 	.then(updated_data => {
			// 		res.json({ status: 'success', updated_data });
			// 		console.log('update:', updated_data);
			// 	})
			// 	.catch(error => {
			// 		console.log('ERROR:', error);
			// 	});
			res.json({ status: 'success', data });
		})
		.catch(error => {
			console.log('ERROR:', error);
		})
		.finally(db.$pool.end);
});


	// var query = "INSERT INTO meals(name) values($1)", ['Satay Chicken'];

	// var result = await client.query("CREATE TABLE IF NOT EXISTS meals(id serial, name varchar(255), pending boolean DEFAULT false, added timestamp DEFAULT current_timestamp, updated timestamp)");
	// var result = await client.query("INSERT INTO meals(name) values($1)", ['Satay Chicken']);

	// result.rows.forEach(row=>{
	//     console.log(row);
	// });

	// await client.end();

	// let query = client.query("CREATE TABLE IF NOT EXISTS meals(id serial, name varchar(255), pending int(1) DEFAULT 0, added timestamp DEFAULT current_timestamp, updated timestamp)");

	// query.on("row", function (row, result) {
	//     result.addRow(row);
	// });

	// query.on("end", function (result) {
	//     console.log(JSON.stringify(result.rows, null, "    "));
	//     client.end();
	// });

	// client.query("INSERT INTO meals(name) values($1)", ['Satay Chicken']);
	// client.query("INSERT INTO emps(firstname, lastname) values($2, $2)", ['Mayor', 'McCheese']);
	
	// var query = client.query("SELECT firstname, lastname FROM emps ORDER BY lastname, firstname");
	// query.on("row", function (row, result) {
	// result.addRow(row);
	// });
	// query.on("end", function (result) {
	// console.log(JSON.stringify(result.rows, null, "    "));
	// client.end();

	// });

	// console.log(connection_string);

	// let results = [];

	// .connect(connection_string, (err, client, done) => {
	// 	if (err) {
	// 		done();
	// 		console.log(err);
	// 	}

	// 	let query = client.query('SELECT * FROM items ORDER BY id ASC;');

	// 	query.on('row', (row) => {
	// 		results.push(row);
	// 	});
 
	// 	query.on('end', () => {
	// 		done();
	// 		// return res.json(results);
	// 		console.log(results);
	// 	});

	// });



// router.put('/api/v1/todos/:todo_id', (req, res, next) => {
//   const results = [];
//   // Grab data from the URL parameters
//   const id = req.params.todo_id;
//   // Grab data from http request
//   const data = {text: req.body.text, complete: req.body.complete};
//   // Get a Postgres client from the connection pool
//   pg.connect(connectionString, (err, client, done) => {
// 	// Handle connection errors
// 	if(err) {
// 	  done();
// 	  console.log(err);
// 	  return res.status(500).json({success: false, data: err});
// 	}
// 	// SQL Query > Update Data
// 	client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
// 	[data.text, data.complete, id]);
// 	// SQL Query > Select Data
// 	const query = client.query("SELECT * FROM items ORDER BY id ASC");
// 	// Stream results back one row at a time
// 	query.on('row', (row) => {
// 	  results.push(row);
// 	});
// 	// After all data is returned, close connection and return results
// 	query.on('end', function() {
// 	  done();
// 	  return res.json(results);
// 	});
//   });
// });