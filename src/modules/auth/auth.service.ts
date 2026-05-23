import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;
  //   check if the user exist or not
  // compare password
  // generate token
  const userData = await pool.query(
    `
       SELECT * FROM users
       WHERE email=$1 
        `,
    [email],
  );
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }
  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);
  console.log(matchPassword);
  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  //   Generate token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  };
  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "2d",
  });
  const refreshToken = jwt.sign(jwtPayload, config.refresh_secret as string, {
    expiresIn: "20d",
  });
  return { accessToken, refreshToken };
};

const generateFreshToken = async (token: string) => {
 
  if (!token) {
    throw new Error("Unauthorized")
  }
  const decoded = jwt.verify(
    token as string,
    config.refresh_secret as string,
  ) as JwtPayload;
  const userData = await pool.query(
    `
        SELECT * FROM users
        WHERE email=$1
        
        `,
    [decoded.email],
  );
  const user = userData.rows[0];
  if (userData.rows.length === 0) {
   throw new Error("User not found")
  }
  if (!user?.is_active) {
    throw new Error("User not active")
  }

  //   Generate token
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  };
  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "2d",
  });
  return {accessToken};
};

export const authService = {
  loginUserIntoDB,
  generateFreshToken,
};
