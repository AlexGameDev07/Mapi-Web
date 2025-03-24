$(document).ready(function() {
    var SwiperSliderOne = new Swiper('.photography-swiper--slider', {
              loop: true,
              parallax: true,
              autoplay: {
                  delay: 5000,
                },
              effect: 'fade',
              autoHeight: true,
              speed: 2500,
              pagination: {
                  el: '.swiper-pagination',
                  clickable: true,
              },
              navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                  clickable: true,
              },
          });
  });