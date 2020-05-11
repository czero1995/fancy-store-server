import moment from "moment";
import config from "@config/config";
import chalk from "chalk";
export default function responseTime(req, res, next) {
  const startTime: any = new Date();
  const requestTime: any = moment(startTime).format("YYYY-MM-DD HH:mm:ss");
  const requestUrl: any = `${req.protocol}://${req.hostname}:${config.serverPort}${req.url}`;
  const calResponseTime = function() {
    const finishTime: any = new Date();
    const responseTime: any = finishTime - startTime + "ms";
    console.log(
      `${requestTime}`,
      chalk.yellow(`${requestUrl}`),
      chalk.green(`${responseTime}`)
    );
  };

  res.once("finish", calResponseTime);
  res.once("close", calResponseTime);
  next();
}
