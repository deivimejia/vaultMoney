import { NextFunction, Request, Response } from 'express';
import { jwtAdapter } from '../../config';
import { User, UserRole } from '../../data/postgres/models/user.models';

export class AuthMiddLeware {
  static async protect(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
      const payload = (await jwtAdapter.validateToken(token)) as { id: string };
      if (!payload) return res.status(401).json({ message: 'Invalid token' });
      const user = await User.findOne({
        where: {
          id: payload.id,
          status: true,
        },
      });
      if (!user) return res.status(401).json({ message: 'Invalid user' });

      req.body.sesionUser = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  static restricTo = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.body.sesionUser.rol)) {
        return res
          .status(403)
          .json({ message: 'You are not authorizated to access this route' });
      }
      next();
    };
  };
}
