import {User} from './user.model'




export class UserFactory {
    createUser(uid: string, email: string): User {
        const user: User = {
        uid: uid,
        email: email ?? "", // fallback in case email is undefined
        createdAt: new Date(),
        };
        return user;
    }
}