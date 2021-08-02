// var isIE = (document.all) ? true : false;

var $ = function (id) {
	return "string" == typeof id ? document.getElementById(id) : id;
};

var Extend = function(destination, source) {
	for (let property in source) {
		destination[property] = source[property];
	}
}

// var Bind = function(object, fun) {
// 	return function() {
// 		return fun.apply(object);
        
// 	}
// }

// var BindAsEventListener = function(object, fun) {
// 	var args = Array.prototype.slice.call(arguments).slice(2);
// 	return function(event) {
// 		return fun.apply(object, [event || window.event].concat(args));
// 	}
// }

var CurrentStyle = function(element){
    //使用 getComputedStyle 读取样式
	return element.currentStyle || document.defaultView.getComputedStyle(element, null);
}

// function addEventHandler(oTarget, sEventType, fnHandler) {
// 	if (oTarget.addEventListener) {
// 		oTarget.addEventListener(sEventType, fnHandler, false);
// 	} else if (oTarget.attachEvent) {
// 		oTarget.attachEvent("on" + sEventType, fnHandler);
// 	} else {
// 		oTarget["on" + sEventType] = fnHandler;
// 	}
// };

// function removeEventHandler(oTarget, sEventType, fnHandler) {
//     if (oTarget.removeEventListener) {
//         oTarget.removeEventListener(sEventType, fnHandler, false);
//     } else if (oTarget.detachEvent) {
//         oTarget.detachEvent("on" + sEventType, fnHandler);
//     } else { 
//         oTarget["on" + sEventType] = null;
//     }
// };

//Resize类 
export default function Resize(obj, options) {
	this._obj = obj;//缩放对象
	
	this._styleWidth = this._styleHeight = this._styleLeft = this._styleTop = 0;//样式参数
	this._sideRight = this._sideDown = this._sideLeft = this._sideUp = 0;//坐标参数
	this._fixLeft = this._fixTop = 0;//定位参数
	this._scaleLeft = this._scaleTop = 0;//定位坐标
	
	this._mxSet = function(){};//范围设置程序
	this._mxRightWidth = this._mxDownHeight = this._mxUpHeight = this._mxLeftWidth = 0;//范围参数
	this._mxScaleWidth = this._mxScaleHeight = 0;//比例范围参数
	
	this._fun = function(){};//缩放执行程序
	
	//获取边框宽度
	var _style = CurrentStyle(this._obj);
	this._borderX = (parseInt(_style.borderLeftWidth) || 0) + (parseInt(_style.borderRightWidth) || 0);
	this._borderY = (parseInt(_style.borderTopWidth) || 0) + (parseInt(_style.borderBottomWidth) || 0);
	//事件对象(用于绑定移除事件)
	// this._fR = BindAsEventListener(this, this.Resize);
	this._fR = this.Resize.bind(this);
	// this._fS = Bind(this, this.Stop);
	this._fS = this.Stop.bind(this);
	this.setOptions(options);
	//范围限制
	this.Max = !!this.options.Max;
	this._mxContainer = this.options.mxContainer || null;
	this.mxLeft = Math.round(this.options.mxLeft);
	this.mxRight = Math.round(this.options.mxRight);
	this.mxTop = Math.round(this.options.mxTop);
	this.mxBottom = Math.round(this.options.mxBottom);
	//宽高限制
	this.Min = !!this.options.Min;
	this.minWidth = Math.round(this.options.minWidth);
	this.minHeight = Math.round(this.options.minHeight);
	//按比例缩放
	this.Scale = !!this.options.Scale;
	this.Ratio = Math.max(this.options.Ratio, 0);
	
	this.onResize = this.options.onResize;
	this.props = this.options.props;
	// this._obj.style.position = "absolute";
	// !this._mxContainer || CurrentStyle(this._mxContainer).position == "absolute" || (this._mxContainer.style.position = "absolute");
}

