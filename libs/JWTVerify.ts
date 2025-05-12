import jwt from "jsonwebtoken";

interface DecodedUser {
  id: string;
  isVerified: boolean;
  status: boolean;
}

export function verifyToken(req: Request): DecodedUser | null {
  const cookie = req.headers.get("cookie");

  if (!cookie) return null;

  const tokenMatch = cookie.match(/user=([^;]+)/);
  const token = tokenMatch?.[1];

  if (!token) return null;

  const secret = process.env.JWT_SECRET || process.env.jwt_decoding;
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret) as DecodedUser;
    return decoded;
  } catch {
    return null;
  }
}
