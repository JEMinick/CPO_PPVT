// button to ADD a new pet...

const userAddVaccine = function () {
  const iPetID = document.querySelector('input[name="pet-id"]').value;
  console.log( `Triggering ADD VACCINE for pet# [${iPetID}]` );
  document.location.replace(`/add-vaccine/${iPetID}`);
};

document
  .querySelector('#addvaccinebtn')
  .addEventListener('click', userAddVaccine );
