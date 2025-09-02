const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Message {
        id: ID!
        content: String!
        sender: String!
        createdAt: String!
    }

    type Query {
        messages: [Message!]!
        message(id: ID!): Message
    }

    type Mutation {
        sendMessage(content: String!, sender: String!): Message!
        deleteMessage(id: ID!): Boolean!
    }
`;

const messages = [];

const resolvers = {
    Query: {
        messages: () => messages,
        message: (_, { id }) => messages.find(msg => msg.id === id),
    },
    Mutation: {
        sendMessage: (_, { content, sender }) => {
            const message = {
                id: String(messages.length + 1),
                content,
                sender,
                createdAt: new Date().toISOString(),
            };
            messages.push(message);
            return message;
        },
        deleteMessage: (_, { id }) => {
            const index = messages.findIndex(msg => msg.id === id);
            if (index === -1) return false;
            messages.splice(index, 1);
            return true;
        },
    },
};

module.exports = {
    typeDefs,
    resolvers,
};