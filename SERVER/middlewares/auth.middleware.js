import jwt from "jsonwebtoken";

// Middleware לאימות התחברות
export const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error("No token provided");

    const [, token] = authorization.split(' ');
    const secretKey = process.env.JWT_SECRET ?? 'secret';
    const userData = jwt.verify(token, secretKey);

    console.log("Decoded JWT:", userData); // 👈 כאן נראה אם יש groupCode

    req.user = userData;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Auth failed', type: 'auth' });
  }
}

// Middleware גמיש לפי תפקידים
export const authRole = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ msg: 'Auth failed', type: 'auth' });
    }

    if (roles.includes(req.user.role)) {
        return next();
    }

    return res.status(403).json({ msg: 'Forbidden: insufficient permissions', type: 'auth' });
}
