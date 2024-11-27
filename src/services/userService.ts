import { getRepository } from "typeorm";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import { UserCreate, UserCreateOut } from "../Types/UserT";
import { DeleteI, Roles } from "../Types";
import { uploadFile } from "../utils/SingleFileUploade";
import { DeleteImage } from "../utils/DeleteImages";
import { Request } from "express";
import { plainToClass } from "class-transformer";

export class UserService {
  async get(): Promise<User[] | null> {
    try {
      const users = await User.find({});
      return users;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async addUser(data: UserCreate): Promise<UserCreateOut | null> {
    try {
      const user = User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: bcrypt.hashSync(data.password, 8),
        role: data.role as Roles,
      });
      await user.save();

      return user;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }

  async remove(id: string): Promise<any | null> {
    try {
      const user = await User.delete({ id: parseInt(id) });
      if (user.affected === 0) {
        return null;
      }
      return user;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
  async UpdateProfilePic(id: string, req: Request): Promise<User | null> {
    const user = await User.findOne({
      where: {
        id: parseInt(id),
      },
    });

    let imagePath;

    try {
      imagePath = await uploadFile(req, "profiles");
    } catch (error) {
      imagePath = null;
    }
    const imageTodelete = `public/${user?.profilePic}`;

    if (user?.profilePic !== null) {
      if (imagePath !== null) {
        await DeleteImage(imageTodelete);
      }
    }

    if (user !== null) {
      user.profilePic = imagePath ? imagePath : "";
    }
    // user?.loadImagePath();
    await user?.save();
    return user;
  }
}
