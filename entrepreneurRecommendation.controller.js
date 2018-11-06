const entrepreneurSurveyService = require('../services/survey.services');
const resourcesByAnswers = require ('../services/resources.service');
const coachRecommendationService = require('../services/coachRecommendation.services');
const responses = require ('../models/responses/index');
const checkSurveyType = require('../filters/EntrepreneurAssessment');

const readInstanceById = (req, res) => {
    const id = req.params.id;
    const promise = entrepreneurSurveyService.readInstanceById(id);
    promise
        .then(response => {
            let survey = response[0].typeId
            if (checkSurveyType(survey) === true) {
                entrepreneurSurveyService.readAnswersByInstanceId(id)
                    .then(response => {
                        let answersArray = [87, 114, 142]; //hard-coded for testing purposes
                        let instanceId = 62; //hard-coded for testing purposes
                        let promises = [];
                        for (let i = 0; i < answersArray.length; i++) {
                            promises.push(resourcesByAnswers.getById(answersArray[i]))
                        }
                        promises.push(coachRecommendationService.getRecommendations(instanceId))
                        Promise.all(promises)
                            .then(results => {
                                res.set(200).send(results)
                            })
                    })
            }
            else {
                const responseObj = new responses.ErrorResponse();
                res.status(500).send(responseObj);
            }
        })
        .catch(err => {
            const responseObj = new responses.ErrorResponse();
            responseObj.errors = err.stack;
            res.status(500).send(responseObj);
        })
}
