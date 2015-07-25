function matchWindowScroll(arg) {
  var options = arg || {};
  var $window = $(window);
  var $sections = $('.section');
  var len = $sections.length;
  var win = {};
  var isAnimation = false;
  var sectionPos = [];
  var current = 0;
  var d = ''; 
  var timer;
  var wtop = 0;
  //event
  $window.resize(function() {
    setState();
  });

  $(document).mousewheel( function(e, delta) {
    if( isLast(delta) ) {
      return 0;
    }
    e.preventDefault();
    if( !isAnimation ) {
      if(delta < 0) {
        current += 1;
      } else {
        current -= 1;
      }
      move();
    }
  });

  $window.scroll(function() {
    wtop = Math.ceil($window.scrollTop());
    var current = sectionPos[current];
    var d;
    if(wtop > current) {
      d = 1;
    } else {
      d = -1;
    }
    var dd = current + d;
    var temp = 0;
    for(var i = 0; i < len; i += 1) {
      if( i === dd && d === 1 && wtop >= sectionPos[dd]) {
        current = dd;
        $window.trigger('matchScrollEnd', this);
      }
      if( i === dd && d === -1 && wtop <= sectionPos[dd]) {
        current = dd;
        $window.trigger('matchScrollEnd', this);
      }
    }
  });

  //function
  var setState = function() {
    win = { w: $window.width() , h: $window.height() };

    windowMatchImage($('#seen1'), 200, 100);
    
    if (timer !== false) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
    sectionPos = [];
    var diff = 10000;
    var target = undefined;
    
    $sections.css({height: win.h + 'px'});
    $sections.each(function(v, i) {
      sectionPos.push(Math.ceil($(this).offset().top));
      target = i;
    });

    if(target && wtop) {
      scrollAnimation();
    }
    }, 200);

  };

  var move = function() {
    scrollAnimation();
  };

  var scrollAnimation = function() {
    checkLast();
    if(current < 0)
      current = 0;

    isAnimation = true;
    var top = sectionPos[current];

    $window.trigger('matchScrollStart', this);
    $('html, body').animate({ scrollTop: top }, { duration: 400, easing: 'easeOutQuad', complete: function() {
      setTimeout((function() {
        isAnimation = false;
      }), 1000 );
    }});
  };


  function isLast(delta) {
    if(options.hasFooter) {
      return current > len - 1 && delta < 0;
    } else {
      return current > len - 1 && delta < 0;
    }
  };

  function checkLast() {
    if(options.hasFooter) {
      if(current > len)
        current = len;
    } else {
    if(current >= len - 1)
      current = len - 1;
    }
  };

  //ウィンドウいっぱいに画像を表示
  var windowMatchImage = function($warapImage, originalWidth, originalHeight) {
    var win = { w: $(window).width(), h: $(window).height() };
    var $images = $warapImage.find('.image');
    //ウィンドウの幅いっぱいに広がった時の画像の縦横のピクセルを算定
    var tempSize = { w: win.w, h: win.w * (originalHeight / originalWidth) };
    if( tempSize.h < win.h ) {//画像のスケールサイズがウィンドウの高さに満たない
      $images.css( {width: 'auto', height: win.h + 'px'} );
    } else {
      $images.css( {width: win.w + 'px', height: 'auto'} );
    }
    var img = { w: $images.width(), h: $images.height() };
    var margin = { top: Math.abs(win.h - img.h) / 2, left: Math.abs(win.w - img.w) / 2 };
    $images.css( {'margin-top': (margin.top * -1) + 'px', 'margin-left': (margin.left * -1) + 'px'} );
  };

  var init = function() {
    setState();
  };

  init();

  return {
    getCurrent: function() {
      return current;
    },
    getElm: function() {
      return $sections.eq(current);
    }
  };

};
