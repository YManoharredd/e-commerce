import express, { Router } from "express";
import { authRouter } from "./controller/auth";
import { cartRouter } from "./controller/cart";
import { productRouter } from "./controller/product";
import { errorHandler } from "./middleware/error";
import { HttpStatusCode } from "./utils";

const app = express();
// App middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
const apiRouter = Router();
app.use("/api", apiRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/product", productRouter);
apiRouter.use("/cart", cartRouter);

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.status(HttpStatusCode.Ok).json({ message: "healthy" });
});

// Error handler middleware
app.use(errorHandler);

export const server = app;

export function startServer() {
  const port = process.env.PORT || 3000;
  return server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}
