import { executeQuery } from "../database/database.js";

const addAnswer = async (question_id, text, is_correct) => {
    await executeQuery(
        "INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES ($1, $2, $3);",
        question_id,
        text,
        is_correct,
    )
};

const getAnswersToQuestion = async (id) => {
    let res = await executeQuery(
        "SELECT * FROM question_answer_options WHERE question_id = $1;",
        id
    );

    if (!res || !res.rows) {
        res.rows = [];
    };

    return res.rows;
};

const answerByIdAndQuestion = async (answer_option_id, question_id) => {
    let res = await executeQuery(
        "SELECT * FROM question_answer_options WHERE question_id = $1 AND id = $2;",
        question_id,
        answer_option_id,
    );

    if (!res || !res.rows) {
        res.rows = [];
    };

    return res.rows;
};

const getAnswersForApi = async (id) => {
    let res = await executeQuery(
        "SELECT id AS \"optionId\", option_text AS \"optionText\" FROM question_answer_options WHERE question_id = $1;",
        id
    );

    if (!res || !res.rows) {
        res.rows = [];
    };

    return res.rows;
}

const findAnswer = async (id) => {
    let res = await executeQuery(
        "SELECT * FROM question_answer_options WHERE id = $1;",
        id
    );

    if (!res || !res.rows) {
        res.rows = [];
    };

    return res.rows;
}

const deleteAnswer = async (id) => {
    await executeQuery(
        "DELETE FROM question_answers WHERE question_answer_option_id = $1",
        id,
    );
    await executeQuery(
        "DELETE FROM question_answer_options WHERE id = $1",
        id,
    );
};

const addUserAnswer = async (user_id, question_id, answer_id, correct) => {
    await executeQuery(
        "INSERT INTO question_answers (user_id, question_id, question_answer_option_id, correct) VALUES ($1, $2, $3, $4);",
        user_id,
        question_id,
        answer_id,
        correct,
    );
};

const findCorrectAnswers = async (question_id) => {
    let res = await executeQuery(
        "SELECT * FROM question_answer_options WHERE question_id = $1 AND is_correct = true;",
        question_id,
    );

    if (!res || !res.rows) {
        res.rows = [];
    };

    return res.rows;
}

export {
    getAnswersToQuestion, 
    addAnswer, 
    deleteAnswer,
    addUserAnswer,
    findAnswer,
    findCorrectAnswers,
    getAnswersForApi,
    answerByIdAndQuestion
};