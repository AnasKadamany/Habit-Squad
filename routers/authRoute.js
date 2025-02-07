import express from "express";
import { login, register } from "../Controllers/authController.js";
import verifyToken from "../middleware/verifyToken.js";
const Router = express.Router();

Router.post("/login", login);
Router.post("/register", register);
Router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user }); // Send user data back to the client
});

export default Router;
