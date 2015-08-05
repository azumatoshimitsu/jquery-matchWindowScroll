function matchWindowScroll(arg) {

  var options = arg || {};
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

  //ウィンドウがリサイズされた場合はプロパティをサイズに合わせて扁壺
  $(window).resize(function() {
    setState();
  });

  //マウスホイール操作でセクションを移動
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
      scrollAnimation();
    }
  });

  $(document).on('swipeup', function(e) {
    if( !isAnimation ) {
      current += 1;
      scrollAnimation();
    }
  });
  $(document).on('swipedown', function(e) {
    if( !isAnimation ) {
      current -= 1;
      scrollAnimation();
    }
  });

  //ウィンドウのスクロール量を監視し各セクションのオフセットポジションを超えていれば matchScrollEnd をイベントを発火
  $(window).scroll(function() {
    wtop = Math.ceil($(window).scrollTop());
    var c = sectionPos[current];
    var d;
    if(wtop > c) {
      d = 1;
    } else {
      d = -1;
    }
    var temp = 0;
    for(var i = 0; i < len; i += 1) {
      if( i === current && d === 1 && wtop >= sectionPos[current]) {
        $(window).trigger('matchScrollEnd', this);
      }
      if( i === current && d === -1 && wtop <= sectionPos[current]) {
        $(window).trigger('matchScrollEnd', this);
      }
    }

    //スクロールバー操作が完了したら位置を確認してセクションの途中にあったら自動スクロール
    //if(!isAnimation) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      $(window).trigger('adjustScrollStart', this);

      var diff = 10000;
      var target = undefined;

      for(var i = 0; i < len; i+= 1) {
        var selftop = sectionPos[i];
        if( Math.abs(wtop - selftop) <  diff ) {
          diff = wtop - selftop;
          target = i;
        }
      }
      //セクションの最下部よりもあれば自動スクロール
      if(target && wtop < sectionPos[sectionPos.length - 1]) {
        current = target;
        scrollAnimation();
      }
    }, 200);
    console.log(current);
    //}
  });

  //function
  //ウィンドウリサイズでプロパティを初期化
  var setState = function() {
    win = { w: $(window).width() , h: $(window).height() };
    windowMatchImage($('#seen1'), 200, 100);
    sectionPos = [];
    
    var target = undefined;
      
    $sections.css({height: win.h + 'px'});
    $sections.each(function(v, i) {
      sectionPos.push(Math.ceil($(this).offset().top));
      target = i;
    });

    if(target && wtop) {
      scrollAnimation();
    }
  };

  //自動スクロール
  var scrollAnimation = function() {
    checkLast();
    if(current < 0)
      current = 0;

    isAnimation = true;
    var top = sectionPos[current];

    $(window).trigger('matchScrollStart', this);
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
    //@return number
    getCurrent: function() {
      return current;
    },
    //@return DOM
    getElm: function() {
      return $sections.eq(current);
    }
  };

};
