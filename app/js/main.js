$(function(){
  let isMobile = {
    Android: function() {return navigator.userAgent.match(/Android/i);},
    BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
    iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
    Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
    Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
    any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
  };

  if(isMobile.any()){
    $(this.body).addClass('touch');
    let arrow = $('.arrow');
    for(i=0;i<arrow.length;i++){
      $(arrow[i]).addClass('arrow--active');
    }
  }else{
     $(this.body).addClass('mouse');
  }

  $('.menu-catalog__btn').on('click', function(e){
    e.preventDefault();
    $('.menu-catalog__tabs').toggleClass('menu-catalog__tabs--active')
  });
  $('.menu-catalog__tab-link').on('click', function(e){
    e.preventDefault();
    $('.menu-catalog__tab-link').removeClass('menu-catalog__tab-link--active');
    $('.menu-catalog__content').removeClass('menu-catalog__content--active');
    var id  = $(this).attr('href');
		$(this).addClass('menu-catalog__tab-link--active');
		$(id).addClass('menu-catalog__content--active');
  })
})