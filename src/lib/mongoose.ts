import config from "@config/config";
import mongoose from "mongoose";
import chalk from "chalk";
export default function connect() {
  // tslint:disable-next-line: max-line-length
  mongoose.connect(
    config.dbConnect,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    function(err) {
      console.log(`Mongoose default connection with DB : 🖥  ${config.dbName}`);
      if (err) {
        console.log(chalk.red(`Mongoose connect failed:${err}`));
        return;
      }
      console.log(chalk.green("Mongoose connect success"));
    }
  );
}
