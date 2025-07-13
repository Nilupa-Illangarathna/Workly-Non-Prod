import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/schemas";
import { getUserByLoginId } from "@/data/user";
import authConfig from "./auth.config";
import NeonAdapter from "@auth/neon-adapter";
import { Pool } from "@neondatabase/serverless";
import { db } from "./drizzle/db";
import { eq } from "drizzle-orm";
import { partners, users } from "./drizzle/schema";

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return {
    ...authConfig,
    adapter: NeonAdapter(pool),
    session: {
      strategy: "jwt",
      maxAge: 24 * 60 * 60, // 1 day
      updateAge: 6 * 60 * 60, // 6 hours
    },
    providers: [
      CredentialsProvider({
        async authorize(credentials) {
          if (credentials === null) return null;

          const validatedFields = loginSchema.safeParse(credentials);

          if (validatedFields.success) {
            const { loginId, password } = validatedFields.data;

            const user = await getUserByLoginId(loginId);
            if (!user) throw new Error("USER_NOT_FOUND");

            const passwordsMatch = await bcrypt.compare(
              password,
              user.password
            );

            if (passwordsMatch) {
              return {
                id: user.id,
                worklyid: user.worklyid,
                role: user.role,
                email: user.email, // Add any required default fields
              };
            }
          }
          throw new Error("Invalid_Credentials.");
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          if (!user?.id) throw new Error("User ID is undefined.");
          const userDetails = (
            await db.select().from(users).where(eq(users.id, user.id))
          )[0];

          // Validate user role exists
          if (!userDetails.role) {
            throw new Error("User role not defined");
          }

          // Validate allowed roles
          const allowedRoles = ["admin", "partner", "student"];
          if (!allowedRoles.includes(userDetails.role)) {
            throw new Error("Invalid user role");
          }

          let partnerDetails = { level: 0, commission: "0" };
          if (userDetails.role !== "admin" && userDetails.role !== "student") {
            partnerDetails = (
              await db
                .select({
                  level: partners.level,
                  commission: partners.commissionrate,
                })
                .from(partners)
                .where(eq(partners.userid, user.id))
            )[0];
          }

          token.role = userDetails.role;
          token.id = userDetails.id;
          token.worklyid = userDetails.worklyid;
          token.email = userDetails.email;
          token.phone = userDetails.phone;
          token.isemailverified = userDetails.is_email_verified;
          token.isphoneverified = userDetails.is_phone_verified;
          token.firstname = userDetails.firstname;
          token.lastname = userDetails.lastname;
          token.loginid = userDetails.loginid;
          token.status = userDetails.status;
          token.level = partnerDetails.level || 0;
          token.commissionrate = partnerDetails.commission || "0";
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          // Validate required session fields
          if (!token.role || !token.id) {
            throw new Error("Invalid session data");
          }

          // Type safety check
          const allowedRoles = [
            "admin",
            "partner",
            "student",
            "student_partner",
          ];
          if (
            typeof token.role !== "string" ||
            !allowedRoles.includes(token.role)
          ) {
            throw new Error("Invalid role in session");
          }

          session.user.role = token.role;
          session.user.id = token.id;
          session.user.worklyid = token.worklyid;
          session.user.email = token.email;
          session.user.phone = token.phone;
          session.user.isemailverified = token.isemailverified;
          session.user.isphoneverified = token.isphoneverified;
          session.user.firstname = token.firstname;
          session.user.lastname = token.lastname;
          session.user.loginid = token.loginid;
          session.user.role = token.role;
          session.user.status = token.status;
          session.user.level = token.level;
          session.user.commissionrate = token.commissionrate;
        }
        return session;
      },
    },
    pages: {
      signIn: "/login",
    },
  };
});
