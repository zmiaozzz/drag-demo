/**
 * 拖拽
 * @author zhangmiao at 2015-11-30
 *
 */
var Util = {
    on: function (element, type, handler) {
        if(element.addEventListener)
            element.addEventListener(type, handler, false)
        else if(element.attachEvent)
            element.attachEvent(type, handler)
        else
            element['on' + type] = handler;
    },
    un: function (element, type, handler) {
        if(element.removeEventListener)
            element.removeEventListener(type, handler, false)
        else if(element.detachEvent)
            element.detachEvent(type, handler)
        else element['on' + type] = null;
    },
    evt: function (e) {
        return e || window.event;
    }
};

var config;
var distance = {};
function Config(opt) {
    this.target = opt.target;
    this.container = opt.container;
}
function Dragdrop(opt) {
    if(!opt) return;
    config = new Config(opt);
    console.log(config)
    Util.on(config.target, 'mousedown', mouseDown);
}

function mouseDown(event) {
    var e = Util.evt(event);
    //鼠标位置
    var mousePos = {};
    mousePos.left = e.clientX;
    mousePos.top = e.clientY;
    //拖拽对象
    var el = config.target;
    el.style.position = 'absolute';
    el.style.cursor = 'move';
    //拖拽对象的位置
    var elePos = {};
    elePos.left = el.offsetLeft;
    elePos.top = el.offsetTop;
    //鼠标位置在拖拽对象中的位置
    distance.left = mousePos.left - elePos.left;
    distance.top = mousePos.top - elePos.top;
    //监听鼠标移动和鼠标松开事件
    Util.on(document, 'mousemove', mouseMove);
    Util.on(document, 'mouseup', mouseUp);
}
function mouseMove(event) {
    var e = Util.evt(event);
    var el = config.target;
    var container = config.container;
    //鼠标移动过程中，鼠标的位置
    var mousePos = {};
    mousePos.left = e.clientX;
    mousePos.top = e.clientY;
    //拖拽对象的位置变化
    var targetPos = {};
    targetPos.left = mousePos.left - distance.left;
    targetPos.top = mousePos.top - distance.top;
    //容器大小
    var containerSize = {};
    containerSize.cWidth = container.offsetWidth;
    containerSize.cHeight = container.offsetHeight;

    var maxWidth = containerSize.cWidth - el.offsetWidth;
    var maxTop = containerSize.cHeight - el.offsetHeight;

    //将target控制在container之内
    if(targetPos.left < 0) {
        targetPos.left = 0;
    }
    else if(targetPos.left > maxWidth) {
        targetPos.left = maxWidth;
    }

    if(targetPos.top < 0) {
        targetPos.top = 0;
    }
    else if(targetPos.top > maxTop) {
        targetPos.top = maxTop;
    }
    //改变target的位置，随着鼠标移动
    el.style.left = targetPos.left + 'px';
    el.style.top = targetPos.top + 'px';

}
function mouseUp(event) {
    var el = config.target;
    el.style.cursor = 'default';
    Util.un(document, 'mousemove', mouseMove);
    Util.un(document, 'mouseup', mouseUp);
}