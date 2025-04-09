import jwt from 'jsonwebtoken';
import { envs } from './envs';

export class jwtAdapter {
  static async generateToken(payLoad: any, duration: string = '3h') {
    return new Promise((resolve) => {
      jwt.sign(payLoad, envs.JWT_KEY, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        resolve(token);
      });
    });
  }

  static async validateToken(token: string) {
    return new Promise((resolve) => {
      jwt.verify(token, envs.JWT_KEY, (err: any, decoded: any) => {
        if (err) return resolve(null);
        resolve(decoded);
      });
    });
  }
}
