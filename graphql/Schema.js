const { ApolloServer } = require('apollo-server-express');
const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

const Recipe = require('../models/Recipe');
const User = require('../models/User');
// Imports: GraphQL TypeDefs & Resolvers
const { TYPEDEFS } = require('./Types');
const { RESOLVERS } = require('./Resolvers');
// GraphQL: Schema

const getCurrentUser = async req => {
	const token = req.headers['authorization'];
	if (token !== 'null') {
		try {
			return await jwt.verify(token, process.env.SECRET);
		} catch (e) {
			throw new AuthenticationError('Your session expired. Sign in again.');
		}
	}
};

exports.SERVER = new ApolloServer({
	typeDefs: TYPEDEFS,
	resolvers: RESOLVERS,
	formatError: error => {
		const message = error.message.replace('SequelizeValidationError: ', '').replace('Validation error: ', '');

		return {
			...error,
			message
		};
	},
	context: async ({ req, res }) => {
		const currentUser = await getCurrentUser(req);
		return {
			currentUser,
			Recipe,
			User
		};
	},
	playground: {
		endpoint: `http://localhost:4000/graphql`,
		settings: {
			'editor.theme': 'light'
		}
	}
});
