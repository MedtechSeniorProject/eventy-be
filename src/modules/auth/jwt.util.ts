import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function signToken(payload: any) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  if (!secret || !expiresIn) {
    throw new Error("JWT_SECRET and JWT_EXPIRES_IN must be provided");
  }
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET must be provided");
  }
  return jwt.verify(token, secret);
}
