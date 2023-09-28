import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import config from "../../config";
import { verifyToken } from "../../helpers/jwtHelpers";

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) throw new ApiError(401, "You are not authorized");

      let verifiedUser = null;

      verifiedUser = verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role))
        throw new ApiError(403, "Forbidden");

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
