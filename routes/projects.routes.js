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

// router.get('/owner', (req, res) => {
//   connection.query('SELECT title, d.description, img, project_date, pseudonym FROM users d JOIN projects ON projects.id=user_id', (err, result) => {
//     if (err) {
//       res.status(500).send('Error retrieving project from database');
//     } else {
//       res.json(result);
//     }
//   });
// });

// Route sur les deux tables users -> ||  projects title, d.description, img, id, project_date, claps
router.get('/projectowner', (req, res) => {
  connection.query('SELECT p.*, p.description, u.pseudonym FROM projects p JOIN users u ON u.id=p.user_id', (err, result) => {
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
  const { title, description, socials, img, localisation, project_date, claps, user_id } = req.body;
  connection.query('INSERT INTO projects (title, description, socials, img, localisation, project_date, claps, user_id) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, socials, img, localisation, project_date, claps, user_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the project');
      } else {
        const id = result.insertId;
        const createdProject = {id, title, description, socials, img, localisation, project_date, claps, user_id };
        res.status(201).json(createdProject);
      }
    }
  );
});

router.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/../../remote-fr-q2p3-digico-front/public/assets/projects/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/assets/projects/${file.name}` });
  });
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