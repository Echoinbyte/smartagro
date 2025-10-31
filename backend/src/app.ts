import express, { urlencoded } from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route import
const ApiVersion = "/api/v1";
import userRouter from "./router/user.route";
import productRouter from "./router/problem.route";

// router declaration
app.use(`${ApiVersion}/users`, userRouter);
app.use(`${ApiVersion}/products`, productRouter);

export default app;
