const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM ideas', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving ideas from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/owner', (req, res) => {
  connection.query('SELECT title, d.description, img, idea_date, pseudonym FROM ideas d JOIN users ON users.id=owner_id', (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving ideas from database');
    } else {
      res.json(result);
    }
  });
});

router.get('/:id', (req, res) => {
  const ideaId = req.params.id;
  connection.query(
    'SELECT * FROM ideas WHERE id = ?',
        [ideaId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving idea from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('idea not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { title, description, img, idea_date, owner_id } = req.body;
  connection.query('INSERT INTO ideas (title, description, img, idea_date, owner_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, img, idea_date, owner_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the idea');
      } else {
        const id = result.insertId;
        const createdIdea = {id, title, description, img, idea_date, owner_id};
        res.status(201).json(createdIdea);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const ideaId = req.params.id;
  const db = connection.promise();
  let existingIdea = null;
  db.query('SELECT * FROM ideas WHERE id = ?', [ideaId])
    .then(([results]) => {
      existingIdea = results[0];
      if (!existingIdea) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE ideas SET ? WHERE id = ?', [req.body, ideaId]);
    })
    .then(() => {
      res.status(200).json({ ...existingIdea, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Idea with id ${ideaId} not found.`);
      else res.status(500).send('Error updating a idea');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM ideas WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an idea');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 Idea deleted!');
        else res.status(404).send('Idea not found.');
      }
    }
  );
});

module.exports = router;

// title, description, img, idea_date, pseudonym FROM ideas JOIN users ON users.id=ideas.owner_id 