// lib/devMailer.ts
import nodemailer from "nodemailer";

export async function createDevTransport() {
  // only ever run in development
  if (process.env.NODE_ENV !== "development") {
    throw new Error("createDevTransport should only be used in development");
  }

  // Nodemailer will spin up a new Ethereal account for you
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}
