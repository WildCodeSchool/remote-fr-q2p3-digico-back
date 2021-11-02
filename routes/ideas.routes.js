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

  router.get('/ideaowner', (req, res) => {
    connection.query('SELECT i.*, i.title, i.category, i.description, i.img, i.idea_date, u.pseudonym, u.user_img FROM ideas i JOIN users u ON u.id=i.user_id', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving project from database');
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

router.get('/:id/comments', (req, res) => {
  const commentId = req.params.id;
  connection.query(
    'SELECT i.id, c.*, c.idea_id, c.user_id, c.comment_content, c.comment_date, u.pseudonym, u.user_img FROM comments c JOIN ideas i ON i.id=c.idea_id JOIN users u ON u.id=c.user_id WHERE i.id = ?',
    [commentId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving comment from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('Comment not found');
      }
    }
  );
});

router.post('/', (req, res) => {
  const { title, category, description, img, idea_date, user_id } = req.body;
  connection.query('INSERT INTO ideas (title, category, description, idea_date, user_id) VALUES (?, ?, ?, ?, ?)',
    [title, category, description, idea_date, user_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the idea');
      } else {
        const id = result.insertId;
        const createdIdea = {id, title, category, description, idea_date, user_id};
        res.status(201).json(createdIdea);
      }
    }
  );
});

// router.post('/upload', (req, res) => {
//   if (req.files === null) {
//     return res.status(400).json({ msg: 'No file uploaded' });
//   }
 
//   const file = req.files.file;
 
//   file.mv(`${__dirname}/../remote-fr-q2p3-digico-front/public/assets/ideas/${file.name}`, err => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send(err);
//     }
 
//     res.json({ fileName: file.name, filePath: `/assets/ideas${file.name}` });
//   });
// });

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