import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();

// middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Express server",
  });
});

app.use("/api/users", userRoute);



// Get All Users


// Get Single User


// Update User


// Delete user


export default app;
