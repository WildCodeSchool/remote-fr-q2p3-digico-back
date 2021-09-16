const router = require('express').Router();
const usersRouter = require('./users.routes');
const ideasRouter = require('./ideas.routes');
const projectsRouter = require('./projects.routes');
const badgesRouter = require('./badges.routes');

router.use('/users', usersRouter);
router.use('/ideas', ideasRouter);
router.use('/projects', projectsRouter);
router.use('/badges', badgesRouter);

module.exports = router;