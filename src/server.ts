import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import { authenticateJWT } from "./middleware/authMiddleware";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/api/protected", authenticateJWT, (req, res) => {
  res.json({ message: "You are authorized", user: req.auth });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.name === "UnauthorizedError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    next();
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
