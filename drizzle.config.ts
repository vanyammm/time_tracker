import type {Config} from "drizzle-kit";
import {defineConfig} from "drizzle-kit";
import {DATABASE_NAME} from "./src/constants";

// export default {
//     schema: "./db/schema.ts",
//     out: "./drizzle",
//     dialect: "sqlite",
//     driver: "expo",
//     dbCredentials: {
//       url: DATABASE_NAME,
//     },
//   } satisfies Config;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo",
});
