const router = require('express').Router();
const usersRouter = require('./users.routes');
const ideasRouter = require('./ideas.routes');
const projectsRouter = require('./projects.routes');
const categoriesRouter = require('./categories.routes');

router.use('/users', usersRouter);
router.use('/ideas', ideasRouter);
router.use('/projects', projectsRouter);
router.use('/categories', categoriesRouter);

module.exports = router;