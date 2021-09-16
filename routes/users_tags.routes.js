const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM users_tags', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving users_tags from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const user_tagId = req.params.id;
  connection.query(
    'SELECT * FROM users_tags WHERE id = ?',
    [user_tagId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving user_tag from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('User_tag not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { tag_names } = req.body;
  connection.query(
    'INSERT INTO users_tags (tag_names) VALUES (?)',
    [tag_names],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the user_tag');
      } else {
        const id = result.insertId;
        const createdUser_tag = { id, tag_names };
        res.status(201).json(createdUser_tag);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const user_tagId = req.params.id;
  const db = connection.promise();
  let existingUser_tag = null;
  db.query('SELECT * FROM users_tags WHERE id = ?', [user_tagId])
    .then(([results]) => {
      existingUser_tag = results[0];
      if (!existingUser_tag) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE users_tags SET ? WHERE id = ?', [req.body, user_tagId]);
    })
    .then(() => {
      res.status(200).json({ ...existingUser_tag, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`User with id ${user_tagId} not found.`);
      else res.status(500).send('Error updating a user_tag');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM users_tags WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an user_tag');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 User_tag deleted!');
        else res.status(404).send('User_tags not found.');
      }
    }
  );
});

module.exports = router;