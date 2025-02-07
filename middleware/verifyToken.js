import jwt from "jsonwebtoken";
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Error With Credintials" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};
export default verifyToken;
