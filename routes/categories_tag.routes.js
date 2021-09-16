const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM categories_tag', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving tag from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const category_tagId = req.params.id;
  connection.query(
    'SELECT * FROM categories_tag WHERE id = ?',
    [category_tagId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving tag from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('Tag not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { tag } = req.body;
  connection.query(
    'INSERT INTO categories_tag (tag) VALUES ( ?)',
    [tag],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the tag');
      } else {
        const id = result.insertId;
        const createdTag = { id, tag};
        res.status(201).json(createdTag);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const categories_tagId = req.params.id;
  const db = connection.promise();
  let existingTag = null;
  db.query('SELECT * FROM categories_tag WHERE id = ?', [categories_tagId])
    .then(([results]) => {
      existingTag = results[0];
      if (!existingTag) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE categories_tag SET ? WHERE id = ?', [req.body, categories_tagId]);
    })
    .then(() => {
      res.status(200).json({ ...existingTag, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Tag with id ${existingTag} not found.`);
      else res.status(500).send('Error updating a tag');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM categories_tag WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an Tag');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 User deleted!');
        else res.status(404).send('Tag not found.');
      }
    }
  );
});

module.exports = router;