const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const cors = require('cors');
require('dotenv').config({ path: 'variables.env' });

const Recipe = require('./models/Recipe');
const User = require('./models/User');

const { typeDefs } =require('./schema');
const { resolvers } = require('./resolvers');

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('DB Connected'))
    .catch(err => console.error(err));

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}
app.use(cors(corsOptions));

// Set up JWT authentication middleware
app.use(async (req, res, next) => {
    const token = req.headers['authorization'];
    if (token !== 'null') {
        try{
            const currentUser = await jwt.verify(token, process.env.SECRET);
            req.currentUser = currentUser;
        } catch(err) {
            console.log(err);
        }
    }
    next();
});


// Create GraphiQL application
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
}));

//Connect schemas to Graphql
app.use('/graphql', 
        bodyParser.json(), 
        graphqlExpress(({currentUser}) => ({
        schema,
        context: {
            Recipe,
            User,
            currentUser
        }
    }))
);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('Listening at PORT ', PORT);
});