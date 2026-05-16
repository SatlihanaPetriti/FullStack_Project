import { User } from '../../users/Entity/user.entity';
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export { };