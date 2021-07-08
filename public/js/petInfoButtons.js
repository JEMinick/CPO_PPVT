
// button to ADD a new vaccine...
const addVaccine = function (event) {
  if ( event.target.matches(".addvaccinebtn") ) {
    const iPetID = event.target.getAttribute("data-petid")
    // console.log( `Triggering ADD VACCINE for pet# [${iPetID}]` )
    document.location.replace(`/add-vaccine/${iPetID}`)
  }
}

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

    // We need a full record for the pet from the database in order to perform
    // delete api requests within the google cloud bucket for any images
    // the user has uploaded:

    let response = await fetch(`/api/pets/retrieve/${iPetID}`, {
      method: 'GET'
    })

    if ( response.ok ) {

      let jResponse = await response.json();
      let file='';

      // console.log( `pet_photo: [${jResponse.pet_photo}]` );
      if ( jResponse.pet_photo ) {
        if ( jResponse.pet_photo.length ) {
          file = jResponse.pet_photo;
          // console.log( `Deleting image: [${file}]` );

          let formLicenseData = new FormData()
          formLicenseData.append("file", file)
          const response = await fetch('/uploadimages', {
              method: "DELETE", 
              body: formLicenseData
          })
          
          const {data} = await response.json();
        }
      }  

      console.log( `pet_license_file: [${jResponse.pet_license_file}]` );
      if ( jResponse.pet_license_file ) {
        if ( jResponse.pet_license_file.length ) {
          file = jResponse.pet_license_file;
          // console.log( `Deleting image: [${file}]` );

          let formLicenseData = new FormData()
          formLicenseData.append("file", file)
          const response = await fetch('/uploadimages', {
              method: "DELETE", 
              body: formLicenseData
          })

          const {data} = await response.json();
        }
      }

      let iTotalVaccines=jResponse.pet_vaccines.length

      for( var i=0; ( i < iTotalVaccines ); i++ ) {
        // console.log( `${i}: ${jResponse.pet_vaccines[i].vaccine_license_file}` );
        if ( jResponse.pet_vaccines[i].vaccine_license_file ) {
          if ( jResponse.pet_vaccines[i].vaccine_license_file.length ) {
            file = jResponse.pet_vaccines[i].vaccine_license_file;
            // console.log( `Deleting image: [${file}]` );
            let formLicenseData = new FormData()
            formLicenseData.append("file", file)
            const response = await fetch('/uploadimages', {
                method: "DELETE", 
                body: formLicenseData
            })
            const {data} = await response.json();
            pet_license_file = data;
          }
        }
      } // endFor

    } else {
      alert(response.statusText);
    }
      
  }

  // After doing the Google Cloud Bucket clean-up,
  // perform the cascaded delete within the database:
  if ( iPetID > 0 ) {
    let response = await fetch(`/api/pets/${iPetID}`, {
        method: 'DELETE',
        body: JSON.stringify(
            { iPetID,
              petname
            }),
        headers: { 'Content-Type': 'application/json' },
      });

    if ( response.ok ) {
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  }

};

document
  .querySelector('#btnDeletePet')
  .addEventListener('click', deletePet );

document
  .querySelector('#petinfocontainer')
  .addEventListener('click', addVaccine );
