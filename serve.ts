import { existsSync} from "node:fs";
import * as dotenv from "dotenv";

let envPath;
if (existsSync("/.dockerenv")) {
	envPath = "/opt/config/.env";
} else {
	envPath = "./.env";
}

dotenv.config({
	path: envPath
});

import "./main";