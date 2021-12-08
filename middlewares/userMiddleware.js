import * as userService from "../services/userService.js";

const userMiddleware = async (context, next) => {
    const userList = await context.state.session.get("user");
  
    if (userList) {
        const user = await userService.findByEmail(userList.email);
        context.user = user[0];
    };
  
    await next();
};
  
export { userMiddleware };