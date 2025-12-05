import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Development fallback credentials
const DEV_ADMIN_EMAIL = "admin@dr-martin.fr";
const DEV_ADMIN_PASSWORD = "admin123";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Try database authentication first
                try {
                    const admin = await prisma.admin.findUnique({
                        where: { email: credentials.email }
                    });

                    if (admin) {
                        const isPasswordValid = await bcrypt.compare(
                            credentials.password,
                            admin.password
                        );

                        if (isPasswordValid) {
                            return {
                                id: admin.id,
                                email: admin.email,
                                name: "Dr. Martin"
                            };
                        }
                        return null;
                    }
                } catch (error) {
                    console.warn("Database auth failed, trying dev fallback:", error);
                }

                // Development fallback: allow login with dev credentials
                if (process.env.NODE_ENV === "development" || process.env.ALLOW_DEV_LOGIN === "true") {
                    if (
                        credentials.email === DEV_ADMIN_EMAIL &&
                        credentials.password === DEV_ADMIN_PASSWORD
                    ) {
                        console.log("⚠️  DEV MODE: Using development admin credentials");
                        return {
                            id: "dev-admin-id",
                            email: DEV_ADMIN_EMAIL,
                            name: "Dr. Martin (Dev)"
                        };
                    }
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: "/admin/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
