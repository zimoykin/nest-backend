import { User } from "../../_MODEL/user.entity";


declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
