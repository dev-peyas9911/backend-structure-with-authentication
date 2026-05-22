import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import config from "./config";
const app: Application = express();
// const port = 5000;

// middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// pool for database connection
const pool = new Pool({
  connectionString: config.connection_string,
});

const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(20) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        age INT,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};
initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Express server",
  });
});

// Create User
app.post("/api/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;

    const result = await pool.query(
      `
    INSERT INTO users(name, email, password, age) 
    VALUES($1, $2, $3, $4)
    RETURNING *
    `,
      [name, email, password, age],
    );

    res.status(201).json({
      success: true,
      message: "User Created Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

// Get All Users
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
            SELECT * FROM users
            `);
    // console.log(result);
    res.status(200).json({
      success: true,
      message: "Users retrived successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

// Get Single User
app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
            SELECT * FROM users
            WHERE id = $1
            `,
      [id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }
    // console.log(result);
    res.status(200).json({
      success: true,
      message: "User retrived successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

// Update User
app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, is_active, age } = req.body;
  try {
    const result = await pool.query(
      `
            UPDATE users
            SET 
            name=COALESCE($1, name),
            password=COALESCE($2, password),
            is_active=COALESCE($3, is_active),
            age=COALESCE($4, age)
            WHERE id=$5
            RETURNING *
            `,
      [name, password, is_active, age, id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

// Delete user
app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
           DELETE FROM users
           WHERE id=$1 
            `,
      [id],
    );
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
    // console.log(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
