const router = require('express').Router();
const { Pet } = require('../../models');
const withAuth = require('../../utils/auth');

// Fetch an existing pet:
router.get('/:id', withAuth, (req, res) => {
  console.log( `\nGET pet info: ${req.params.id}` );
  Pet.findOne({
    where: {
      id: req.params.id
    }
  })
  .then( dbPetRecord => {
    // res.json(petData);
    const petInfo = dbPetRecord.get({ plain: true });
    // Create a file name to display on the form:
    petInfo.pet_photo_local = '';
    if ( petInfo.pet_photo ) {
      if ( petInfo.pet_photo.length ) {
        var tmpArray=petInfo.pet_photo.split('/');
        petInfo.pet_photo_local = tmpArray[tmpArray.length-1];
      }
    }
    // Create a file name to display on the form:
    petInfo.pet_license_local = '';
    if ( petInfo.pet_license_file ) {
      if ( petInfo.pet_license_file.length ) {
        var tmpArray=petInfo.pet_license_file.split('/');
        petInfo.pet_license_local = tmpArray[tmpArray.length-1];
      }
    }
    console.log( `\nEDIT pet info:` );
    console.log( petInfo );
    res.render( 'edit-pet', {petInfo, loggedIn: req.session.loggedIn} );    
  }) 
  .catch( err => {
    console.log(err);
    res.status(500).json(err);
  })
});

// ADD a new PET image:
// router.post('/uploadpic', withAuth, async (req, res) => {
//   console.log( `POST new pet image: [${req.body}]` );
//   // try {
//   //   const dbPetData = await Pet.create({
//   //     ...req.body,
//   //     user_id: req.session.user_id
//   //   });
//   //   res.status(200).json(dbPetData);
//   // }
//   // catch (err) {
//   //   res.status(400).json(err);
//   // }
// });
  
// ADD a new PET:
// router.post('/', withAuth, async (req, res) => {
router.post('/add', async (req, res) => {
  console.log( `POST new pet: [${req.body}]` );
  try {
    const dbPetData = await Pet.create({
      ...req.body,
      user_id: req.session.user_id
    });
    res.status(200).json(dbPetData);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE an existing PET:
router.put('/:id', withAuth, async (req, res) => {
  await Pet.update({
    petname: req.body.petname,
    pet_license_no: req.body.pet_license_no,
    license_exp_date: req.body.license_exp_date,
    breed: req.body.breed,
    dob: req.body.dob,
    pet_photo: req.body.pet_photo,
    pet_license_file: req.body.pet_license_file
  },{
    where: {
      id: req.params.id
    }
  })
  .then(petInfo => {
    if (!petInfo) {
      res.status(404).json({ message: 'No pet found to update using this id!' });
      return;
    }
    res.json(petInfo);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// DELETE an existing PET:
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const petInfo = await Pet.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      },
    });

    if (!petInfo) {
      res.status(404).json({ message: 'No pet found to delete using this id!' });
      return;
    }

    res.status(200).json(blogData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
