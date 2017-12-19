const pg = require('pg');
const connection_string = process.env.DATABASE_URL;
const client = new pg.Client(connection_string);


(async () => {
	await client.connect();


	// var query = "INSERT INTO meals(name) values($1)", ['Satay Chicken'];

	// var result = await client.query("CREATE TABLE IF NOT EXISTS test(id serial, name varchar(255))");
	var result = await client.query("INSERT INTO meals(name) values($1)", ['Satay Chicken']);

	result.rows.forEach(row=>{
	    console.log(row);
	});

	await client.end();

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

})();


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