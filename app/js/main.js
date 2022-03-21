
$(function(){

  var testimonial = new Swiper('.testimonial__slider', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 20,
    initialSlide: 3,
  });

  var brand = new Swiper('.popular-brands__slider', {
    slidesPerView: 5,
    slidesPerGroup: 5,
    grid: {
      rows: 2,
      fill: 'row'
    },
    spaceBetween: 40,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });


  var totalSlide = brand.slides.length / brand.params.slidesPerView;
  totalSlide = Math.floor(totalSlide);
  var slidePerView = brand.params.slidesPerView;
  if(brand.slides.length != 0){
    for(var i = 0; i < brand.slides.length;i++){
      if(i < slidePerView){
        $(brand.slides[i]).addClass('popular-brands__slide--decor');
      }else{
        slidePerView = slidePerView + (brand.params.slidesPerView * 2);
        i = i + brand.params.slidesPerView;
      }
    };
  }
  if(brand.slides.length != 0){
    $(brand.slides[0]).append('<div class="decor-top"></div>');
    var index = brand.params.slidesPerView;
    for(var i = 0; i<totalSlide;i++){
      index = index + index ;
      $(brand.slides[index]).append('<div class="decor-top"></div>');
    };
  }

  $('.products__tab-link').on('click', function(e){
    e.preventDefault();
    $('.products__tab-link').removeClass('products__tab-link--active');
    $('.products__content').removeClass('products__content--active');
    var id  = $(this).attr('href');
		$(this).addClass('products__tab-link--active');
		$(id).addClass('products__content--active');
  })

  var products = new Swiper('.products__slider', {
    slidesPerView: 4,
    grid: {
      rows: 2,
      fill: 'row'
    },
    spaceBetween: 20,

  });
  var productItem = new Swiper('.product-item__slider', {
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  var headerContent = new Swiper('.header-content__slider', {
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    navigation: {
      nextEl: '.header-content__next',
      prevEl: '.header-content__prev',
    },
    pagination: {
      el: ".header-content__pagination",
      clickable: true,
    },
  });

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