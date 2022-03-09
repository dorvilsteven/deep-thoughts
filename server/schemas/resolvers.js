const { User, Thought } = require('../models');

const resolvers = {
    Query: {
        thoughts: async () => Thought.find().sort({ createdAt: -1 }),
        thoughtsByName: async (parent, { username }) => {
            const name = username ? { username } : {};
            return Thought.find(name).sort({ createdAt: -1 });
        },
    }
};

module.exports = resolvers;