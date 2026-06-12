import app from "../src/app";
import { connectDB } from "../src/config/db";

const ready = connectDB();

export default async function handler(req: any, res: any) {
  await ready;
  return app(req, res);
}
