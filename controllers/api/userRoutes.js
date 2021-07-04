const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/newuser', async (req, res) => {
  try {
    // console.log( "POST new user: " );
    // console.log( req.body );
    
    const userData = await User.create({ 
      username: req.body.username, 
      email: req.body.email, 
      password: req.body.password 
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }

});

router.post('/login', async (req, res) => {
  try {
    console.log( "LOGIN user: " );
    console.log( req.body );
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect user-email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect user-email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// DELETE an existing USER:
router.get('/del/:id', withAuth, async (req, res) => {
  try {
    const userInfo = await User.destroy({
      where: {
        id: req.params.id
      },
    });

    if (!userInfo) {
      res.status(404).json({ message: 'No user found to delete using this id!' });
      return;
    }

    // res.status(200).json(userInfo);
    req.session.loggedIn = false;
    req.session.user_id = 0;
    res.render( 'login' );
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// --------------------------------------------------------
// Added this route to 'simulate' a delete, without
// actually executing the delete itself..
// the actual call is:
//   /del/:id
// whereas this 'simulated' call is:
//   /delete/:id
// --------------------------------------------------------
router.get('/delete/:id', withAuth, (req, res) => {
  console.log( `\nDELETE USER: [${req.params.id}]` );
  User.findOne({
    where: {
      id: req.params.id
    }
  })
  .then( dbUserRecord => {
    // res.json(petData);
    const userInfo = dbUserRecord.get({ plain: true });
    console.log( `\nDELETE user info:` );
    console.log( userInfo );
    req.session.loggedIn = false;
    res.status(200).json(userInfo);
    // res.render( 'edit-pet', {petInfo, loggedIn: req.session.loggedIn} );    
  }) 
  .catch( err => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;
