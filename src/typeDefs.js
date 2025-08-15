const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        rooms: [Room!]
    }

    type Room {
        id: ID!
        name: String!
        members: [User!]
        messages: [Message!]
    }

    type Message {
        id: ID!
        room: Room!
        sender: User!
        text: String!
        createdAt: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        me: User
        rooms: [Room!]
        room(id: ID!): Room
        messages(roomId: ID!): [Message!]
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        createRoom(name: String!): Room!
        joinRoom(roomId: ID!): Room!
        sendMessage(roomId: ID!, text: String!): Message!
    }
`;

module.exports = typeDefs;