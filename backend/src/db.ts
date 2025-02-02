import { connect } from "mongoose";
import { Logger } from "./Logger";
import { config } from "dotenv";
config();
export async function connectDb() {
  const logger = new Logger("connectDb");
  try {
    const url = "mongodb://127.0.0.1:27017/buytrend";
    console.log(url);
    if (url) {
      const db = await connect(url);
      logger.info("Connected to DB");
      return db;
    } else {
      throw new Error("env MONGODB_URL not set");
    }
  } catch (e) {
    logger.error("DB connection failed");
    logger.error(e);
  }
  return null;
}
