
// button to ADD a new vaccine...
const userAddVaccine = function () {
  const iPetID = document.querySelector('input[name="pet-id"]').value;
  console.log( `Triggering ADD VACCINE for pet# [${iPetID}]` );
  document.location.replace(`/add-vaccine/${iPetID}`);
};

// button to DELETE the pet and its associated vaccines:
const userDeletePet = function () {
  const iPetID = document.querySelector('input[name="pet-id"]').value;
  console.log( `Triggering DELETE PET# [${iPetID}]` );
  document.location.replace(`/api/pets/del/${iPetID}`);
  document.location.replace('/');
};

const deletePet = async (event) => {
  event.preventDefault();

  let iPetID = 0;
  let fieldSel;

  if ( document.querySelector('input[name="pet-id"]') ) {
    iPetID = document.querySelector('input[name="pet-id"]').value;
  }

  let petname='';
  fieldSel = document.getElementById('pet-name');
  if ( fieldSel ) {
    if ( fieldSel.textContent ) {
      petname = fieldSel.textContent;
    }
  }

  if ( iPetID > 0 ) {

    // if ( pet_photo ) {

    //   console.log( `Uploading image: [${pet_photo}]` );

    //   let formPhotoImage = new FormData()
    //   formPhotoImage.append("file", file)
    //   const response = await fetch('/uploadimages', {
    //       method: "POST", 
    //       body: formPhotoImage
    //   })
      
    //   const {data} = await response.json();

    //   console.log(  `POST (image) response:` );
    //   console.log( response );

    //   pet_photo = data;

    //   console.log( `Pet Image File:` );
    //   console.log( data );
    // }

    // let pet_license_file;
    // fieldSel = document.getElementById("upload-license");
    // if ( fieldSel ) {
    //   file = fieldSel.files[0];
    //   if ( file ) {
    //     pet_license_file = file.name
    //   }
    // }

    // if ( pet_license_file ) {

    //   console.log( `Uploading image: [${pet_license_file}]` );

    //   let formLicenseData = new FormData()
    //   formLicenseData.append("file", file)
    //   const response = await fetch('/uploadimages', {
    //       method: "POST", 
    //       body: formLicenseData
    //   })
      
    //   const {data} = await response.json();

    //   console.log(  `POST (image image) response:` );
    //   console.log( response );

    //   pet_license_file = data;

    //   console.log( `Pet License File:` );
    //   console.log( data );
    // }

    if ( iPetID > 0 ) {
      let response = await fetch(`/api/pets/retrieve/${iPetID}`, {
        method: 'GET'
        // body: JSON.stringify(
        //     { iPetID,
        //       petname
        //     }),
        // headers: { 'Content-Type': 'application/json' },
      })
      // .then(response => response.json())
      // .then(result => {
      //   console.log('Success:', result);
      // })
      // .catch(error => {
      //   console.error('Error:', error);
      // });      

      if ( response.ok ) {

        let jResponse = await response.json();

        console.log( `RETRIEVED pet info:` );
        console.log( jResponse );

        console.log( JSON.stringify(jResponse) );
        console.log( `\nDATA:` );
        console.log( `pet id: [${jResponse.id}]` );
        console.log( `pet_photo: [${jResponse.pet_photo}]` );
        console.log( `pet_license_file: [${jResponse.pet_license_file}]` );

        let iTotalVaccines=jResponse.pet_vaccines.length
        console.log( `Total # of vaccines for this pet: ${iTotalVaccines}` );

        for( var i=0; ( i < iTotalVaccines ); i++ ) {

          console.log( `${i}: ${jResponse.pet_vaccines[i].vaccine_license_file}` );

          if ( jResponse.pet_vaccines[i].vaccine_license_file.length ) {
            let file = jResponse.pet_vaccines[i].vaccine_license_file;
            console.log( `Deleting image: [${file}]` );

            let formLicenseData = new FormData()
            formLicenseData.append("file", file)
            // let jFileInfo = {
            //   "file": jResponse.pet_vaccines[i].vaccine_license_file
            // }
            const response = await fetch('/uploadimages', {
                method: "DELETE", 
                body: formLicenseData
            })
            
            const {data} = await response.json();
    
            console.log(  `DELETE (image) response:` );
            console.log( response );
    
            pet_license_file = data;
    
            console.log( `Pet License File:` );
            console.log( data );
          }
  
        }
        console.log( `\n` );
      } else {
        alert(response.statusText);
      }
        
      // console.log( `Attempting to delete pet: [ID:${iPetID}]` );
    }

    // console.log(
    //     { iPetID,
    //       petname
    //     });

    // let response = await fetch(`/api/pets/${iPetID}`, {
    //     method: 'DELETE',
    //     body: JSON.stringify(
    //         { iPetID,
    //           petname
    //         }),
    //     headers: { 'Content-Type': 'application/json' },
    //   });

    // if ( response.ok ) {
    //   document.location.replace('/');
    // } else {
    //   alert(response.statusText);
    // }

  }
};

document
  .querySelector('#btnDeletePet')
  .addEventListener('click', deletePet );

document
  .querySelector('#addvaccinebtn')
  .addEventListener('click', userAddVaccine );
