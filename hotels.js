let HOTELS = {};

function syncCustomMedine(){
  const v = document.getElementById('hotel-medine').value;
  if(v) document.getElementById('hotel-medine-custom').value = '';
}
function syncCustomMekkah(){
  const v = document.getElementById('hotel-mekkah').value;
  if(v) document.getElementById('hotel-mekkah-custom').value = '';
}
function getHotelMedine(){
  return document.getElementById('hotel-medine-custom').value.trim() || document.getElementById('hotel-medine').value || '—';
}
function getHotelMekkah(){
  return document.getElementById('hotel-mekkah-custom').value.trim() || document.getElementById('hotel-mekkah').value || '—';
}
chargerHotels();
populateHotels