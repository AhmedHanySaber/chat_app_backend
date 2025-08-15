const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// Import your typeDefs and resolvers here
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const app = express();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        // You can add auth context here later
        return {};
    }
});

async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
}

startApolloServer();

module.exports = app;