import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, age } = payload;
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users(name, email, password, age) 
    VALUES($1, $2, $3, $4)
    RETURNING *
    `,
    [name, email, hashPassword, age],
  );
  delete result.rows[0].password;
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
            SELECT * FROM users
            `);
  // Delete password from each user object
  result.rows.forEach((user) => {
    delete user.password;
  });
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
            SELECT * FROM users
            WHERE id = $1
            `,
    [id],
  );
  delete result.rows[0].password;
  return result;
};

const updateUserFromDB = async (payload: IUser, id: string) => {
  const { name, password, is_active, age } = payload;
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
  delete result.rows[0].password;
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
           DELETE FROM users
           WHERE id=$1 
            `,
    [id],
  );
  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB,
};
