Project doocumentation

This app is for creating multiple choice questions (with only one correct answer). 
Users can answer eachother's questions in the quiz feature of the app, which provides 
the user with a random question from the whole database. Users can't add or delete 
answers to other users questions, or delete other users questions, but they can do so
with their own ones. Users can also view statistics regarding their own answers, answers
to their questions, and the top five answerers on the app.

Some additional features I added on top of what was asked in the assignment description:
 - Each question can only have one correct answer and attempting to add another shows the
    question page with an error.
 - Attempting to register a user with an email that already belongs to a user shows the 
    registering page with an error and the email field populated.


Running the application locally:
1. Create a database with the following tables (I have been using ElephantSQL for this):
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        password CHAR(60)
    );

    CREATE TABLE questions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(256) NOT NULL,
        question_text TEXT NOT NULL
    );

    CREATE TABLE question_answer_options (
        id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES questions(id),
        option_text TEXT NOT NULL,
        is_correct BOOLEAN DEFAULT false
    );

    CREATE TABLE question_answers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        question_id INTEGER REFERENCES questions(id),
        question_answer_option_id INTEGER REFERENCES question_answer_options(id),
        correct BOOLEAN DEFAULT false
    );

    CREATE UNIQUE INDEX ON users((lower(email)));
2. Add the database credentials to the connection pool on line 4 of the file database.js 
    in folder database. The credentials should be in the following format:
        hostname: "host",
        database: "database-name",
        user: "usually the same as database-name",
        password: "password",
        port: 5432,
3. Save the changes and go to terminal.
4. Make sure you are in the root folder of the app.
5. Run the following command: deno run --unstable --allow-all run-locally.js
6. Now you should be able to use the application at the address http://localhost:7777 


Running the application tests:
1. Create a testing database with the same tables as above, and add it's credentials in 
    the same way as in the above instructions ("Running the application locally").
2. Save the changes and go to terminal.
4. Make sure you have closed the running local application, as otherwise the tests won't
    work (the database seems to be unable to handle that many connections). You can also
    close the browser where the application is open if the tests still aren't working.
4. Make sure you are in the root folder of the app.
5. Run the command: deno test --allow-all --unstable