Resize.prototype.setOptions = function(options) {

	this.options = {//默认值
		Max:		false,//是否设置范围限制(为true时下面mx参数有用)
		mxContainer:null,//指定限制在容器内
		mxLeft:		0,//左边限制
		mxRight:	9999,//右边限制
		mxTop:		0,//上边限制
		mxBottom:	9999,//下边限制
		Min:		true,// false 是否最小宽高限制(为true时下面min参数有用)
		minWidth:	50,//最小宽度
		minHeight:	50,//最小高度
		Scale:		false,//是否按比例缩放
		Ratio:		0,//缩放比例(宽/高)
		onResize:	function(){},//缩放时执行
		props: {}
    };
    Extend(this.options, options || {});

}

Resize.prototype.addListener = function(resize, side) {
	let resizeDom = $(resize), fun;
	if (!resizeDom) 
	return;
	//根据方向设置
	switch (side.toLowerCase()) {
	case "up" :
		fun = this.Up;
		break;
	case "down" :
		fun = this.Down;
		break;
	case "left" :
		fun = this.Left;
		break;
	case "right" :
		fun = this.Right;
		break;
	case "left-up" :
		fun = this.LeftUp;
		break;
	case "right-up" :
		fun = this.RightUp;
		break;
	case "left-down" :
		fun = this.LeftDown;
		break;
	case "right-down" :
	default :
		fun = this.RightDown;
	};
	// //设置触发对象
	// addEventHandler(resizeDom, "mousedown", BindAsEventListener(this, this.Start, fun));
	//设置触发对象
	resizeDom.addEventListener("mousedown", (e) => {this.Start(e, fun)}, false);
    
}


Resize.prototype.Start = function(e, fun, touch) {
	e.stopPropagation();
	//防止冒泡(跟拖放配合时设置)
	// e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
	// //阻止默认事件
	e.preventDefault();
	
	//设置执行程序
	this._fun = fun;
	//样式参数值
	this._styleWidth = this._obj.offsetWidth; //clientWidth
	this._styleHeight = this._obj.offsetHeight;//clientHeight
	this._styleLeft = this._obj.left || this.props.left;
	this._styleTop = this._obj.top || this.props.top;

	//四条边定位坐标
	this._sideLeft = e.clientX - this._styleWidth;
	this._sideRight = e.clientX + this._styleWidth;
	this._sideUp = e.clientY - this._styleHeight;
	this._sideDown = e.clientY + this._styleHeight;

	//top和left定位参数
	this._fixLeft = this._styleLeft + this._styleWidth;
	this._fixTop = this._styleTop + this._styleHeight;

	//缩放比例
	if(this.Scale){
		//设置比例
		this.Ratio = Math.max(this.Ratio, 0) || this._styleWidth / this._styleHeight;
		//left和top的定位坐标
		this._scaleLeft = this._styleLeft + this._styleWidth / 2;
		this._scaleTop = this._styleTop + this._styleHeight / 2;
	};
	//范围限制
	if(this.Max){
		//设置范围参数
		let mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
		//如果设置了容器，再修正范围参数
		if(!!this._mxContainer){
			mxLeft = Math.max(mxLeft, 0);
			mxTop = Math.max(mxTop, 0);
			mxRight = Math.min(mxRight, this._mxContainer.offsetWidth);//clientWidth
			mxBottom = Math.min(mxBottom, this._mxContainer.offsetHeight);//clientHeight
		};
		//根据最小值再修正
		mxRight = Math.max(mxRight, mxLeft + (this.Min ? this.minWidth : 0) + this._borderX);
		mxBottom = Math.max(mxBottom, mxTop + (this.Min ? this.minHeight : 0) + this._borderY);
		//由于转向时要重新设置所以写成function形式
		this._mxSet = function(){
			this._mxRightWidth = mxRight - this._styleLeft - this._borderX;
			this._mxDownHeight = mxBottom - this._styleTop - this._borderY;
			this._mxUpHeight = Math.max(this._fixTop - mxTop, this.Min ? this.minHeight : 0);
			this._mxLeftWidth = Math.max(this._fixLeft - mxLeft, this.Min ? this.minWidth : 0);
		};
		this._mxSet();
		//有缩放比例下的范围限制
		if(this.Scale){
			this._mxScaleWidth = Math.min(this._scaleLeft - mxLeft, mxRight - this._scaleLeft - this._borderX) * 2;
			this._mxScaleHeight = Math.min(this._scaleTop - mxTop, mxBottom - this._scaleTop - this._borderY) * 2;
		};
	};

	//mousemove时缩放 mouseup时停止
	// addEventHandler(document, "mousemove", this._fR);
	document.addEventListener("mousemove", this._fR);
	// addEventHandler(document, "mouseup", this._fS);
	document.addEventListener("mouseup", this._fS);
	// if(isIE){
	// 	addEventHandler(this._obj, "losecapture", this._fS);
	// 	this._obj.setCapture();
	// }else{
	// 	// window.addEventListener("blur", this._fS, false);
	// 	addEventHandler(window, "blur", this._fS);
	// 	e.preventDefault();
	// };
	
}

