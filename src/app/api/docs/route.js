import { NextResponse } from "next/server";
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
      { url: "http://localhost:3000" },
    ],
  },
  apis: ["./src/docs/**/*.yaml"], // aquí swagger busca anotaciones
};

const swaggerSpec = swaggerJsdoc(options);

export async function GET() {
  return NextResponse.json(swaggerSpec);
}