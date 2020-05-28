const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

// const { SECRET_KEY } = require('../config');
const config = require('../config/key');
const SECRET_KEY = config.SECRET_KEY;

module.exports = (context) => {
    //context = { ... headers }
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        // Bearer ....
        const token = authHeader.split('Bearer ')[1];
        if(token){
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch(err){
                throw new AuthenticationError('Invalid/Expired Token');
            }
        } 
            throw new Error('Authentication token must be \'Bearer [token]');
    }
    throw new Error('Authorization header must be provided')
}