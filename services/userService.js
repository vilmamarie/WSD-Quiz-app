import { executeQuery } from "../database/database.js";

const addUser = async (email, password) => {
    await executeQuery(
        "INSERT INTO users (email, password) VALUES ($1, $2);",
        email,
        password,
    );
};

const findByEmail = async (email) => {
    let res = await executeQuery(
        "SELECT * FROM users WHERE email = $1",
        email,
    );
    
    if (!res || !res.rows) {
        res.rows = [];
    };

    return res.rows;
}

const deleteUser = async (id) => { //This is just used for the automatic tests!
    await executeQuery(
        "DELETE FROM question_answers WHERE user_id = $1",
        id
    );

    await executeQuery(
        "DELETE FROM users WHERE id = $1",
        id
    );
};

export { addUser, findByEmail, deleteUser };