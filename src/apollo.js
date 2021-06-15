const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const fs = require('fs')
const path = require('path')
 
const typeDefs = gql(fs.readFileSync(path.resolve(__dirname, './schema.graphql'), { encoding: 'utf8' }));
const resolvers = require('./resolvers/index');
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
server.applyMiddleware({ app });
app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);
