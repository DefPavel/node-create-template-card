import axios from "axios";
import config from "../config";
import { User } from "../entity/user";

export const getToken = async (userData: User): Promise<User> => {
    
    const {data, status} = await axios.post<User>(config.HOST_API + "/api/auth", userData);

    if (status !== 200) return null;

    return {
        login: userData.login,
        password: userData.password,
        id_module: userData.id_module,
        auth_token: data.auth_token,
    }
}