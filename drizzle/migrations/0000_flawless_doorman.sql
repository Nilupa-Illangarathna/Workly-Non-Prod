CREATE TYPE "public"."kyc_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."partner_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'partner', 'student_partner', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('direct', 'bank', 'online');--> statement-breakpoint
CREATE TYPE "public"."commission_category" AS ENUM('course_payment', 'expenses', 'development', 'total_commission', 'top_managers', 'sub_company');--> statement-breakpoint
CREATE TABLE "kyc" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userid" uuid,
	"idfront" text NOT NULL,
	"idback" text NOT NULL,
	"status" "kyc_status" DEFAULT 'pending' NOT NULL,
	"createdat" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedat" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userid" uuid,
	"status" "partner_status" DEFAULT 'pending' NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"companyname" text,
	"commissionrate" numeric(6, 2) DEFAULT '0' NOT NULL,
	"amount" numeric(10, 2) DEFAULT '0',
	"createdat" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedat" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedat" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"worklyid" text NOT NULL,
	"firstname" text NOT NULL,
	"lastname" text NOT NULL,
	"nicnumber" text NOT NULL,
	"dateofbirth" timestamp NOT NULL,
	"phone" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text NOT NULL,
	"is_email_verified" boolean DEFAULT false,
	"is_phone_verified" boolean DEFAULT false,
	"language" text NOT NULL,
	"address" text NOT NULL,
	"district" text NOT NULL,
	"country" text NOT NULL,
	"loginid" text NOT NULL,
	"password" text NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"status" "user_status" DEFAULT 'pending' NOT NULL,
	"createdat" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedat" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedat" timestamp with time zone,
	CONSTRAINT "users_worklyid_unique" UNIQUE("worklyid"),
	CONSTRAINT "users_nicnumber_unique" UNIQUE("nicnumber"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_whatsapp_unique" UNIQUE("whatsapp"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_loginid_unique" UNIQUE("loginid")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userid" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"totalamount" numeric(8, 2) DEFAULT '0',
	"type" "payment_type" NOT NULL,
	"image" text,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"createdat" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedat" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrerid" uuid NOT NULL,
	"referredid" uuid NOT NULL,
	"createdat" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedat" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verificationtoken" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commission_distributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" "commission_category" NOT NULL,
	"amount" numeric NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "partner_earnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"reference_id" uuid,
	"description" text,
	"createdat" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedat" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_withdrawals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partner_id" uuid NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"method" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"transaction_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "kyc" ADD CONSTRAINT "kyc_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partners" ADD CONSTRAINT "partners_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_userid_users_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrerid_users_id_fk" FOREIGN KEY ("referrerid") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referredid_users_id_fk" FOREIGN KEY ("referredid") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verificationtoken" ADD CONSTRAINT "verificationtoken_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_earnings" ADD CONSTRAINT "partner_earnings_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_earnings" ADD CONSTRAINT "partner_earnings_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_earnings" ADD CONSTRAINT "partner_earnings_reference_id_payments_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_withdrawals" ADD CONSTRAINT "partner_withdrawals_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE no action ON UPDATE no action;