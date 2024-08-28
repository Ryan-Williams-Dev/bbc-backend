const User = require('../models/User');

const resolvers = {
    Query: {
        users: async () => await User.find(),
    },
};

module.exports = resolvers;
