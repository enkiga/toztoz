"use server";

import { Resend } from "resend";

const Key = process.env.NEXT_PUBLIC_RESEND_API_KEY;

const resend = new Resend(Key);

export const sendEmail = async (email: string) => {
  return await resend.emails.send({
    to: email,
    from: "eenkiga@gmail.com",
    subject: "Welcome to Toztoz",
    html: "",
  });
};
