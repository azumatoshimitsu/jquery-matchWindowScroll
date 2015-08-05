var AddSwipeEvent = function() {

	this.isTouch = ('createTouch' in document);
	this.move = (this.isTouch)? 'touchmove'  : 'mousemove';
	this.down = (this.isTouch)? 'touchstart' : 'mousedown';
	this.up   = (this.isTouch)? 'touchend'   : 'mouseup';
	this.out  = (this.isTouch)? 'touchend'   : 'mouseout';
	this.startPos = { x: 0, y: 0 };
	this.endPos = { x: 0, y: 0 };
	this.diff = { x: 0, y: 0 };
	
	//event = document.createEvent(MouseEvents);
	//event.initMouseEvent(type, canBubble, cancelable, view,
    //                 detail, screenX, screenY, clientX, clientY,
    //                 ctrlKey, altKey, shiftKey, metaKey,
    //                 button, relatedTarget);

	if(!document.addEventListener) {
		throw new Error('addEventListener がサポートされていません');
	}
	if(!document.createEvent) {
		throw new Error('createEvent がサポートされていません');
	}

	document.addEventListener(this.down, function(e) {
		this.startPos = { x: e.clientX, y: e.clientY };
	});

	document.addEventListener(this.up, function(e) {
		this.endPos = { x: e.clientX, y: e.clientY };
		this.diff = { x: this.endPos.x - this.startPos.x, y: this.endPos.y - this.startPos.y };

		if(this.diff.x < 0) {
			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('swipeleft', true, true, document,
			                 0, 0, 0, this.endPos.x, this.endPos.y,
			                 false, false, false, false,
			                 0, null);
			document.dispatchEvent(event);
		}
		if(this.diff.x > 0) {
			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('swiperight', true, true, document,
			                 0, 0, 0, this.endPos.x, this.endPos.y,
			                 false, false, false, false,
			                 0, null);
			document.dispatchEvent(event);
		}
		if(this.diff.y < 0) {
			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('swipeup', true, true, document,
			                 0, 0, 0, this.endPos.x, this.endPos.y,
			                 false, false, false, false,
			                 0, null);
			document.dispatchEvent(event);
		}
		if(this.diff.y > 0) {
			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('swipedown', true, true, document,
			                 0, 0, 0, this.endPos.x, this.endPos.y,
			                 false, false, false, false,
			                 0, null);
			document.dispatchEvent(event);
		}
	});

};