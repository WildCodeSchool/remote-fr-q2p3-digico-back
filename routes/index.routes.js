const router = require('express').Router();
const usersRouter = require('./users.routes');
const projectsRouter = require('./projects.routes');

router.use('/users', usersRouter);
router.use('/projects', projectsRouter);

module.exports = router;