require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const { SERVER } = require('./graphql/Schema');

mongoose
	.connect(
		process.env.MONGO_URI,
		{ useNewUrlParser: true }
	)
	.then(() => console.log('DB Connected'))
	.catch(err => console.error(err));

const app = express();

const corsOptions = {
	origin: 'http://localhost:3000',
	credentials: true
};
app.use(cors(corsOptions));

// Middleware: GraphQL
SERVER.applyMiddleware({
	app,
	path: '/graphql'
});

let PORT = 4000;

if (process.env.NODE_ENV === 'production') {
	PORT = process.env.PORT || 4000;
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(PORT, () => {
	console.log('Listening at PORT ', PORT);
});
