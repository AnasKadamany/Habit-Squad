import express from "express";
import { login } from "../Controllers/authController.js";
const Router = express.Router();

Router.get("/login", login);

export default Router;
