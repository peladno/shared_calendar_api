import jwt from 'jsonwebtoken';
import { AuthResponseDTO } from '../core/dto/auth/auth-response.dto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '7d';

// interface JwtPayload {
//   userId: string;
//   email: string;
// }

export function signToken(payload: AuthResponseDTO): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthResponseDTO {
  return jwt.verify(token, JWT_SECRET) as AuthResponseDTO;
}
