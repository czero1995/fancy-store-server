import "module-alias/register";
import express from "express";
import config from "@config/config";
import connect from "@lib/mongoose";
import sessionRedisMiddleware from "@middleware/SessionRedisMiddleware";
import connectMiddleware from "@middleware/ConnectMiddleware";
import loginMiddleWare from "@middleware/LoginMiddleWare";
import chalk from "chalk";
import cors from 'cors';
// import logger from '@lib/logger'
import router from "./router";
const app = express();
connect();

app.use(cors({
  origin: ['http://uni.fancystore.cn'],
    credentials: true
    }))

app.use(sessionRedisMiddleware);
app.use(connectMiddleware);
app.use(loginMiddleWare);
// app.use(AuthMiddleware)
app.use(router);

app.use(function(err, req, res, next) {
  res.status(404);
  console.log(chalk.red("Error Happends ******"), err.stack);
});

app.listen(config.serverPort, function() {
  console.log(chalk.green(`Node app start at port ${config.serverPort}`));
});

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});
