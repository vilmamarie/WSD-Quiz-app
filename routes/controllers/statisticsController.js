import * as statisticsService from "../../services/statisticsService.js";

const showStats = async ({ render, user }) => {
    const data = {
        answers_given: await statisticsService.numberOfUserAnswers(user.id),
        correct_answers: await statisticsService.numberOfCorrectUserAnswers(user.id),
        answers_received: await statisticsService.numberOfAnswersToUser(user.id),
        top_five: await statisticsService.usersWithMostAnswers(),
    };

    render("statistics.eta", data);
};

export { showStats };