$(function () {
    "use strict";
    
    // data
    
    
    // scrollspy
    $('body').on('click', '.page-scroll a', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 800, 'easeInOutExpo');
        event.preventDefault();
    });
    
    // image carousel
    $('.image_slider').slick({
        infinite: false,
        speed: 150,
        draggable: false,
        variableWidth: true
    });
    
    // image lightbox
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function (event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });
});
