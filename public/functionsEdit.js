var sideBar = document.getElementById('sideBar');

// sideBare close
var closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener("click", function(){
    sideBar.style.display='none';
  });

  //side bar show
  var showBtn = document.getElementById('showBtn');
  showBtn.addEventListener("click", function(){
    sideBar.style.display='block';

  });

  //buyBtn
  var buyBtn = document.getElementById('buyBtn');
  buyBtn.addEventListener('click', function(){
    alert(' your commande has passed! thank you for choosing us ')
  });