import jwt from 'jsonwebtoken';
import { env } from "@/config/env.js";

type JwtPayload = {
  userId: string
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: '1d'
  });
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
