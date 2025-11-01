import { NextResponse } from "next/server";
import db from '@/libs/db';
import bcrypt from 'bcryptjs';

export async function POST(request){
    try{
        const payload = await request.json();

        const { name, lastName, email, password, rolId} = payload;

        // Validación de datos requeridos
        if (!name || !lastName || !email || !password || rolId === undefined) {
            return NextResponse.json({
                message: "Faltan datos requeridos.",
            }, { status: 400 });
        }

        // Verificar si el correo se encuentra registrado
        const emailFound = await db.users.findUnique({ where: { email } });

        if (emailFound) {
            return NextResponse.json({ message: "El correo: " + payload.email + "  ya se encuentra registrado." }, { status: 400 });
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Estructura de datos para la creación del usuario con rol 2 = usuario
        const userData = {
            name,
            lastName,
            email,
            password: hashedPassword,
            rolId: rolId || 2
        };

        // Crear el usuario en la base de datos
        const newUser = await db.users.create({ data: userData });

        console.log("Usuario registrado con éxito");
        return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return NextResponse.json({
            message: "Error interno en el servidor.",
            error: error.message,
        }, { status: 500 });
    }
}