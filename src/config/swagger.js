const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
require('dotenv').config();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API", 
      version: "1.0.0", 
      description: "API test for MovieMarks", 
    },
    servers: [
      {
        url: process.env.URL_SERVER, 
        description: "MovieMarks development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", 
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "../routers/*.js")], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
