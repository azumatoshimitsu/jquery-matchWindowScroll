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
  $window.bind('resize', setSize);

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
      }), 1000 );
    }});
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
