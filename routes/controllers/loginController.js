import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

const login = async ({ request, response, state, render}) => {
    const body = request.body();
    const params = await body.value;
    const email = params.get("email");
    const password = params.get("password");

    const userList = await userService.findByEmail(email);
    if (userList.length != 1) {
        render("login.eta", {LoginError: "Incorrect email or password."});
        return;
    };

    const user = userList[0];

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
        render("login.eta", {LoginError: "Incorrect email or password."});
        return;
    };

    await state.session.set("user", user);
    response.redirect("/questions");
};

const showLoginForm = ({ render }) => {
    render("login.eta");
};

export { login, showLoginForm };