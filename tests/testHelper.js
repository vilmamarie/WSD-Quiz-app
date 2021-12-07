import * as userService from "../services/userService.js";
import * as questionService from "../services/questionService.js";
import * as answerService from "../services/answerService.js";

//These are helper functions for the file app_test.js. I put them here to make app_test.js easier to read.

const getDBready = async (email) => { //Fully removes the user with the parameter email. Removes all content relating to the user from the DB.
    const user = await userService.findByEmail(email);
    if (user.length < 1) {
        return;
    };

    const userId = user[0].id;
    const userQs = await questionService.questionsById(userId);

    for (const question of userQs) {
        const qId = question.id;
        const answers = await answerService.getAnswersToQuestion(qId);
        for (const answer of answers) {
            const aId = answer.id;
            await answerService.deleteAnswer(aId);
        };
        await questionService.deleteQuestion(qId)
    };
    
    await userService.deleteUser(userId);
};

const updateTestQuestionId = async (email) => { //Returns the id of the question created during tests.
    const user = await userService.findByEmail(email);
    if (user.length < 1) {
        return;
    };

    const userId = user[0].id;
    const userQs = await questionService.questionsById(userId);

    return userQs[0].id;
};

const updateTestAnswerId = async (question_id) => { //Returns the id of the answer created during tests.
    if (!question_id) {
        return;
    };

    const answers = await answerService.getAnswersToQuestion(question_id);

    return answers[0].id;
};

export { getDBready, updateTestQuestionId, updateTestAnswerId }