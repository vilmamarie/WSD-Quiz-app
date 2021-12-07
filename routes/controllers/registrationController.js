import { bcrypt, validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";

const userValidationRules = {
    email: [validasaur.required, validasaur.isEmail],
    password: [validasaur.required, validasaur.minLength(4)],
}

const getUserInfo = async (request) => {
    const body = request.body();
    const params = await body.value;

    return {
        email: params.get("email"),
        password: params.get("password"),
    }
}

const registerUser = async ({ request, response, render }) => {
    const userInfo = await getUserInfo(request);

    const userList = await userService.findByEmail(userInfo.email);
    
    const [passes, errors] = await validasaur.validate(
        userInfo,
        userValidationRules
    );

    if (!passes) {
        console.log(errors)
        const data = {
            email: userInfo.email,
            validationErrors: errors,
        }
        render("register.eta", data);
    } else if (userList.length != 0) {
        render("register.eta", {
            email: userInfo.email,
            registerError: "An account with that email already exists."
        });
    } else {
        const hash = await bcrypt.hash(userInfo.password);
        await userService.addUser(userInfo.email, hash);

        response.redirect("/auth/login");
    };
};

const showRegistrationForm = ({ render }) => {
    render("register.eta");
};

export { registerUser, showRegistrationForm }