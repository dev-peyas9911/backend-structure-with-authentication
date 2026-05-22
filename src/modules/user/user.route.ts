import { Router} from "express";
import { userController } from "./user.controller";


const router = Router();

// Create User
router.post("/", userController.createUser);

// Get All Users
router.get("/", userController.getAllUsers);

// Get Single User
router.get("/:id", userController.getSingleUser);

// Update User
router.put("/:id", userController.updateUser);

// Delete User
router.delete("/:id", userController.deleteUser);


export const userRoute = router;