"use server";

import { db } from "@/drizzle/db";
import { kyc, users } from "@/drizzle/schema";
import { supabase } from "@/lib/supabase";
import { eq } from "drizzle-orm";

export async function getUserByLoginId(loginId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.loginid, loginId));

  return user;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));

  if (!user) return null;

  const userPPURL = user.profilepic
    ? await getUserProfilePic(user.profilepic)
    : null;
  const userWithPPURL = { ...user, profilepic: userPPURL };

  return userWithPPURL;
}

const getUserProfilePic = async (filename: string) => {
  const { data, error } = await supabase.storage
    .from("profile-pic")
    .createSignedUrl(filename, 60 * 60 * 24 * 7); // 1 week expiration

  if (error) {
    console.error("Error getting profile picture URL:", error.message);
    return null;
  }
  return data?.signedUrl || null;
};

export async function getKycById(id: string) {
  const [kycData] = await db.select().from(kyc).where(eq(kyc.userid, id));

  if (!kycData) return null;

  const frontImageURL = kycData.idfront
    ? await getKycImages(kycData.idfront)
    : null;

  const backImageURL = kycData.idback
    ? await getKycImages(kycData.idback)
    : null;

  const kycDataWithImages = {
    ...kycData,
    idfront: frontImageURL,
    idback: backImageURL,
  };

  return kycDataWithImages;
}

const getKycImages = async (filename: string) => {
  const { data, error } = await supabase.storage
    .from("kyc-documents")
    .createSignedUrl(filename, 60 * 60 * 24 * 7); // 1 week expiration

  if (error) {
    console.error("Error getting profile picture URL:", error.message);
    return null;
  }
  return data?.signedUrl || null;
};
