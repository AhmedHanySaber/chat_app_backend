const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        // Check for JWT token in Authorization header
        const auth = req.headers.authorization || '';
        let user = null;
        if (auth.startsWith('Bearer ')) {
            try {
                user = jwt.verify(auth.replace('Bearer ', ''), process.env.JWT_SECRET);
            } catch (e) {
                // Invalid token
            }
        }
        return { user };
    },
});

async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
}

startApolloServer();

module.exports = app;