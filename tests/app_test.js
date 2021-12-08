import { superoak } from "../deps.js";
import * as testHelper from "./testHelper.js"
import { app } from "../app.js";

let testQuestionId = null; //The id of the question created during the tests.
let testAnswerId = null; //The id of the answer created during the tests.
let answerOptionIsCorrect = false //The correctness of the answer option created during the tests.

Deno.test({
    name: "Users are able to register using a valid email and password.",
    async fn() {
        //Registering first user:
        await testHelper.getDBready("testing@mail.com");
        let testClient = await superoak(app);
        await testClient.post("/auth/register").send("email=testing@mail.com&password=0000").expect(302).expect("Redirecting to /auth/login.");

        //Registering second user:
        await testHelper.getDBready("testing@mail-2.com");
        testClient = await superoak(app);
        await testClient.post("/auth/register").send("email=testing@mail-2.com&password=1111").expect(302).expect("Redirecting to /auth/login.");
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test("Registered users are able to login when using the correct email and password.", async () => {
    const testClient = await superoak(app);
    await testClient.post("/auth/login").send("email=testing@mail.com&password=0000").expect(302).expect("Redirecting to /questions.");
});

Deno.test("Authenticated users are able to create new questions.", async () => {
    let testClient = await superoak(app);
    const response = await testClient.post("/auth/login").send("email=testing@mail.com&password=0000").expect(302).expect("Redirecting to /questions.");

    const cookie = response.headers["set-cookie"];

    testClient = await superoak(app);
    await testClient.post("/questions").set("Cookie", cookie).send("title=Test&question_text=What?").expect(302).expect("Redirecting to /questions.");
    testQuestionId = await testHelper.updateTestQuestionId("testing@mail.com");
});

Deno.test("Authenticated users are able to add option answers to their own questions through POST requests to /questions/:id/options.", async () => {
    let testClient = await superoak(app);
    const response = await testClient.post("/auth/login").send("email=testing@mail.com&password=0000").expect(302).expect("Redirecting to /questions.");

    const cookie = response.headers["set-cookie"];

    //Randomly choose if the answer option is correct or not
    let sendText = "option_text=That"
    if ([true, false][Math.round(Math.random())]) {
        sendText = "option_text=That&is_correct=on"
        answerOptionIsCorrect = true
    };

    testClient = await superoak(app);
    await testClient.post(`/questions/${testQuestionId}/options`).set("Cookie", cookie).send(sendText).expect(302).expect(`Redirecting to /questions/${testQuestionId}.`);
    testAnswerId = await testHelper.updateTestAnswerId(testQuestionId);
});

Deno.test({
    name: "POST requests to /api/questions/answer with a valid JSON object respond with the correctness of the answer option indicated in the JSON object.",
    async fn() {
      const testClient = await superoak(app);
      //Test the API with the option answer created in the above test. The correctness was chosen randomly above, and saved to a variable which is used here.
      await testClient.post("/api/questions/answer").send({"questionId": testQuestionId, "optionId": testAnswerId}).expect({"correct": answerOptionIsCorrect});
    },
    sanitizeResources: false,
    sanitizeOps: false,
});

Deno.test("Authenticated users are NOT able to add option answers to questions created by other users. Attempting it produces status code 401.", async () => {
    let testClient = await superoak(app);
    const response = await testClient.post("/auth/login").send("email=testing@mail-2.com&password=1111").expect(302).expect("Redirecting to /questions.");

    const cookie = response.headers["set-cookie"];

    testClient = await superoak(app);
    await testClient.post(`/questions/${testQuestionId}/options`).set("Cookie", cookie).send("option_text=This").expect(401);
});

Deno.test("Authenticated users are NOT able to delete option answers from questions created by other users. Attempting it produces status code 401.", async () => {
    let testClient = await superoak(app);
    const response = await testClient.post("/auth/login").send("email=testing@mail-2.com&password=1111").expect(302).expect("Redirecting to /questions.");

    const cookie = response.headers["set-cookie"];

    testClient = await superoak(app);
    await testClient.post(`/questions/${testQuestionId}/options/${testAnswerId}/delete`).set("Cookie", cookie).send().expect(401);
});

Deno.test("Authenticated users are able to delete option answers from their own questions through POST requests to /questions/:questionId/options/:optionId/delete.", async () => {
    let testClient = await superoak(app);
    const response = await testClient.post("/auth/login").send("email=testing@mail.com&password=0000").expect(302).expect("Redirecting to /questions.");

    const cookie = response.headers["set-cookie"];

    testClient = await superoak(app);
    await testClient.post(`/questions/${testQuestionId}/options/${testAnswerId}/delete`).set("Cookie", cookie).send().expect(302).expect(`Redirecting to /questions/${testQuestionId}.`);
    testAnswerId = null;
    answerOptionIsCorrect = false;
});

Deno.test("Authenticated users are NOT able to delete questions created by other users. Attempting it produces status code 401.", async () => {
    let testClient = await superoak(app);
    const response = await testClient.post("/auth/login").send("email=testing@mail-2.com&password=1111").expect(302).expect("Redirecting to /questions.");

    const cookie = response.headers["set-cookie"];

    testClient = await superoak(app);
    await testClient.post(`/questions/${testQuestionId}/delete`).set("Cookie", cookie).send().expect(401);
});

Deno.test("Authenticated users are able to delete their own questions through POST requests to /questions/:id/delete.", async () => {
    let testClient = await superoak(app);
    const response = await testClient.post("/auth/login").send("email=testing@mail.com&password=0000").expect(302).expect("Redirecting to /questions.");

    const cookie = response.headers["set-cookie"];

    testClient = await superoak(app);
    await testClient.post(`/questions/${testQuestionId}/delete`).set("Cookie", cookie).send().expect(302).expect(`Redirecting to /questions.`);
    testQuestionId = null;
    //Deleting users once tests are done
    await testHelper.getDBready("testing@mail.com");
    await testHelper.getDBready("testing@mail-2.com");
});