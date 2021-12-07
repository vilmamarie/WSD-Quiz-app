import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";
import { validasaur } from "../../deps.js";

const questionValidationRules = {
    title: [validasaur.required, validasaur.minLength(1)],
    question_text: [validasaur.required, validasaur.minLength(1)],
}

const getQuestionData = async (request) => {
    const body = request.body();
    const params = await body.value;

    return {
        title: params.get("title"),
        question_text: params.get("question_text"),
        validationErrors: null,
        questions: null
    };
};

const addQuestion = async ({ request, response, render, user }) => {
    const questionData = await getQuestionData(request);

    const [passes, errors] = await validasaur.validate(
        questionData,
        questionValidationRules,
    );

    if (!passes) {
        console.log(errors);
        questionData.validationErrors = errors;
        questionData.questions = await questionService.questionsById(user.id);
        render("questions.eta", questionData);
    } else {
        await questionService.addQuestion(
            user.id,
            questionData.title,
            questionData.question_text,
        );
    
        response.redirect("/questions");
    };
};

const showQuestionsById = async ({ render, user }) => {
    render("questions.eta", {
        questions: await questionService.questionsById(user.id),
    });
};

const showQuestion = async ({ render, response, params, user }) => {
    const question_owner = (await questionService.getQuestionById(params.id))[0].user_id;
    if (user.id != question_owner) {
        response.redirect("/questions");
        return;
    };
    
    const question = await questionService.getQuestionById(params.id);
    if (question.length != 1) {
        response.redirect("/questions");
        return;
    };

    const questionObject = {
        question: question[0],
        answers: await answerService.getAnswersToQuestion(params.id),
    };

    render("question.eta", questionObject);
};

const deleteQuestionFully = async ({ params, response, user }) => {
    const question_owner = (await questionService.getQuestionById(params.id))[0].user_id;
    if (user.id != question_owner) {
        response.status = 401;
        return;
    };
    
    await questionService.deleteQuestion(params.id);

    response.redirect("/questions");
};

const quiz = async ({ response, render }) => {
    const idObj = await questionService.getRandomId();

    if (idObj.length != 1) {
        render("quiz.eta", { error: "No quiz questions have been created yet." });
        return;
    };

    const id = idObj[0].id;

    response.redirect(`/quiz/${id}`);
};

const showQuizQuestion = async ({ params, render }) => {
    const question = await questionService.getQuestionById(params.id);
    if (question.length != 1) {
        response.redirect("/quiz");
        return;
    };

    const questionObject = {
        question: question[0],
        answers: await answerService.getAnswersToQuestion(params.id),
    };
    render("quizQuestion.eta", questionObject);
};

export { 
    addQuestion, 
    showQuestionsById, 
    showQuestion, 
    deleteQuestionFully,
    quiz,
    showQuizQuestion,
};