import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export async function registerUser(email, password) {
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: email,
      passwordHash: passwordHash,
    },
  });

  return user;
}

export async function loginUser(email, password) {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
  
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }
  
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  
    if (!passwordMatches) {
      throw new Error("INVALID_CREDENTIALS");
    }
  
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  
    return token;
  }