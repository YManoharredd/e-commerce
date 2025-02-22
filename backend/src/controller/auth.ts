import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../error";
import { asyncHandler } from "../middleware/error";
import dotenv from "dotenv";
import {
  CreateUserSchema,
  LoginUserSchema,
  UserJson,
  userModel,
  validators,
} from "../model/UserModel";
import { ApiType, ResponseBody } from "../types";
import { HttpStatusCode } from "../utils";

export const authRouter = Router();
dotenv.config();
export interface AuthApiTypes {
  signup: ApiType<CreateUserSchema, ResponseBody<null>>;
  login: ApiType<LoginUserSchema, ResponseBody<LoginResponse>>;
}

authRouter.post(
  "/signup",
  asyncHandler(async (req, res) => {
    console.log("user signup is called");
    const user = validators.createUser.validateSync(req.body);
    console.log(user);
    const { password, ...userWithoutPassword } = user;
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    await userModel.create({
      ...userWithoutPassword,
      password: hashedPassword,
    });
    const ret: AuthApiTypes["signup"]["response"] = {
      error: null,
      data: null,
    };
    res.status(HttpStatusCode.Created).json(ret);
  })
);

export interface LoginResponse {
  token: string;
  user: UserJson;
}

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const credentials = validators.loginUser.validateSync(req.body);
    console.log(credentials);
    const user = await userModel.findOne({ email: credentials.email });
    console.log("new api erro", user);
    if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
      console.log("new api erro", user);
      throw new ApiError(401, "Invalid credentials");
    }

    const secret = "engineering";
    console.log("eroor", secret);
    if (!secret) {
      throw new Error("env JWT_SECRET not set");
    }

    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: "7d",
    });

    const ret: AuthApiTypes["login"]["response"] = {
      error: null,
      data: {
        token,
        user: user.toJSON(),
      },
    };

    res.status(HttpStatusCode.Ok).json(ret);
  })
);
