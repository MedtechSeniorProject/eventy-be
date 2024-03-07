export function CheckRole(roles: string[]): any {
  return function (request: any, response: any, next: (err?: any) => any): any {
    // check if user object exists
    if (!request.user) {
      response.status(401).send({
        message: "Unauthorized",
      });
      return;
    }
    // check if user has the required role
    const userRole = request.user.role;
    if (!roles.includes(userRole)) {
      response.status(403).send({
        message: "Forbidden",
      });
      return;
    }
    next();
  };
}
