import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import db from "@/libs/db"
import bcrypt from "bcrypt"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", placeholder: "ejemplo@gmail.com"},
                password: {label: "Password", type: "password", placeholder: "*******"}
            }, 
            async authorize(credentials, req) {
                const userFound = await db.users.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!userFound || !(await bcrypt.compare(credentials.password, userFound.password))) {
                    throw new Error("Credenciales incorrectas");
                }

                // Mensaje en consola para éxito de inicio de sesión
                console.log(`Inicio de sesión exitoso para el usuario: ${userFound.name}`);
                console.log("Datos del usuario:", userFound); // Añadido para depuración

                //DATOS PARA LA CREACIÓN DE UN TOKEN EN EL FRONTEND
                return {
                    id: userFound.id,
                    name: userFound.name,
                    lastname: userFound.lastname,
                    email: userFound.email,
                    rolId: userFound.rolId
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 2*60*60,
        updateAge: 30*60,
    },
    callbacks: {
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id,
                rolId: token.rolId, 
                lastname: token.lastname,
                document: token.email
            };
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // Guarda todos los datos del usuario en el token
                token.rolId = user.rolId; 
                token.lastname = user.lastname;
                token.email = user.email;
                token.id = user.id;
            }
            return token;
        },
    },   
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};