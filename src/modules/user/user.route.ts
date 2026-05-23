import { Router} from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";


const router = Router();

// Create User
router.post("/", userController.createUser);

// Get All Users
router.get("/", auth("admin", "agent"), userController.getAllUsers);

// Get Single User
router.get("/:id", userController.getSingleUser);

// Update User
router.put("/:id", userController.updateUser);

// Delete User
router.delete("/:id", userController.deleteUser);


export const userRoute = router;