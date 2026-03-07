import jwt from "jsonwebtoken";
const ACCESS_TOKEN_EXPIRY = "7d";
export function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
}
export function requireAuth(req, res, next) {
    const token = req.cookies?.accessToken;
    if (!token) {
        res.status(401).json({ error: "Authentication required" });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
        return;
    }
}
