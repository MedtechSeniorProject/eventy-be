import { ExpressMiddlewareInterface } from "routing-controllers";
import { verifyToken } from "./jwt.util";

export class CheckAutheticated implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: (err?: any) => any): any {
    // check if bearer token exists
    const bearerToken = request.headers["authorization"];
    if (!bearerToken) {
      response.status(401).send({
        message: "No token provided",
      });
      return;
    }
    // check if token is valid
    // if valid, set user to request.user
    // if not, send 401
    const token = bearerToken.split(" ")[1];
    try {
      const payload = verifyToken(token);
      if (!payload) {
        response.status(401).send({
          message: "Unauthorized",
        });
        return;
      }
      request.user = payload;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        response.status(401).send({
          message: "Token expired",
        });
        return;
      }
      response.status(401).send({
        message: "Unauthorized",
      });
      return;
    }
  }
}
