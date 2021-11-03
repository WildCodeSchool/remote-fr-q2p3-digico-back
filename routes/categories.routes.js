const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM categories', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving users from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const userId = req.params.id;
  connection.query(
    'SELECT * FROM categories WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving categories from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('categories not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { project_id, idea_id, category_name } = req.body;
  connection.query(
    'INSERT INTO categories (project_id, idea_id, category_name) VALUES ( ?, ?, ?)',
    [project_id, idea_id, category_name],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the category');
      } else {
        const id = result.insertId;
        const createdCategorie = { id, project_id, idea_id, category_name };
        res.status(201).json(createdCategorie);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const categorieId = req.params.id;
  const db = connection.promise();
  let existingCategorie = null;
  db.query('SELECT * FROM categories WHERE id = ?', [categorieId])
    .then(([results]) => {
      existingCategorie = results[0];
      if (!existingCategorie) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE categories SET ? WHERE id = ?', [req.body, categorieId]);
    })
    .then(() => {
      res.status(200).json({ ...existingCategorie, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Categorie with id ${categorieId} not found.`);
      else res.status(500).send('Error updating a categorie');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM categories WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an categorie');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 categorie deleted!');
        else res.status(404).send('Categorie not found.');
      }
    }
  );
});

module.exports = router;