//缩放
Resize.prototype.Resize = function(e) {
	//清除选择
	window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
	//执行缩放程序
	this._fun(e);

    //设置样式
    this._obj.style.width = this._styleWidth + "px";
    this._obj.style.height = this._styleHeight + "px";
    // this._obj.style.top = this._styleTop + "px"; 
    // this._obj.style.left = this._styleLeft + "px";
	//附加程序
	this.onResize(this._styleWidth, this._styleHeight);
}

//缩放程序
//上
Resize.prototype.Up = function(e) {
	this.RepairY(this._sideDown - e.clientY, this._mxUpHeight);
	this.RepairTop();
	this.TurnDown(this.Down);
},
  //下
Resize.prototype.Down = function(e) {
	this.RepairY(e.clientY - this._sideUp, this._mxDownHeight);
	this.TurnUp(this.Up);
},
//右
Resize.prototype.Right = function(e) {
	this.RepairX(e.clientX - this._sideLeft, this._mxRightWidth);
	this.TurnLeft(this.Left);
},
  //左
  Resize.prototype.Left = function(e) {
	this.RepairX(this._sideRight - e.clientX, this._mxLeftWidth);
	this.RepairLeft();
	this.TurnRight(this.Right);
  },
  //右下
  Resize.prototype.RightDown = function(e) {
	this.RepairAngle(
		e.clientX - this._sideLeft, this._mxRightWidth,
		e.clientY - this._sideUp, this._mxDownHeight
	);
	this.TurnLeft(this.LeftDown) || this.Scale || this.TurnUp(this.RightUp);
  },
  //右上
  Resize.prototype.RightUp = function(e) {
	this.RepairAngle(
		e.clientX - this._sideLeft, this._mxRightWidth,
		this._sideDown - e.clientY, this._mxUpHeight
	);
	this.RepairTop();
	this.TurnLeft(this.LeftUp) || this.Scale || this.TurnDown(this.RightDown);
  },
  //左下
  Resize.prototype.LeftDown = function(e) {
	this.RepairAngle(
		this._sideRight - e.clientX, this._mxLeftWidth,
		e.clientY - this._sideUp, this._mxDownHeight
	);
	this.RepairLeft();
	this.TurnRight(this.RightDown) || this.Scale || this.TurnUp(this.LeftUp);
  },
  //左上
  Resize.prototype.LeftUp = function(e) {
	this.RepairAngle(
		this._sideRight - e.clientX, this._mxLeftWidth,
		this._sideDown - e.clientY, this._mxUpHeight
	);
	this.RepairTop(); this.RepairLeft();
	this.TurnRight(this.RightUp) || this.Scale || this.TurnDown(this.LeftDown);
  },
  //修正程序
  //水平方向
  Resize.prototype.RepairX = function(iWidth, mxWidth) {
	iWidth = this.RepairWidth(iWidth, mxWidth);
	if(this.Scale){
		var iHeight = this.RepairScaleHeight(iWidth);
		if(this.Max && iHeight > this._mxScaleHeight){
			iHeight = this._mxScaleHeight;
			iWidth = this.RepairScaleWidth(iHeight);
		}else if(this.Min && iHeight < this.minHeight){
			var tWidth = this.RepairScaleWidth(this.minHeight);
			if(tWidth < mxWidth){ iHeight = this.minHeight; iWidth = tWidth; }
		}
		this._styleHeight = iHeight;
		this._styleTop = this._scaleTop - iHeight / 2;
	}
	this._styleWidth = iWidth;
  },
  //垂直方向
  Resize.prototype.RepairY = function(iHeight, mxHeight) {
	iHeight = this.RepairHeight(iHeight, mxHeight);
	if(this.Scale){
		var iWidth = this.RepairScaleWidth(iHeight);
		if(this.Max && iWidth > this._mxScaleWidth){
			iWidth = this._mxScaleWidth;
			iHeight = this.RepairScaleHeight(iWidth);
		}else if(this.Min && iWidth < this.minWidth){
			var tHeight = this.RepairScaleHeight(this.minWidth);
			if(tHeight < mxHeight){ iWidth = this.minWidth; iHeight = tHeight; }
		}
		this._styleWidth = iWidth;
		this._styleLeft = this._scaleLeft - iWidth / 2;
	}
	this._styleHeight = iHeight;
  },
  //对角方向
  Resize.prototype.RepairAngle = function(iWidth, mxWidth, iHeight, mxHeight) {
	iWidth = this.RepairWidth(iWidth, mxWidth);	
	if(this.Scale){
		iHeight = this.RepairScaleHeight(iWidth);
		if(this.Max && iHeight > mxHeight){
			iHeight = mxHeight;
			iWidth = this.RepairScaleWidth(iHeight);
		}else if(this.Min && iHeight < this.minHeight){
			var tWidth = this.RepairScaleWidth(this.minHeight);
			if(tWidth < mxWidth){ iHeight = this.minHeight; iWidth = tWidth; }
		}
	}else{
		iHeight = this.RepairHeight(iHeight, mxHeight);
	}
	this._styleWidth = iWidth;
	this._styleHeight = iHeight;
  },
  //top
  Resize.prototype.RepairTop = function() {
	this._styleTop = this._fixTop - this._styleHeight;
  },
  //left
  Resize.prototype.RepairLeft = function() {
	this._styleLeft = this._fixLeft - this._styleWidth;
  },
  //height
  Resize.prototype.RepairHeight = function(iHeight, mxHeight) {
	iHeight = Math.min(this.Max ? mxHeight : iHeight, iHeight);
	iHeight = Math.max(this.Min ? this.minHeight : iHeight, iHeight, 0);
	return iHeight;
  },
  //width
  Resize.prototype.RepairWidth = function(iWidth, mxWidth) {
	iWidth = Math.min(this.Max ? mxWidth : iWidth, iWidth);
	iWidth = Math.max(this.Min ? this.minWidth : iWidth, iWidth, 0);
	return iWidth;
  },
  //比例高度
  Resize.prototype.RepairScaleHeight = function(iWidth) {
	return Math.max(Math.round((iWidth + this._borderX) / this.Ratio - this._borderY), 0);
  },
  //比例宽度
  Resize.prototype.RepairScaleWidth = function(iHeight) {
	return Math.max(Math.round((iHeight + this._borderY) * this.Ratio - this._borderX), 0);
  },
  //转向程序
  //转右
  Resize.prototype.TurnRight = function(fun) {
	if(!(this.Min || this._styleWidth)){
		this._sideLeft = this._sideRight;
		this.Max && this._mxSet();
		return true;
	}
  },
  //转左
  Resize.prototype.TurnLeft = function(fun) {
	if(!(this.Min || this._styleWidth)){
		this._sideRight = this._sideLeft;
		this._fixLeft = this._styleLeft;
		this.Max && this._mxSet();
		return true;
	}
  },
  //转上
  Resize.prototype.TurnUp = function(fun) {
	if(!(this.Min || this._styleHeight)){
		this._sideDown = this._sideUp;
		this._fixTop = this._styleTop;
		this.Max && this._mxSet();
		return true;
	}
  },
  //转下
  Resize.prototype.TurnDown = function(fun) {
	if(!(this.Min || this._styleHeight)){
		this._sideUp = this._sideDown;
		this.Max && this._mxSet();
		return true;
	}
  },
  //停止缩放
  Resize.prototype.Stop = function() {
	//执行resize时的回调函数
	// this.onResize(this._styleWidth, this._styleHeight);

	document.removeEventListener("mousemove", this._fR, false);
	// removeEventHandler(document, "mousemove", this._fR);
	document.removeEventListener("mouseup", this._fS, false);


  }

