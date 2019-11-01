import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
jest.setTimeout(60000);

export async function initDb() {
  const server = new MongoMemoryServer();
  const url = await server.getConnectionString();

  // tslint:disable-next-line: max-line-length
  mongoose.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    },
    err => {
      if (err) {
        console.log("Test Mongoose connect failed");
        return;
      }
    }
  );
}

export async function destoryDb() {
  await mongoose.disconnect();
}
