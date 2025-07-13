"use server";

import axios from "axios";

// Function to send OTP via Notify.lk API
export const sendRegisterOTP = async (phoneNumber: string, otp: number) => {
  const user_id = process.env.NOTIFY_USER_ID;
  const api_key = process.env.NOTIFY_API_KEY;
  const to = `94${phoneNumber?.slice(1)}`;
  const sender_id = "NotifyDEMO";
  const message = `Your OTP is: ${otp}`;

  const url = `https://app.notify.lk/api/v1/send`;

  const params = {
    user_id,
    api_key,
    sender_id,
    to,
    message,
  };

  try {
    const response = await axios.post(url, params);
    if (response.data.status === "success") {
      return { sent: true };
    } else {
      return { sent: false };
    }
  } catch (error) {
    console.log(error);
    return { sent: false };
  }
};
