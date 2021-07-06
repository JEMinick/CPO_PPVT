const router = require('express').Router();
const sequelize = require('../config/connection');

// const { User, BlogPost, BlogComment } = require('../models');
const { User } = require('../models');

const withAuth = require('../utils/auth');

// ====================================================================================
// router.get('/', withAuth, (req, res) => {
//   res.render('profile', { loginid: req.session.user_id, loggedIn: true, isDashboard: true });
// })
// --------------------------------------------------------------

// id  :: NOT NULL
// username :: NOT NULL
// email :: NOT NULL
// password :: NOT NULL

router.get('/', withAuth, (req, res) => {
  User.findOne({
    where: {
      id: req.session.user_id
    },
    attributes: [
      'id',
      'username',
      'email',
      'password'
    ],
  })
  .then( dbUserRecord => {
    // res.json(petData);
    const userInfo = dbUserRecord.get({ plain: true });
    // Create a file name to display on the form:
    // userInfo.pet_photo_local = '';
    // if ( petInfo.pet_photo ) {
    //   if ( petInfo.pet_photo.length ) {
    //     var tmpArray=petInfo.pet_photo.split('/');
    //     petInfo.pet_photo_local = tmpArray[tmpArray.length-1];
    //   }
    // }
    console.log( `\nRETRIEVED user info:` );
    console.log( userInfo );
    // res.status(200).json(userInfo);
    res.render( 'profile', { userInfo, loggedIn: true, isDashboard: true } );
  })
  .catch( err => {
    console.log(err);
    res.status(500).json(err);
  })
  
});

// ====================================================================================

// ====================================================================================

// router.get('/edit/:id', withAuth, (req, res) => {
//   BlogPost.findOne({
//     where: {
//       id: req.params.id
//     },
//     attributes: [
//       'id',
//       'subject',
//       'description',
//       'date_created'
//     ],
//     include: [
//       {
//         model: User,
//         attributes: ['name']
//       },
//       {
//         model: BlogComment,
//         attributes: ['id', 'blog_comment', 'post_id', 'user_id', 'date_created'],
//         include: {
//           model: User,
//           attributes: ['name']
//         }
//       }
//     ]
//   })
//   .then(blogPostInfo => {
//     if ( !blogPostInfo ) {
//       res.status(404).json({ message: 'No blog post found with this id' });
//       return;
//     }

//     const blogPost = blogPostInfo.get({ plain: true });
//     res.render('editPost', { blogPost, loggedIn: true, isDashboard: true });
//   })
//   .catch(err => {
//     console.log(err);
//     res.status(500).json(err);
//   });

// })

// ====================================================================================
// Edits to an existing comment:
//   body:
//     post_id: id,
//     subject,
//     description

// router.put('/update/:id', withAuth, (req, res) => {
//   // console.log( `PUT blog: [${req.params.id}]` );
//   // console.log( JSON.stringify( req.body ) );
//   BlogPost.update({
//     subject: req.body.subject,
//     description: req.body.description
//   },{
//     where: {
//       id: req.params.id
//     }
//   })
//   .then(blogPostData => {
//     if (!blogPostData) {
//       res.status(404).json({ message: 'No blog found with this id' });
//       return;
//     }
//     res.json(blogPostData);
//   })
//   .catch(err => {
//     console.log(err);
//     res.status(500).json(err);
//   });
// });

// ====================================================================================
// ADD a new blog:

// router.get('/new', (req, res) => {
//     res.render('newBlogPost');
// });

// ====================================================================================
// DELETE an existing blog:

// router.delete('/:id', withAuth, async (req, res) => {
//   // console.log( `DELETE Blog: [${req.params.id}]` );
//   await BlogPost.destroy({
//     where: {
//       id: req.params.id
//     }
//   })
//   .then(blogPostData => {
//     if (!blogPostData) {
//       res.status(404).json({ message: 'No blog post found with this id' });
//       return;
//     }
//     res.json(blogPostData);
//   })
//   .catch(err => {
//     console.log(err);
//     res.status(500).json(err);
//   });
// });

module.exports = router;
