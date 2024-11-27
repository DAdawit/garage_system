import { Request } from "express";
import { User } from "../entities/User";
import { ReportedMenu } from "../entities/ReportedMenu";

export class AdminService {
  async DeActivateUser(req: Request): Promise<User | null> {
    try {
      const user = await User.findOneBy({ id: parseInt(req.params.id) });
      if (!user) {
        return null;
      }

      user.isActive = false;
      await user.save();
      return user;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deactivating user"
      );
    }
  }

  async ActivateUser(req: Request): Promise<User | null> {
    try {
      const user = await User.findOneBy({ id: parseInt(req.params.id) });
      if (!user) {
        return null;
      }

      user.isActive = true;
      await user.save();
      return user;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while activating user"
      );
    }
  }
}
