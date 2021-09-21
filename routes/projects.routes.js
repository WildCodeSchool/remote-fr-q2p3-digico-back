const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM projects', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving projects from database');
      } else {
        res.json(result);
      }
    });
  });

  router.get('/owner', (req, res) => {
    connection.query('SELECT title, d.description, img, project_date, pseudonym FROM projects d JOIN users ON users.id=owner_id', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving project from database');
      } else {
        res.json(result);
      }
    });
  });


router.get('/:id', (req, res) => {
  const projectId = req.params.id;
  connection.query(
    'SELECT * FROM projects WHERE id = ?',
    [projectId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving projects from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('projects not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { title, description, socials, img, localisation, project_date, owner_id } = req.body;
  connection.query('INSERT INTO projects (title, description, socials, img, localisation, project_date, owner_id) VALUES ( ?, ?, ?, ?, ?, ?, ?)',
    [title, description, socials, img, localisation, project_date, owner_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the project');
      } else {
        const id = result.insertId;
        const createdProject = { id, title, description, socials, img, localisation, project_date, owner_id };
        res.status(201).json(createdProject);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const projectId = req.params.id;
  const db = connection.promise();
  let existingProject = null;
  db.query('SELECT * FROM projects WHERE id = ?', [projectId])
    .then(([results]) => {
      existingProject = results[0];
      if (!existingProject) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE projects SET ? WHERE id = ?', [req.body, projectId]);
    })
    .then(() => {
      res.status(200).json({ ...existingProject, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Project with id ${projectId} not found.`);
      else res.status(500).send('Error updating a project');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM projects WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an project');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 Project deleted!');
        else res.status(404).send('Project not found.');
      }
    }
  );
});

module.exports = router;