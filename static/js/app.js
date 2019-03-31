$(document).ready(function(){
    var $body = $('body');
    var $nav = $('#nav');
    var $banner = $('#header');
    var $root = $('html, body');
    var $bio = $('#bio');
    var $about = $("#about");
    var $offset = $(".offset");
    var $ww = window.innerWidth;
    
//    $body.addClass('animated fadeIn');
    $bio.addClass('animated fadeInUp');
    
    
    
    //banner scroll event
//    var $namePos = $('#name').offset().top;
    $(window).scroll(function(){
        if ($(this).scrollTop() >= 200){
            $bio.addClass('fadeOutDown');
            $bio.css("z-index",0);
        }else {
            $bio.removeClass('fadeOutDown');
            $bio.css("z-index",2);
        }
    });
    
     //SMOOTH SCROLL HREF 
    $('a').click(function() {
        $root.animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 500);
        return false;
    });
    $('a').hover(function(){
//        $(this).toggleClass('animated fadeInUp');
//        $(this).css({color:"orange"});
    })


});