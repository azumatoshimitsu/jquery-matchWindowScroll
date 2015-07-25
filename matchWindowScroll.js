function matchWindowScroll(options) {
  var $window = $(window);
  var $sections = $('.section');
  var len = $sections.length;
  var win = {};
  var isAnimation = false;
  var sectionPos = [];
  var count = 0;
  var d = ''; 
  //event
  $window.resize(function() {
    setSize();
  });

  $(document).mousewheel( function(e, delta) {
    e.preventDefault();
    if( !isAnimation ) {
      if(delta < 0) {
        nextSeen();
      } else {
        prevSeen();
      }
    }
  });

  $window.scroll(function() {
    var current = sectionPos[count];
    var top = Math.ceil($window.scrollTop());
    var d;
    if(top > current) {
      d = 1;
    } else {
      d = -1;
    }
    var dd = count + d;
    var temp = 0;
    for(var i = 0; i < len; i += 1) {
      if( i === dd && d === 1 && top >= sectionPos[dd]) {
        count = dd;
        $window.trigger('matchScrollEnd', this);
      }
      if( i === dd && d === -1 && top <= sectionPos[dd]) {
        count = dd;
        $window.trigger('matchScrollEnd', this);
      }
    }
  });

  //function
  var setSize = function() {
    win = { w: $window.width() , h: $window.height() };
    $sections.css({height: win.h + 'px'});
    sectionPos = [];
    $sections.each(function(v, i) {
      sectionPos.push(Math.ceil($(this).offset().top));
    });

    windowMatchImage($('#seen1'), 200, 100);
  };

  var prevSeen = function() {
    var temp = count - 1;
    if(count < 0)
      return;
    scrollAnimation(temp);
  };

  var nextSeen = function() {
    var temp = count + 1;
    if(count > len - 2)
      return;
    scrollAnimation(temp);
  };

  var scrollAnimation = function(n) {
    isAnimation = true;
    $window.trigger('matchScrollStart', this);
    var top = sectionPos[n];
    $('html, body').animate({ scrollTop: top }, { duration: 400, easing: 'easeOutQuad', complete: function() {
      setTimeout((function() {
        isAnimation = false;
      }), 600 );
    }});
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
    setSize();
  };

  init();

  return {
    getCount: function() {
      return count;
    },
    getElm: function() {
      return $sections.eq(count);
    }
  };

};
