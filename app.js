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
 * Update a meal record's information
 */
app.post('/api/meals/:id', function(req, res) {
	let db = pgp(connection_string);

	const id = req.params.id;
	const updated = moment().format('YYYY-MM-DD HH:mm:ss');

	// Queue up Database transactions
	db.tx(t => {
		var transactions = [];

		if (typeof(req.body.pending) !== "undefined" && typeof(req.body.pending) === "boolean") {
			console.log(req.body.pending);
			var meal_pending = t.none('update meals SET pending = $1 WHERE id = $2', [req.body.pending, id]);
			transactions.push(meal_pending);
		}

		if (req.body.name) {
			var meal_name = t.none('update meals SET name = $1 WHERE id = $2', [req.body.name, id]);
			transactions.push(meal_name);
		}

		if (req.body.description) {
			var meal_description = t.none('update meals SET description = $1 WHERE id = $2', [req.body.description, id]);
			transactions.push(meal_description);
		}

		// Set row updated date/time
		var meal_updated = t.none('update meals SET updated = $1 WHERE id = $2', [updated, id]);
		transactions.push(meal_updated);

		// Resolve all queries
		return t.batch(transactions);
	})
	.then(data => {
		res.json({ status: 'success', data });
	})
	.catch(error => {
		console.log('ERROR:', error);
	})
	.finally(db.$pool.end);
});

app.get('/ingredients', (req, res, next) => {
	res.render('pages/ingredients');
});

app.get('/api/ingredients', function(req, res) {
	let result_object = [];
	let db = pgp(connection_string);

	db.any('select * from ingredients', [true])
		.then(data => {
			res.json({ status: 'success', data });
		})
		.catch(error => {
			console.log('ERROR:', error);
		})
		.finally(db.$pool.end);
});