import { User } from "@/types/user";


abstract class UserFactory {
    public abstract createUser(): User
}

export default UserFactory