import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";
import * as answerController from "./controllers/answerController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as statisticsController from "./controllers/statisticsController.js";
import * as loginController from "./controllers/loginController.js";
import * as questionApi from "./apis/questionApi.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/questions", questionController.showQuestionsById);
router.post("/questions", questionController.addQuestion);
router.post("/questions/:id/delete", questionController.deleteQuestionFully);

router.get("/questions/:id", questionController.showQuestion);
router.post("/questions/:id/options", answerController.addAnswerToQuestion);
router.post("/questions/:questionId/options/:optionId/delete", answerController.deleteAnswerFromQuestion);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.login);

router.get("/quiz", questionController.quiz);
router.get("/quiz/:id", questionController.showQuizQuestion);
router.post("/quiz/:id/options/:optionId", answerController.newUserAnswer);

router.get("/quiz/:id/correct", answerController.showCorrectAnswerPage);
router.get("/quiz/:id/incorrect", answerController.showIncorrectAnswerPage);

router.get("/statistics", statisticsController.showStats);

router.get("/api/questions/random", questionApi.randomQuestion);
router.post("/api/questions/answer", questionApi.answerQuestion);

export { router };
