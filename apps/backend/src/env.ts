import { EnvSchema } from "types";
import * as dotenv from "dotenv";
dotenv.config();
export const env = EnvSchema.parse(process.env);
