import express from 'express';

import * as profileCtrl from './user.controller';

const router = express.Router();

router.post('/filter-reviews', profileCtrl.filterReviews);
router.post('/review', profileCtrl.postReview);
router.delete('/review/:id', profileCtrl.removeReview);
router.put('/review/:id', profileCtrl.updateReview);
router.get('/rating/:id', profileCtrl.getLikesAndDislikes);
export default router;
