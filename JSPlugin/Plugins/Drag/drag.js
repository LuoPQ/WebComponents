//#region js鎷栨嫿鎻掍欢
//; (function () {
"use strict";

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (value) {

        var i = this.length;
        while (i--) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
}


window.currentDrag = null;

var dragPara = {
    mouseX: null,
    mouseY: null,
    objX: null,
    objY: null,
    zIndex: 1000
};

var noDragTag = ["a", "input", "select", "option", "textarea"];

window.drag = function (eles) {

    var helper = {
        //====判断是否是数组====
        isArray: function (o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        },
        //====获取元素的样式===
        getStyle: function (node, styleName) {
            var realStyle = null;
            if (node.currentStyle) {
                realStyle = node.currentStyle[styleName];
            } else if (window.getComputedStyle) {
                realStyle = window.getComputedStyle(node, null)[styleName];
            }
            return realStyle;
        },
        //=====获取元素的滚动距离=====
        getScroll: function () {
            return {
                left: document.documentElement.scrollLeft || document.body.scrollLeft,
                top: document.documentElement.scrollTop || document.body.scrollTop
            }
        }
    }

    if (helper.isArray(eles)) {
        for (var i = 0; i < eles.length; i++) {
            bindEvent(eles[i]);
        }
    } else {
        bindEvent(eles);
    }

    function bindEvent(ele) {

        ele.onmousedown = function (event) {
            event = event || window.event;

            var scroll = helper.getScroll();

            dragPara.mouseX = parseInt(event.clientX) + scroll.left;
            dragPara.mouseY = parseInt(event.clientY) + scroll.top;

            currentDrag = this;

            dragPara.objX = parseInt(helper.getStyle(currentDrag, 'left')) || 0;
            dragPara.objY = parseInt(helper.getStyle(currentDrag, 'top')) || 0;
            this.style.zIndex = dragPara.zIndex++;
        };

        ele.onmouseover = function () {
            ele.style.cursor = "move";
        }
        ele.onmouseout = function () {
            ele.style.cursor = "default";
        }

        document.onmouseup = clearDrag;
        document.onmousemove = move;
        window.onblur = clearDrag;
    }

    //====清除拖拽对象====
    function clearDrag() {
        currentDrag = null;
    }

    //=======移动=====
    function move(event) {
        if (currentDrag) {
            event = event || window.event;
            var target = event.target || event.srcElement;

            var nodeName = target.nodeName.toLowerCase();
            if (noDragTag.indexOf(nodeName) > -1) {
                return;
            }

            if (!event) {
                currentDrag.onselectstart = function () {
                    return false;
                }
            }
            currentDrag.style.position = "absolute";
            var scroll = helper.getScroll();
            currentDrag.style.left = parseInt(event.clientX) + scroll.left - dragPara.mouseX + dragPara.objX + "px";
            currentDrag.style.top = parseInt(event.clientY) + scroll.top - dragPara.mouseY + dragPara.objY + "px";

            //延迟调用，提高性能
            document.onmousemove = null;
            setTimeout(function () {
                document.onmousemove = move;
            }, 30);
        }
    }
}
//})();
//#endregion