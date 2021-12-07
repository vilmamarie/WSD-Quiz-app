import { executeQuery } from "../database/database.js";

const addQuestion = async (user_id, title, question_text) => {
    await executeQuery(
        "INSERT INTO questions (user_id, title, question_text) VALUES ($1, $2, $3);",
        user_id,
        title,
        question_text,
    );
};

const questionsById = async (user_id) => {
    let res = await executeQuery(
        "SELECT * FROM questions WHERE user_id = $1;",
        user_id,
    );
    
    if (!res || !res.rows) {
        res.rows = [];
    };

    return res.rows;
};

const getQuestionById = async (id) => {
    let res = await executeQuery(
        "SELECT * FROM questions WHERE id = $1;",
        id
    );

    return res.rows;
};

const deleteQuestion = async (id) => {
    await executeQuery(
        "DELETE FROM questions WHERE id = $1;",
        id
    );
};

const getRandomId = async () => {
    const res = await executeQuery(
        "SELECT id FROM questions ORDER BY random() LIMIT 1;"
    );

    if (!res || !res.rows) {
        res.rows = [];
    };

    return res.rows;
};

export { 
    addQuestion, 
    questionsById, 
    getQuestionById,
    deleteQuestion,
    getRandomId,
};