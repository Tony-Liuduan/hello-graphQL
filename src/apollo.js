const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs')
const path = require('path')

const typeDefs = gql(fs.readFileSync(path.resolve(__dirname, './schema.graphql'), { encoding: 'utf8' }));
const resolvers = require('./resolvers/index');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

server.listen().then(({ url }) => {
  console.log(`  Server ready at ${url}`);
});
