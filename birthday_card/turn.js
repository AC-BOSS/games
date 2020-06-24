var button = document.querySelector('.button');
var left = document.getElementById('left');
var cover = document.getElementById('cover');

button.addEventListener( 'click', function() {
  left.classList.toggle('is-flipped-left');
  cover.classList.toggle('is-flipped-cover');
  if(button.textContent === "Click to Open"){
    button.textContent = "Click to Close";
  }
  else{
    button.textContent = "Click to Open";
  }
});