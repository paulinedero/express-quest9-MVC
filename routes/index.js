const moviesRouter = require('./movie');
const userRouter = require('./user');

const setupRoutes = (app) => {
  // Movie routes
  app.use('/api/movie', moviesRouter);
  // User routes
  app.use('/api/user', userRouter);
};

module.exports = {
  setupRoutes,
};