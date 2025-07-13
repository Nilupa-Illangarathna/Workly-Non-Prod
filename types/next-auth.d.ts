import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    worklyid: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      worklyid: string;
      loginid: string;
      phone: string;
      email: string;
      isemailverified: boolean;
      isphoneverified: boolean;
      firstname: string;
      lastname: string;
      status: string;
      level: string;
      commissionrate: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser extends User {
    id: string;
    role: string;
    worklyid: string;
  }
}
