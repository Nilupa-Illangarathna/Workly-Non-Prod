import * as z from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    nicNumber: z.string().min(9, "ID number is required"),
    dateOfBirth: z.date({
      required_error: "Date of birth is required",
    }),
    phone: z.string().min(10, "Phone number is required"),
    whatsapp: z.string().min(10, "WhatsApp number is required"),
    email: z.string().email("Invalid email address"),
    language: z.string().min(1, "Please select a language"),
    address: z.string().min(1, "Address is required"),
    district: z.string().min(1, "Please select a district"),
    country: z.string().min(1, "Please select a country"),
    sponsor: z.string().optional(),
    loginId: z.string().min(4, "Login ID must be at least 4 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  loginId: z.string().min(7, "Login ID must be at least 10 characters"),
  password: z.string().min(1, "Password must be at least 1 characters"),
});

export const passwordSchema = z
  .object({
    current: z.string().min(1, "Minimum 1 characters required"),
    new: z.string().min(8, "Minimum 8 characters required"),
    confirm: z.string(),
  })
  .refine((data) => data.new === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const kycSchema = z.object({
  type: z.enum(["nic", "passport", "driving"], {
    required_error: "Type is required",
  }),
  idfront: z
    .instanceof(File)
    .refine((file) => file.size < 5_000_000, "File size must be less than 5MB"),
  idback: z
    .instanceof(File)
    .refine((file) => file.size < 5_000_000, "File size must be less than 5MB")
    .optional(),
});

export const paymentMethodSchema = z.object({
  type: z.enum(["skrill", "binance", "bank"], {
    required_error: "Type is required",
  }),
  email: z.string().email().optional(),
  holder: z.string().optional(),
  bank: z.string().optional(),
  branch: z.string().optional(),
  number: z.string().optional(),
});

export const paymentSchema = z
  .object({
    amount: z.string().min(1, "Amount is required"),
    type: z.enum(["direct", "bank", "online"]),
    file: z.instanceof(File),
  })
  .refine(
    (data) =>
      data.file.size < 5_000_000 &&
      ["image/jpeg", "image/png", "application/pdf"].includes(data.file.type),
    {
      message: "Invalid file type or size",
    }
  );

export const PendingPaymentSchema = z.object({
  id: z.string(),
  amount: z.string(),
  type: z.enum(["direct", "bank", "online"]),
  status: z.enum(["pending", "approved", "rejected"]),
  createdat: z.date(),
  user: z.object({
    id: z.string(),
    worklyid: z.string(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
});
export type TPendingPayment = z.infer<typeof PendingPaymentSchema>;

export const KYCStatusSchema = z.enum(["pending", "approved", "rejected"]);
export type KYCStatus = z.infer<typeof KYCStatusSchema>;

export const KYCSchema = z.object({
  id: z.string(),
  userId: z.string(),
  idFront: z.string(),
  idBack: z.string(),
  status: KYCStatusSchema,
  type: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.object({
    id: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
});

export const WithdrawalSchema = z.object({
  amount: z.coerce.number().positive(),
  method: z.string().min(1, "Method is required"),
});

export const updateUserSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  nicnumber: z.string().min(10, "ID number is required").optional(),
  dateofbirth: z
    .date({
      required_error: "Date of birth is required",
    })
    .optional(),
  email: z.string().email(),
  phone: z.string().min(9),
  whatsapp: z.string().min(9),
  address: z.string().min(5),
  district: z.string().min(3),
  postalcode: z.string().min(4),
  country: z.string().min(2).optional(),
});
