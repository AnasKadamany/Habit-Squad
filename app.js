import express from "express";
import AuthRouter from "./routers/authRoute.js";
const app = express();
const PORT = 3000;

app.use("/auth", AuthRouter);

app.listen(PORT, () => {
  console.log("Server Start At PORT :", PORT);
});
