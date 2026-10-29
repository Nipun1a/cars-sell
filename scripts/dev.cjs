const { spawn } = require("node:child_process");
const { existsSync, mkdirSync } = require("node:fs");
const { resolve, join } = require("node:path");
const { randomBytes } = require("node:crypto");
const net = require("node:net");
const root = resolve(__dirname, "..");
require(join(root, "cars-backend/node_modules/dotenv")).config({
  path: join(root, "cars-backend/.env"),
});
const local = process.argv.includes("--local-db");
const children = [];
let stopping = false;
const python =
  process.env.PYTHON_BIN ||
  join(
    root,
    "cars-backend/ml/.venv",
    process.platform === "win32" ? "Scripts/python.exe" : "bin/python",
  );
const frontendPort = Number(process.env.FRONTEND_PORT || 5173);
const apiPort = Number(process.env.PORT || 3000);
const mlPort = Number(process.env.ML_PORT || 5000);
const mongoPort = Number(process.env.LOCAL_MONGO_PORT || 27030);
const origin = "http://localhost:" + frontendPort;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of [...children].reverse()) child.kill();
  process.exitCode = code;
}
function launch(command, args, cwd, env = {}) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: "inherit",
    windowsHide: true,
  });
  children.push(child);
  child.once("error", (error) => {
    console.error("Unable to start a service:", error.message);
    stop(1);
  });
  child.once("exit", (code) => {
    if (!stopping) {
      console.error(
        "A service stopped (code " + code + "). Stopping remaining services.",
      );
      stop(code || 1);
    }
  });
  return child;
}
async function unused(port) {
  return new Promise((resolvePromise, reject) => {
    const socket = net.connect({ host: "127.0.0.1", port });
    socket.once("connect", () => {
      socket.destroy();
      reject(
        new Error(
          "Port " +
            port +
            " is already in use. Stop the existing service or choose another port.",
        ),
      );
    });
    socket.once("error", () => {
      socket.destroy();
      resolvePromise();
    });
  });
}
async function ready(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (stopping) throw new Error("Startup stopped.");
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (response.ok) return;
    } catch {}
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 350));
  }
  throw new Error("Service did not become ready: " + url);
}
async function main() {
  if (!existsSync(python))
    throw new Error(
      "Create the ML virtual environment and install requirements first. See README.md.",
    );
  for (const port of [
    frontendPort,
    apiPort,
    mlPort,
    ...(local ? [mongoPort] : []),
  ])
    await unused(port);
  const env = {
    PORT: String(apiPort),
    ML_API_URL: "http://127.0.0.1:" + mlPort,
    FRONTEND_URL: origin + ",http://127.0.0.1:" + frontendPort,
    APP_URL: origin,
    NODE_ENV: "development",
  };
  if (local) {
    const database = join(root, ".runtime/development-db");
    mkdirSync(database, { recursive: true });
    const mongo =
      process.env.MONGOD_BIN ||
      (process.platform === "win32"
        ? "C:/Program Files/MongoDB/Server/8.0/bin/mongod.exe"
        : "mongod");
    launch(
      mongo,
      [
        "--dbpath",
        database,
        "--bind_ip",
        "127.0.0.1",
        "--port",
        String(mongoPort),
        "--quiet",
        "--logpath",
        join(root, ".runtime/development-mongo.log"),
      ],
      root,
    );
    env.MONGODB_URI = "mongodb://127.0.0.1:" + mongoPort + "/carlo_development";
    env.JWT_SECRET = randomBytes(48).toString("hex");
    console.log(
      "Using a separate local development database. Accounts persist; sessions reset when this launcher restarts.",
    );
  } else if (
    !process.env.MONGODB_URI ||
    !process.env.JWT_SECRET ||
    process.env.JWT_SECRET.length < 32
  ) {
    throw new Error(
      "Configure MONGODB_URI and a strong JWT_SECRET in cars-backend/.env, or run npm run dev:local.",
    );
  }
  launch(python, ["app.py"], join(root, "cars-backend/ml"), {
    PORT: String(mlPort),
    NODE_ENV: "development",
  });
  await ready("http://127.0.0.1:" + mlPort + "/health");
  launch(process.execPath, ["server.js"], join(root, "cars-backend"), env);
  await ready("http://127.0.0.1:" + apiPort + "/api/health");
  launch(
    process.execPath,
    [
      join(root, "cars/node_modules/vite/bin/vite.js"),
      "--host",
      "127.0.0.1",
      "--port",
      String(frontendPort),
      "--strictPort",
    ],
    join(root, "cars"),
    { VITE_API_URL: "/api", API_PROXY_TARGET: "http://127.0.0.1:" + apiPort },
  );
  await ready("http://127.0.0.1:" + frontendPort);
  console.log(
    "\nCarLo is ready at " + origin + "\nPress Ctrl+C to stop all services.",
  );
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
main().catch((error) => {
  console.error(error.message);
  stop(1);
});
