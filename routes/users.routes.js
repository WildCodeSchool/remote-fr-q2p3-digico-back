const connection = require("../db-config");
const router = require("express").Router();
const { check, validationResult } = require('express-validator');

router.get('/', (req, res) => {
    connection.query('SELECT * FROM users', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving users from database');
      } else {
        res.json(result);
      }
    });
  });

// Route sur les 3 tables users -> ideas -> comments 
router.get('/join_user_idea_comment', (req, res) => {
  connection.query('SELECT pseudonym, title, comment_content FROM users JOIN ideas ON ideas.id=user_id JOIN comments ON comments.id=idea_id', (err, result) => {
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
    'SELECT * FROM users WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving user from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('User not found');
      }
    }
  );
});

const loginValidate = [
  check('email', 'Email Must Be a Valid Email Address').isEmail().normalizeEmail(),
  check('password').isLength({ min: 8 })
    .withMessage('Password Must Be at Least 8 Characters')
    .matches('[0-9]').withMessage('Password Must Contain a Number')
    .matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter'),
  check ('mobile').isNumeric()
];

/* à modifier : la const avec les variables dont j'ai besoin qui sont renvoyés par le formulaire et ensuite dans le tableau de valeur de la query
 il faut remplacer les variables qui n'existent pas par des NULL*/
router.post('/', loginValidate, (req, res) => {
  const { pseudonym, password, email } = req.body;
  const mobile = 'mobile in req.body' ? req.body['mobile'] : null;
  connection.query('INSERT INTO users (pseudonym, password, firstname, lastname, email, mobile, user_img, address, socials, skills, description, experience_points, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [pseudonym, password, NULL, NULL, email, mobile, NULL, NULL, NULL, NULL, NULL, NULL, NULL],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving the user');
      } else {
        const id = result.insertId;
        const createdUser = { id, pseudonym, password, email, mobile };
        res.status(201).json(createdUser);
      }
    }
  );
});

/* à modifier ici pour quand utilisateur modifie ses informations */
router.put('/:id', loginValidate, (req, res) => {
  const userId = req.params.id;
  const db = connection.promise();
  let existingUser = null;
  db.query('SELECT * FROM users WHERE id = ?', [userId])
    .then(([results]) => {
      existingUser = results[0];
      if (!existingUser) return Promise.reject('RECORD_NOT_FOUND');
      return db.query('UPDATE users SET ? WHERE id = ?', [req.body, userId]);
    })
    .then(() => {
      res.status(200).json({ ...existingUser, ...req.body });
    })
    .catch((err) => {
      console.error(err);
      if (err === 'RECORD_NOT_FOUND')
        res.status(404).send(`User with id ${userId} not found.`);
      else res.status(500).send('Error updating a user');
    });
});

router.delete('/:id', (req, res) => {
  connection.query(
    'DELETE FROM users WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error deleting an user');
      } else {
        if (result.affectedRows) res.status(200).send('🎉 User deleted!');
        else res.status(404).send('User not found.');
      }
    }
  );
});

module.exports = router;