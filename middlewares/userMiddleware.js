import * as userService from "../services/userService.js";

const userMiddleware = async (context, next) => {
    const user = await context.state.session.get("user");
  
    if (user) {
      const user = await userService.findByEmail(user.email);
      context.user = user[0];
    };
  
    await next();
};
  
export { userMiddleware };