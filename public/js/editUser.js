const editUser = async (event) => {
    event.preventDefault();

    // id  :: NOT NULL
    // username :: NOT NULL
    // email :: NOT NULL
    // password :: NOT NULL

    let fieldSel;

    const iUserID = document.querySelector('input[name="user-id"]').value;

    let username;
    fieldSel = document.getElementById('user-name');
    if ( fieldSel ) {
      if ( fieldSel.value ) {
        username = fieldSel.value.trim();
      }
    }

    let email;
    fieldSel = document.getElementById('user-email');
    if ( fieldSel ) {
      if ( fieldSel.value ) {
        email = fieldSel.value.trim();
      }
    }

    let file;
    let user_photo;

    if ( username ) {

      fieldSel = document.getElementById("upload-image");
      if ( fieldSel ) {
        file = fieldSel.files[0];
        if ( file ) {
          user_photo = file.name
        }
      }

      if ( user_photo ) {

        console.log( `Uploading image: [${user_photo}]` );

        let formPhotoImage = new FormData()
        formPhotoImage.append("file", file)
        const response = await fetch('/uploadimages', {
            method: "POST", 
            body: formPhotoImage
        })
        
        const {data} = await response.json();

        console.log(  `POST (image) response:` );
        console.log( response );

        user_photo = data;

        console.log( `User Image File:` );
        console.log( data );
      }

      // if ( iUserID > 0 ) {
      //   console.log( `Attempting to update user: [ID:${iUserID}]` );
      // } else {
      //   console.log( `Attempting to add a new user...` );
      // }

      // console.log(
      //     { iUserID, 
      //       username, 
      //       email
      //     });

      let response2;
      if ( iUserID > 0 ) {
        response2 = await fetch(`/api/users/${iUserID}`, {
          method: 'PUT',
          body: JSON.stringify(
              { username, 
                email
              }),
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        response2 = await fetch(`/api/users/add`, {
          method: 'POST',
          body: JSON.stringify(
              { username, 
                email
              }),
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (response2.ok) {
        document.location.replace('/');
      } else {
        alert(response2.statusText);
        // alert( JSON.stringify(response2.statusText) );
      }

    }
  };

  function cancelPetEdit() {
    document.location.replace('/');
  }


  document
    .querySelector( '#cancelUserEdit' )
    .addEventListener( 'click', cancelPetEdit )

  document
    .querySelector( '.edit-user-form' )
    .addEventListener( 'submit', editUser )
