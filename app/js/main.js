$(function(){
  "use strict";

  function DynamicAdapt(type) {
    this.type = type;
  }

  DynamicAdapt.prototype.init = function () {
    const _this = this;
    // массив объектов
    this.оbjects = [];
    this.daClassname = "_dynamic_adapt_";
    // массив DOM-элементов
    this.nodes = document.querySelectorAll("[data-da]");

    // наполнение оbjects объктами
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const data = node.dataset.da.trim();
      const dataArray = data.split(",");
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(dataArray[0].trim());
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
      оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
      оbject.additional = dataArray[3] ? dataArray[3].trim() : "";
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    }
    
    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
      return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
    }, this);
    this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
      return Array.prototype.indexOf.call(self, item) === index;
    });

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    for (let i = 0; i < this.mediaQueries.length; i++) {
      const media = this.mediaQueries[i];
      const mediaSplit = String.prototype.split.call(media, ',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
        return item.breakpoint === mediaBreakpoint;
      });
      matchMedia.addListener(function () {
        _this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    }
  };

  DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
    if (matchMedia.matches) {
      for (let i = 0; i < оbjects.length; i++) {
        const оbject = оbjects[i];
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination, оbject.additional);
      }
    } else {
      for (let i = 0; i < оbjects.length; i++) {
        const оbject = оbjects[i];
        if (оbject.element.classList.contains(this.daClassname)) {
          this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
      }
    }
  };

  // Функция перемещения
  DynamicAdapt.prototype.moveTo = function (place, element, destination, additional) {
    element.classList.add(this.daClassname);
    if (additional.length > 0) {
      var el = $(element).parents(additional).find(`.${$(destination).attr('class')}`);
      if (place === 'last' || place >= destination.children.length) {
        el[0].insertAdjacentElement('beforeend', element);
        return;
      } 
      if (place === 'first') {
        el[0].insertAdjacentElement('afterbegin', element);
        return;
      }
      el[0].children[place].insertAdjacentElement('beforebegin', element);
      return;
    }
    if (place === 'last' || place >= destination.children.length) {
      destination.insertAdjacentElement('beforeend', element);
      return;
    } 
    if (place === 'first') {
      destination.insertAdjacentElement('afterbegin', element);
      return;
    }    
    destination.children[place].insertAdjacentElement('beforebegin', element);
  }

  // Функция возврата
  DynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].insertAdjacentElement('beforebegin', element);
    } else {
      parent.insertAdjacentElement('beforeend', element);
    }
  }

  // Функция получения индекса внутри родителя
  DynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
  };

  // Функция сортировки массива по breakpoint и place 
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  DynamicAdapt.prototype.arraySort = function (arr) {
    if (this.type === "min") {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }

          if (a.place === "first" || b.place === "last") {
            return -1;
          }

          if (a.place === "last" || b.place === "first") {
            return 1;
          }

          return a.place - b.place;
        }

        return a.breakpoint - b.breakpoint;
      });
    } else {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }

          if (a.place === "first" || b.place === "last") {
            return 1;
          }

          if (a.place === "last" || b.place === "first") {
            return -1;
          }

          return b.place - a.place;
        }

        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  };

  const da = new DynamicAdapt("max");
  da.init();

  var width = $(window).width();

  function division(num) {
    num = num.toString();
    let count = 0;
    let spaceCount = 0;
    if(num.length > 4){
      for(let i = num.length - 1; i > 0; i--){
        count = count + 1;
        if(count % 3 == 0){
          let right = num.substring(num.length - count - spaceCount);
          let left = num.substring(0, num.length - count - spaceCount);
          right = ` ${right}`
          num = left + right;
          spaceCount = spaceCount + 1;
        }
      }
    }
    console.log(num);
    return num;
  }
  
  function updateCart() {
    const items = $('.cart-info__info-item');
    if(items.length > 0){
      let totalPrice = 0; 
      let itemNum = 0;
      var action = $('[data-action]');
      for (let i = 1; i < items.length; i++) {
        let item = $('.cart-info__info-item')[i];
        let price = $(item).find('.cart-info__item-cost').find('.cart-info__item-text').text();
        let num = $(item).find('.cart-info__item-input')[1];
        num = $(num).prop('value');
        price = price.split(' ').join('');
        totalPrice = parseInt(totalPrice) + parseInt(price); 
        itemNum = parseInt(itemNum) + parseInt(num);
      }
      for (let i = 0; i < action.length; i++){
        let actionValue = $(action[i]).attr('data-action');
        if (actionValue === 'num'){
          $(action[i]).text(itemNum);
          $('.header-top__nav-linknum').text(itemNum);
        }
        if (actionValue === 'total'){
          $(action[i]).text(division(totalPrice) + '₽');
          $('.header-top__nav-linktext').text(division(totalPrice) + ' ₽');
        }
      }
    }
  } 

  function updateAside(additional) {
    let aside = $('cart-aside__info');
    let action = $('[data-action]');
    let total = $('[data-action=total]');
    let addit = $('[data-action=additional]');
    let totalValue = parseInt($(total).text().split(' ').join(''));
    let additionalValue = parseInt($(addit).text().split(' ').join(''));
    
    for (let i = 0; i < action.length; i++){
      let actionValue = $(action[i]).attr('data-action');
      if(actionValue === 'additional'){
        if(additional.substring(additional.length-1) === '%'){
          additional = additional.substring(0, additional.length-1);
          additionalValue = additionalValue + (totalValue * (additional / 100));
          additionalValue = Math.floor(additionalValue); 
          totalValue = Math.floor(totalValue + (totalValue * (additional / 100)));
          $(addit).text(additionalValue + '₽');
          $(total).text(division(totalValue) + '₽');
          $('.header-top__nav-linktext').text(division(totalValue) + ' ₽');
        }else{
          additional = parseInt(additional.substring(0, additional.length-1));
          additionalValue = additionalValue + additional;
          totalValue = totalValue + additional;
          $(addit).text(additionalValue + '₽');
          $(total).text(division(totalValue) + '₽');
          $('.header-top__nav-linktext').text(division(totalValue) + ' ₽');
        }
      }
    }
  }

  $('.cart-info__item-input').on('change', function(){
    var parent = $(this).parents('.cart-info__info-item');
    var price = $(parent).find('.cart-info__item-price').find('.cart-info__item-text').text();
    price = price.substring(0,price.length-1);
    var num = $(this).prop('value');
    var cost = parseInt(num) * parseInt(price);
    $(parent).find('.cart-info__item-cost').find('.cart-info__item-text').text(division(cost) + '₽'); 
    updateCart();
  });

  $('.additional-promo__link').on('click', function(e){
    e.preventDefault();
    let additional = $(this).parents('.additional-promo__content').find('.additional-promo__price span').text();
    updateAside(additional)
  }); 

  if(width < 768){
    var items = $('.cart-info__info-item');
    let textPrice = $('.cart-info__info-item--top').first().children('.cart-info__item-price').find('.cart-info__item-toptext').text();
    let textNum = $('.cart-info__info-item--top').first().children('.cart-info__item-num').find('.cart-info__item-toptext').text();
    let textCost = $('.cart-info__info-item--top').first().children('.cart-info__item-cost').find('.cart-info__item-toptext').text();
    for(let i = 1; i< items.length; i++){
      let item = $(items[i]);
      
      $(item).append('<div class="cart-info__item-wrapper"></div>');
      $(item).children('.cart-info__item-price')
      .appendTo($(item)
      .find('.cart-info__item-content'))
      .find('.cart-info__item-text')
      .before(`<span>${textPrice}: </span> `);

      $(item).children('.cart-info__item-num')
      .appendTo($(item)
      .find('.cart-info__item-wrapper'))
      .find('.cart-info__item-text')
      .before(`<span>${textNum}: </span> `);

      $(item).children('.cart-info__item-cost')
      .appendTo($(item)
      .find('.cart-info__item-wrapper'))
      .find('.cart-info__item-text')
      .before(`<span>${textCost}: </span> `);
    }
  }

  $('.input-num,.cart-info__item-input').styler();

  updateCart();
  
  $('.product-one__tab-link').on('click', function(e){
    e.preventDefault();
    var id = $(this).attr('href');
    $('.product-one__tab-link').removeClass('product-one__tab-link--active');
    $('.product-one__tab-content').removeClass('product-one__tab-content--active');

    $(this).addClass('product-one__tab-link--active');
    $(id).addClass('product-one__tab-content--active');
  })

  $('.personal-cabinet__item-link').on('click', function(e){
    e.preventDefault(); 
    $(this).toggleClass('personal-cabinet__item-link--active')
    $(this).parents('.personal-cabinet__item').find('.personal-cabinet__item-body').slideToggle();
  })

  $('.assistant-popup').magnificPopup({
    type: 'inline'
  });
  $('.product-info__link-slider').magnificPopup({
    type: 'inline'
  });
  $('.filters__btn').magnificPopup({
    type: 'inline',
  });

  $('.filters__btn').on('click', function(){
    $('.filters__box').parents('.mfp-content').css({
      'position': 'absolute',
      'left': '0'
    });
  })


  var galleryThumb = new Swiper('.gallery-popup__thumb', {
    freeMode: true,
    watchSlidesProgress: true,
    slidesPerView: 'auto',
    spaceBetween: 10,
  });
  var galleryBig = new Swiper('.gallery-popup__big', {
    spaceBetween: 100,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: galleryThumb,
    },
  });

  $('.product-slider__swiper').each(function(i){
    var productSlider = new Swiper($('.product-slider__swiper')[i], {
      breakpoints: {
        320:{
          pagination: {
            el: $('.product-slider__pagination')[i],
            clickable: true
          },
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 20,
          allowTouchMove: true,
        },
        768:{
          pagination: {
            el: $('.product-slider__pagination')[i],
            clickable: true
          },
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 20,
          allowTouchMove: false,
        },
        1100:{
          navigation: {
            nextEl: $('.product-slider__next')[i],
            prevEl: $('.product-slider__prev')[i],
          },
          slidesPerView: 4,
          spaceBetween: 20,
          allowTouchMove: false,
        },
      }
    });
  })
  
  var sliderThumb = new Swiper('.slider-thumb', {
    direction: 'vertical',
    slidesPerView: 4,
    spaceBetween: 10,
  });

  var sliderBig = new Swiper('.slider-big', {
    breakpoints: {
      320:{
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      1226:{
        thumbs: {
          swiper: sliderThumb,
        },       
      }
    }
  });

  $('.dropdown').click(function () {
    var width = $(window).width();
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('dropdown--active');
    if(width > 650){
      $(this).find('.dropdown-menu').slideToggle(300);

    }
  });
  $('.dropdown').focusout(function () {
    var width = $(window).width();
    if(width > 1100){
      $(this).removeClass('dropdown--active');
      $(this).find('.dropdown-menu').slideUp(300);
    }
  });
  $('.dropdown-menu__item').click(function (e) {
    e.stopPropagation();
    if($(this).hasClass('dropdown-menu__item--all')){
      if($(this).parents('.dropdown-menu').find('.dropdown-menu__input').prop('checked') == true){
        $(this).parents('.dropdown-menu').find('.dropdown-menu__input').prop('checked', true);
      }else{
        $(this).parents('.dropdown-menu').find('.dropdown-menu__input').prop('checked', false);
      }
    }
    $(this).parents('.dropdown').find('.select__text').text($(this).text());
    $(this).parents('.dropdown').find('.dropdown__input-hidden').attr('value', $(this).text());
  });

  $('.filter-item__title').on('click', function(){
    var width = $(window).width();
    if(width < 1100 && $(this).parents('.filters__box').attr('class') == 'filters__box' &&!$(this).parent('.filter-item').hasClass('filter-item--availability')){
      if($(this).next().attr('class') == 'dropdown'){
        $(this).next().find('.dropdown-menu').slideToggle(300);
        console.log('drop');
      }else{
        $(this).next().slideToggle(300);
      }
      
    }
  })

  var testimonial = new Swiper('.testimonial__slider', {
    breakpoints: {
      320:{
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 20,
        initialSlide: 1,
      },
      1100:{
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
      },
    }
  });

  var brand = new Swiper('.popular-brands__slider', {
    breakpoints: {
      320:{
        slidesPerView: 3,
        slidesPerGroup: 3,
        grid: {
          rows: 2,
          fill: 'row'
        },
        spaceBetween: 15,
        allowTouchMove: false
      },
      768:{
        slidesPerView: 3,
        slidesPerGroup: 3,
        grid: {
          rows: 2,
          fill: 'row'
        },
        spaceBetween: 40,
        allowTouchMove: false
      },
      1100:{
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
      },
    }
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

  var brandInnerWidth = $('.popular-brands__inner').width();
  $('.popular-brands__slide').children('.decor-top').css('width', `${brandInnerWidth}`);

  $('.products__tab-link').on('click', function(e){
    e.preventDefault();
    $('.products__tab-link').removeClass('products__tab-link--active');
    $('.products__content').removeClass('products__content--active');
    var id  = $(this).attr('href');
		$(this).addClass('products__tab-link--active');
		$(id).addClass('products__content--active');
  })
  $('.catalog-page__tab').on('click', function(e){
    e.preventDefault();
    $('.catalog-page__tab').removeClass('catalog-page__tab--active');
		$(this).addClass('catalog-page__tab--active');
  })

  var products = new Swiper('.products__slider', { 
    breakpoints: {
      320:{
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
      680:{
        slidesPerView: 2,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
      768:{
        slidesPerView: 3,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
      1226:{
        slidesPerView: 4,
        grid: {
          rows: 2,
          fill: 'row'
        },
        spaceBetween: 20,
      },
    }
  });
  var productItem = new Swiper('.product-item__slider', {
    breakpoints: {
      1100:{
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
    }
    
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

  $(document).on('click', function(e){
    if(!$('.menu-catalog__btn').is(e.target) && !$('.menu-catalog__tabs').is(e.target) && $('.menu-catalog__tabs').has(e.target).length === 0 && $('.menu-catalog__btn').has(e.target).length === 0) { 
      $('.menu-catalog__tabs').removeClass('menu-catalog__tabs--active'); 
    }
    
  })
  
  // $('.product-item__title').each(function(index, element) {
  //   $clamp(element, { clamp: 2, useNativeClamp: true});
  // }); 
  

  $('.menu-catalog__btn').on({
    'click': function(e){
      e.preventDefault();
      $('.menu-catalog__tabs').toggleClass('menu-catalog__tabs--active');
    }
  });   
  
  

  $('.menu-catalog__tab-link').on('click', function(e){
    e.preventDefault();
    $('.menu-catalog__tab-link').removeClass('menu-catalog__tab-link--active');
    $('.menu-catalog__content').removeClass('menu-catalog__content--active');
    var id  = $(this).attr('href');
		$(this).addClass('menu-catalog__tab-link--active');
		$(id).addClass('menu-catalog__content--active');
  });

  


  if(width < 1100){
    $('.menu-catalog__tab-link').removeClass('menu-catalog__tab-link--active');
    $('.menu-catalog__content').removeClass('menu-catalog__content--active');
    $('.menu-catalog__tab-link').addClass('menu-catalog__tab-link--touch');
    $('.menu-catalog__btn-text').text('Меню');
    $('.filters__box').addClass('mfp-hide');
    $('.filters__box').find('.dropdown-menu').slideToggle(300);
    $('.additional-promo__text').collapser({
      mode: 'lines',
      truncate: 3,
      showText: 'Читать далее…',
      hideText: 'Скрыть',   
    });
  }

  


  if(width < 768){
    $('.more-products__link p').html('Смотреть каталог');
  }
  
  $('.menu-catalog__tab-link--touch').on('click', function(e){
    e.preventDefault();    
    var id  = $(this).attr('href');
    console.log(id);
    $(id).slideToggle();
  });

  if($('.brand__items').length > 0){
    var mixer = mixitup('.brand__items', {
      selectors: {
        control: '.brand__filter-btn'
      }
    });
  }
})