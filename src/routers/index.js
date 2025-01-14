const userRoute=require('./user_route')
const bookmarkRoute = require('./bookmark_route')
const reviewRoute = require('./review_route')
const { swaggerUi, swaggerDocs } = require("../config/swagger")

function route(app) {
  app.use('/api', userRoute)
  app.use('/api', bookmarkRoute)
  app.use('/api', reviewRoute)
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

};

module.exports = route;