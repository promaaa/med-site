import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Mock user for MVP
                if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
                    return { id: "1", name: "Dr. Smith", email: "admin@example.com" };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: "/auth/signin", // Custom signin page if needed, or default
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
