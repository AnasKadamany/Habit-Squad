import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routers/authRoute.js";
const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:3000", //frontend
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", authRouter);

app.listen(process.env.PORT, () => {
  console.log("Server Start At PORT :", process.env.PORT);
});
