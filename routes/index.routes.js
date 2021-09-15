const router = require('express').Router();
const usersRouter = require('./users.routes');
const ideasRouter = require('./ideas.routes');

router.use('/users', usersRouter);
router.use('/ideas', ideasRouter);

module.exports = router;