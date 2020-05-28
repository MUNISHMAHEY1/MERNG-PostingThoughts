const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validator');
const User = require('../../models/User');
// const { SECRET_KEY } = require('../../config');
const config = require('../../config/key');
const SECRET_KEY = config.SECRET_KEY;

function generateToken(user){
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRET_KEY, 
        { expiresIn: '1h' });
}

module.exports = {
    Mutation: {
        async login(_, { username, password }){
            const { errors, valid } = validateLoginInput(username, password);

            if(!valid){
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username });
            
            if(!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = 'Wrong credentials!';
                throw new UserInputError('Wrong credential', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },    
        // register(parent, args, context, info)
        async register(_, 
            { 
                registerInput: { username, email, password, confirmPassword}
            })
            {
                // validate user data
                const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
                if(!valid){
                    throw new UserInputError('Errors', { errors });
                }
                // Make sure user doesn't already exist

                const user = await User.findOne({ username });
                if(user){
                    throw new UserInputError('Username is already taken', {
                        errors: {
                            username: 'This username is taken'
                        }
                    })
                }

                // hash password and create an auth token
                password = await bcrypt.hash(password, 12);

                const newUser = new User({
                    email,
                    username,
                    password,
                    createdAt: new Date().toISOString()
                });

                const res = await newUser.save(); 

                const token = generateToken(res);

                return {
                    ...res._doc, // username, email, createdAt
                    id: res._id,
                    token
                }
        }

    }
}