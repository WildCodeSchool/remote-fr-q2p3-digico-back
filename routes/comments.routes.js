const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM comments', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving comments from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const commentId = req.params.id;
  connection.query(
    'SELECT * FROM comments WHERE id = ?',
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
  const { comment_content, comment_date, idea_id, writer_id} = req.body;
  connection.query(
    'INSERT INTO comments (comment_content, comment_date, idea_id, writer_id) VALUES (?, ?, ?, ?)',
    [comment_content, comment_date, idea_id, writer_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the comment');
      } else {
        const id = result.insertId;
        const createdComment = { id, comment_content, comment_date, idea_id, writer_id};
        res.status(201).json(createdComment);
      }
    }
  );
});

router.put('/:id', (req, res) => {
  const commentId = req.params.id;
  const db = connection.promise();
  let existingComment = null;
  db.query('SELECT * FROM comments WHERE id = ?', [commentId])
    .then(([results]) => {
      existingComment = results[0];
      if (!existingComment) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE comments SET ? WHERE id = ?', [req.body, commentId]);
    })
    .then(() => {
      res.status(200).json({ ...existingComment, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`Comment with id ${commentId} not found.`);
      else res.status(500).send('Error updating a comment');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM comments WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an comment');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 Comment deleted!');
        else res.status(404).send('Comment not found.');
      }
    }
  );
});

module.exports = router;