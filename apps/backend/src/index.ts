import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./env";
import { health } from "./routes/health";
import { users } from "./routes/users";

const app = express();
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL ?? "*", credentials: true }));
app.use(express.json());

app.use("/", health);
app.use("/users", users);

app.listen(Number(env.PORT ?? 3001), () => {
  console.log(`API listening on :${env.PORT ?? 3001}`);
});
