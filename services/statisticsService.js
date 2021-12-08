import { executeQuery } from "../database/database.js";

const numberOfUserAnswers = async (user_id) => {
    let res = await executeQuery(
        "SELECT id FROM question_answers WHERE user_id = $1",
        user_id,
    );

    if (!res || !res.rows) {
        res.rows = []
    };

    return res.rows.length;
};

const numberOfCorrectUserAnswers = async (user_id) => {
    let res = await executeQuery(
        "SELECT id FROM question_answers WHERE user_id = $1 AND correct = true;",
        user_id,
    );

    if (!res || !res.rows) {
        res.rows = []
    };

    return res.rows.length;
};

const numberOfAnswersToUser = async (user_id) => {
    let res = await executeQuery(
        `SELECT COUNT(question_answers.id) AS count, questions.user_id AS user_id 
        FROM question_answers INNER JOIN questions ON question_id = questions.id 
        GROUP BY questions.user_id HAVING questions.user_id = $1
        `,
        user_id,
    );

    if (!res || !res.rows || res.rows.length != 1) {
        return 0
    };

    return res.rows[0].count;
};

const usersWithMostAnswers = async () => {
    let res = await executeQuery(
        `SELECT COUNT(question_answers.id) AS count, email 
        FROM question_answers
        INNER JOIN users
        ON user_id = users.id
        GROUP BY email
        ORDER BY count DESC
        LIMIT 5
        `,
    );

    if (!res || !res.rows) {
        res.rows = []
    };

    return res.rows
};

export { 
    numberOfUserAnswers,
    numberOfCorrectUserAnswers,
    numberOfAnswersToUser,
    usersWithMostAnswers
};