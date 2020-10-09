import { IUser } from "../../app/models/users.model";

declare global{
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}

