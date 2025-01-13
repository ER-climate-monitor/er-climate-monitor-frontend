import axios from "axios";
import { config } from "@/config/config";
import { USER_EMAIL_HEADER, USER_PASSWORD_HEADER } from "@/headers/userHeaders";

async function loginUser(email: string, password: string) {
    return await axios.post(config.apiBaseUrl, {
        [USER_EMAIL_HEADER]: email,
        [USER_PASSWORD_HEADER]: password
    });
}

export { loginUser }