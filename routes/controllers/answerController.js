import * as answerService from "../../services/answerService.js";
import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const answerValidationRules = {
    option_text: [validasaur.required, validasaur.minLength(1)],
};

const getAnswerData = async (request) => {
    const body = request.body();
    const params = await body.value;
    let is_correct = false;

    if (params.get("is_correct")) {
        is_correct = true;
    };

    return {
        option_text: params.get("option_text"),
        is_correct: is_correct,
        validationErrors: null,
        answerErrors: null,
        answers: null,
        question: null,
    };
};

const addAnswerToQuestion = async ({ request, response, params, render, user }) => {
    const question_owner = (await questionService.getQuestionById(params.id))[0].user_id;
    if (user.id != question_owner) {
        response.status = 401;
        return;
    };

    const answerData = await getAnswerData(request);

    const correctAnswers = await answerService.findCorrectAnswers(params.id);
    if (answerData.is_correct && correctAnswers.length > 0) {
        answerData.answerErrors = ["A correct answer has already been added to this question."];
        answerData.answers = await answerService.getAnswersToQuestion(params.id);
        answerData.question = (await questionService.getQuestionById(params.id))[0];
        render("question.eta", answerData);
        return;
    };

    const [passes, errors] = await validasaur.validate(
        answerData, 
        answerValidationRules
    );

    if (!passes) {
        console.log(errors);
        answerData.validationErrors = errors;
        answerData.answers = await answerService.getAnswersToQuestion(params.id);
        answerData.question = (await questionService.getQuestionById(params.id))[0];
        render("question.eta", answerData);
    } else {
        await answerService.addAnswer(
            params.id, 
            answerData.option_text, 
            answerData.is_correct
        );

        response.redirect(`/questions/${params.id}`);
    };
};

const deleteAnswerFromQuestion = async ({ params, response, user }) => {
    const question_owner = (await questionService.getQuestionById(params.questionId))[0].user_id;
    if (user.id != question_owner) {
        response.status = 401;
        return;
    };
    
    await answerService.deleteAnswer(params.optionId);

    response.redirect(`/questions/${params.questionId}`);
};

const newUserAnswer = async ({ params, response, user }) => {
    const questionId = params.id;
    const answerId = params.optionId;
    const answer = await answerService.findAnswer(answerId);
    const answerObj = answer[0];
    const correct = answerObj.is_correct;

    await answerService.addUserAnswer(user.id, questionId, answerId, correct);

    if (correct) {
        response.redirect(`/quiz/${questionId}/correct`);
    } else {
        response.redirect(`/quiz/${questionId}/incorrect`);
    };
};

const showCorrectAnswerPage = async ({ render }) => {
    render("correct.eta");
};

const showIncorrectAnswerPage = async ({ params, render}) => {
    const questionId = params.id;
    render("incorrect.eta", {
        correct_answers: await answerService.findCorrectAnswers(questionId),
    });
};

export {
    addAnswerToQuestion, 
    deleteAnswerFromQuestion,
    newUserAnswer,
    showCorrectAnswerPage,
    showIncorrectAnswerPage,
};