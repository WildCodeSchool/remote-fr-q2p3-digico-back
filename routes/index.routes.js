const router = require('express').Router();
const usersRouter = require('./users.routes');
const ideasRouter = require('./ideas.routes');
const projectsRouter = require('./projects.routes');
const badgesRouter = require('./badges.routes');
const categoriesRouter = require('./categories.routes');
const users_tagsRouter = require('./users_tags.routes');


router.use('/users', usersRouter);
router.use('/ideas', ideasRouter);
router.use('/projects', projectsRouter);
router.use('/badges', badgesRouter);
router.use('/categories', categoriesRouter);
router.use('/users_tags', users_tagsRouter);


module.exports = router;