var inIframe = function() {
  try {
    return window.self !== window.top;
  } catch (err) {
    return true;
  }
};

if (inIframe()) {
  $('body').addClass('plain');
}

$(document).ready(function() {
  $('#teaser .carousel').carousel().on('slide.bs.carousel', function(event) {
    $("#teaser-products ul").removeClass("active");
    $('#' + event.relatedTarget.id + '-product').addClass("active");
  });

  $('[data-fancybox-type]').fancybox({
    padding : 0,
    width : 800,
  });

  $('.fancybox').fancybox({
    openEffect: 'elastic',
    prevEffect: 'fade',
    nextEffect: 'fade',
    padding : 0,
    helpers: {
      thumbs: {
        width: 100,
        height: 100
      }
    }
  });

  $(".fancybox-launcher").on("click", function(){
    $(".fancybox").eq(0).trigger("click");
  });
}).on("scroll", function(){
  if ($(window).scrollTop() >= 50) {
    $('#menu').addClass('sticky');
  }
  else {
    $('#menu').removeClass('sticky');
  }
});

