const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentResolvers = require('./comments');

module.exports = {
    /* modifiers Post i.e each time a query, mutation or subcription 
    returns a post it will go through this and make the required changed defined
    */
    Post: {
       likeCount: (parent) => parent.likes.length,
       commentCount: (parent) => parent.comments.length
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
}