const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');
const { signToken } = require('../utils/auth');
const resolvers = {
    Query: {
        thoughts: async () => Thought.find().sort({ createdAt: -1 }), // get thoughts
        thought: async (parent, { _id }) => Thought.findOne({ _id }), // get single thought
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        }, // get users
        user: async (parent, { username }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('friends')
                .populate('thoughts');
        } // get single user
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = User.create(args);
            return user;
        },
        login : async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect credentials: email');
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials: password');
            }
        }
    }
};

module.exports = resolvers;