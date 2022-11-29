import { existsSync } from "node:fs";
import dotenv from "dotenv";

let envPath: string;
if (existsSync("/.dockerenv")) {
	envPath = "/opt/config/.env";
} else {
	envPath = "./.env";
}

dotenv.config({
	path: envPath,
});

import "./main";
