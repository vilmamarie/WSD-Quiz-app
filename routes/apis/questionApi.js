import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const randomQuestion = async ({ response }) => {
    const rand_id = await questionService.getRandomId();
    if (rand_id.length != 1) {
        response.body = {};
        return;
    };
    const question_id = rand_id[0].id;
    const question = (await questionService.getQuestionById(question_id))[0];
    const answers = await answerService.getAnswersForApi(question_id);

    const obj = {
        questionId: question_id,
        questionTitle: question.title,
        questionText: question.question_text,
        answerOptions: answers,
    };
    console.log(obj)

    response.body = obj;
};

const answerQuestion = async ({ request, response }) => {
    const body = request.body({ type: "json" });
    const content = await body.value;
    const option = await answerService.answerByIdAndQuestion(content.optionId, content.questionId);
    
    if (option.length != 1) {
        response.body = { correct: false };
        return;
    };

    const answer_option = option[0];
    if (answer_option.is_correct) {
        response.body = { correct: true };
    } else {
        response.body = { correct: false };
    };
};

export { randomQuestion, answerQuestion };