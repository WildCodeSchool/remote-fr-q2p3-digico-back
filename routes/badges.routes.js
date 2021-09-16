const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM badges', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving badges from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const badgeId = req.params.id;
  connection.query(
    'SELECT * FROM badges WHERE id = ?',
    [badgeId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving badge from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('Badge not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { badge_name, badge_img } = req.body;
  connection.query(
    'INSERT INTO badges (badge_name, badge_img) VALUES (?, ?)',
    [badge_name, badge_img],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the badge');
      } else {
        const id = result.insertId;
        const createdBadge = { id, badge_name, badge_img };
        res.status(201).json(createdBadge);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const badgeId = req.params.id;
  const db = connection.promise();
  let existingBadge = null;
  db.query('SELECT * FROM badges WHERE id = ?', [badgeId])
    .then(([results]) => {
      existingBadge = results[0];
      if (!existingBadge) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE badges SET ? WHERE id = ?', [req.body, badgeId]);
    })
    .then(() => {
      res.status(200).json({ ...existingBadge, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`User with id ${badgeId} not found.`);
      else res.status(500).send('Error updating a badge');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM badges WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an badge');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 badge deleted!');
        else res.status(404).send('badge not found.');
      }
    }
  );
});

module.exports = router;