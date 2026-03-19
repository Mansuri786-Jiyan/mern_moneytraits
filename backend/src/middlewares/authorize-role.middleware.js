import { ForbiddenException } from "../utils/app-error.js";

export const authorizeRoles = (...roles) => (req, _res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
        return next(new ForbiddenException("Access denied for this resource"));
    }
    return next();
};
