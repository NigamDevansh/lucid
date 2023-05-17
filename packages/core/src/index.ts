import http from "http";
import express, { Response, Request } from "express";
import morgan from "morgan";
import cors from "cors";
import { log } from "console-log-colors";
import path from "path";
//  Routes
import registerRoutes from "@routes/index";

interface StartOptions {
  port: number;
  origin?: string;
}
type Start = (options: StartOptions) => Promise<void>;

const start: Start = async ({ port = 8393, origin = "*" }) => {
  log.white("----------------------------------------------------");
  const app = express();
  const server = http.createServer(app);

  // ------------------------------------
  // Server wide middleware
  app.use(express.json());
  app.use(
    cors({
      origin: origin,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(morgan("dev"));

  // ------------------------------------
  // Routes
  app.use(
    "/",
    express.static(path.join(__dirname, "../cms"), { extensions: ["html"] })
  );
  registerRoutes(app);

  log.yellow("Routes initialised");

  // ------------------------------------
  // Error handling
  app.use((req: Request, res: Response) => {
    const error = new Error("Not Found");
    res.status(500).json({
      error: {
        message: error.message,
      },
    });
  });

  // ------------------------------------
  // Start server
  server.listen(port, () => {
    log.white("----------------------------------------------------");
    log.yellow(`CMS started at: http://localhost:${port}`);
    log.yellow(`API started at: http://localhost:${port}/api`);
    log.white("----------------------------------------------------");
  });
};

const exportObject = { start };

export default exportObject;
