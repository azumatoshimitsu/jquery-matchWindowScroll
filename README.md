jquery-matchWindowScroll
========================

マウスホイール操作でウィンドウの高さ毎に分けられたブロック毎に上下に自動でスクロールする

##Install
```javascript
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.11/jquery.mousewheel.min.js"></script>
<script src="matchWindowScroll.js"></script>
```

##Example
```javascript
var mw = matchWindowScroll();
$(window).on('matchScrollStart', function() {
  $(elm).text('event : matchScrollStart, count : ' + mw.getCount() + ', element id : #' + mw.getElm().attr('id') );
});
$(window).on('matchScrollEnd', function() {
  $(elm).text('event : matchScrollEnd, count : ' + mw.getCount() + ', element id : #' + mw.getElm().attr('id') );
});
```
