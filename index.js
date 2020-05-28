const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const resolvers = require('./graphql/resolvers');
// const { MONGODB } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const config = require('./config/key');

const pubsub = new PubSub();
const PORT = process.env.PORT || 5000;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

const MONGODB = config.MONGODB;
mongoose.connect(MONGODB, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDb Connected!')
        return server.listen(PORT)
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    })
    .catch(err => {
        console.error(err);
    })

