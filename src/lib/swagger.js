import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ELOJIM API",
      version: "1.0.0",
      description: "Documentación de la API del proyecto ELOJIM",
    },
    servers: [
      {
        url: "http://localhost:300", // cámbialo si usas Vercel
      },
    ],
  },
  apis: ["./src/docs/**/*.yaml"], // rutas donde swagger-jsdoc buscará anotaciones
};

export const swaggerSpec = swaggerJsdoc(options);
