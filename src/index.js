const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers');
const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Auth0 configuration
const authConfig = {
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
};

// Set up Auth0 middleware
const checkJwt = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
    }),
    audience: authConfig.audience,
    issuer: `https://${authConfig.domain}/`,
    algorithms: ['RS256'],
});

// Apply the Auth0 middleware to your Express app
app.use(checkJwt);

// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        // Here you can access the user info from the request if needed
        // const user = req.user;
        return { req }; // You can pass more context if needed
    },
});

// Start the Apollo server and apply it as middleware to Express
(async () => {
    await server.start();
    server.applyMiddleware({ app });

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
    });
})();
