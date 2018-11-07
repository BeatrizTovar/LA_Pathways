const reviewsService = require('../services/reviews.service');
const responses = require('../models/responses/index');

const readByReviewerId = (req, res) => {
    const id = req.params.id;
    if (req.path.includes("average")) {
        const promise = reviewsService.readByReviewerId(id);
        promise
            .then(items => {
                let ratings = items.map(index => { return index.starRating })
                const reducer = (accumulator, currentValue) => accumulator + currentValue
                let ratingsAverage = (ratings.reduce(reducer) / ratings.length).toFixed(2);
                res.json(new responses.ItemResponse(ratingsAverage))
            })
            .catch(err => {
                res.set(500).send(err);
            })
    }
    else {
        const promise = reviewsService.readByReviewerId(id);
        promise
            .then(items => {
                res.json(new responses.ItemResponse(items));
            })
            .catch(err => {
                res.set(500).send(err);
            })
    }
}
