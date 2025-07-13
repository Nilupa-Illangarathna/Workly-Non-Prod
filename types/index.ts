import { KYCSchema } from "@/schemas";
import { z } from "zod";

export interface SessionUser {
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
}

export interface dbUser {
  id: string;
  role: string;
  worklyid: string;
  loginid: string;
  nicnumber: string;
  dateofbirth: Date;
  phone: string;
  whatsapp: string;
  email: string;
  is_email_verified: boolean | null;
  is_phone_verified: boolean | null;
  firstname: string | null;
  lastname: string;
  fullname: string | null;
  status: string;
  address: string;
  district: string;
  postalcode: string | null;
  country: string;
  profilepic?: string | null;
}

export interface Partner {
  id: string;
  userid: string;
  status: string;
  level: number;
  commissionrate: string;
  createdat: Date;
  updatedat: Date;
  deletedat: Date | null;
  companyname: string | null;
  amount: string;
}

export interface PartnerTypes {
  id: string;
  worklyId: string;
  loginId: string;
  phone: string;
  whatsapp: string;
  email: string;
  isEmailVerified: boolean | null;
  isPhoneVerified: boolean | null;
  firstName: string;
  lastName: string;
  status: string;
  level: number | null;
  nicNumber: string;
  profilePic: string | null;
  dateofbirth: Date;
  address: string;
  language: string;
  district: string;
  country: string;
  createdat: Date;
  deletedat: Date | null;
  commissionrate: string | null;
  pendingamount: string | null;
  withdrawableamount: string | null;
}

export interface PaymentMethod {
  id: string;
  userid: string;
  type: string;
  email: string | null;
  holder: string | null;
  bank: string | null;
  branch: string | null;
  number: string | null;
  createdat: Date;
  updatedat: Date;
}

export interface Payments {
  id: string;
  createdAt: Date;
  userId: string | null;
  amount: string;
  status: "pending" | "approved" | "rejected";
  image: string | null;
}

export interface PaymentHistory {
  id: string;
  status: "pending" | "approved" | "rejected";
  type: "direct" | "bank" | "online";
  userid: string | null;
  createdat: Date;
  amount: string;
  totalamount: string | null;
  image: string | null;
  worklyid: string | null;
  name: string;
  email: string | null;
  phone: string | null;
}

export interface withdrawalHistory {
  id: string;
  amount: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  partner: {
    worklyid: string;
    name: unknown;
    email: string;
    phone: string;
  };
  paymentMethod: {
    id: string;
    type: string;
    email: string | null;
    bank: string | null;
    holder: string | null;
    number: string | null;
    branch: string | null;
  };
}

export interface pendingWithdrawal {
  id: string;
  amount: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  partner: {
    worklyid: string;
    name: string;
    email: string;
    phone: string;
    totalEarnings: string | null;
  };
  paymentMethod: {
    id: string;
    type: string;
    email: string | null;
    bank: string | null;
    holder: string | null;
    number: string | null;
    branch: string | null;
  };
}

export interface PendingPayment {
  id: string;
  amount: string;
  type: "direct" | "bank" | "online";
  status: "pending" | "approved" | "rejected";
  createdat: Date;
  user: {
    id: string;
    worklyid: string;
    name: string;
    email: string;
    phone: string;
  };
}

export type KYC = z.infer<typeof KYCSchema>;

export interface PaymentMethods {
  id: string;
  type: string;
  email?: string | null;
  bank?: string | null;
  number?: string | null;
}

export interface KYCData {
  idfront: string | null;
  idback: string | null;
  id: string;
  userid: string | null;
  status: "pending" | "approved" | "rejected";
  type: string;
  createdat: Date;
  updatedat: Date;
}
