import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);

    const { refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
      secure: false, //in production true
      httpOnly: true,
      sameSite: "lax"
    });

    res.status(201).json({
      success: true,
      message: "Profile Created Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

const refreshToken = async(req: Request, res: Response) => {
  try {
    const result = await authService.generateFreshToken(req.cookies.refreshToken);

    

    res.status(201).json({
      success: true,
      message: "Access token generate",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
}

export const authController = {
  loginUser,
  refreshToken
};
