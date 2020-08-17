/*
    https://github.com/michael-eddy/js_ext/tree/master/jquery.scrollMe
    滚动插件 scrollMe
    需要先引用jquery后再引用
    创建： var id = scroll.scroll(element,way,speed,delay,wrap);
    element-需要滚动的元素&way-滚动的方向(up：从底部往上,down:从顶部往下)&speed-元素每次移动的像素点
    (默认为1px)&delay-间隔时间(默认为10ms)&wrap-内容是否自动换行(默认false)
    销毁： scroll.release(id)
    恢复： scroll.resume(id)
*/
var scrollMe = function () {
    var intervalPool = [];
    this.currentPool = function () {
        return intervalPool;
    }
    /*
        未完成
    */
    this.scrollCicle = function (element, way, speed, delay, wrap) {
        if (typeof speed == 'undefined' || speed == null) speed = 1;
        if (typeof delay == 'undefined' || delay == null) delay = 10;
        var uuid = '';
        if (typeof element != 'undefined' && element != null) {
            switch (way) {
                case 'up': {
                    if (typeof wrap != 'undefined' && wrap == true)
                        $(element).addClass('wrap');
                    var uuid = cicle(element);
                    var interval = setInterval(function () {
                        var children = $("#" + uuid).children();
                        for (var i = 0; i < children.length; i++) {
                            var p = parseFloat($(children[i]).attr('data-postion'));
                            if (isNaN(p)) {
                                p = parseFloat($(children[i]).attr('data-max'));
                                $(children[i]).attr('data-postion', p);
                            }
                            else {
                                p -= 1;
                                var min = parseFloat($(children[i]).attr('data-min'));
                                if (p <= min) {
                                    console.log(min, p);
                                    p = parseFloat($(children[i]).attr('data-max'))
                                }
                                $(children[i]).attr('data-postion', p)
                            }
                            $(children[i]).attr('style', 'top:' + p + 'px');
                        }
                    }, speed);
                    intervalPool.push({
                        uuid: uuid,
                        way: way,
                        element: element,
                        interval: interval,
                        speed: speed
                    });
                    break;
                }
                case 'down': {
                    cicle(element);

                    break;
                }
                default: {
                    console.log('不支持的类型');
                    break;
                }
            }
        }
        return uuid;
    }
    /*
        调用该方法使元素滚动
        element需要滚动的元素
        way元素滚动的方向 (up,down)
        speed元素每次移动的像素点,
        delay间隔时间
        wrap内容是否自动换行
    */
    this.scroll = function (element, way, speed, delay, wrap) {
        if (typeof speed == 'undefined' || speed == null) speed = 1;
        if (typeof delay == 'undefined' || delay == null) delay = 10;
        var uuid = '';
        if (typeof element != 'undefined' && element != null) {
            switch (way) {
                case 'up': {
                    if (typeof wrap != 'undefined' && wrap == true)
                        $(element).addClass('wrap');
                    var interval = bottomToTop(element, speed, delay);
                    uuid = new Date().getTime();
                    intervalPool.push({
                        uuid: uuid,
                        way: way,
                        element: element,
                        interval: interval,
                        speed: speed
                    });
                    break;
                }
                case 'down': {
                    if (typeof wrap != 'undefined' && wrap == true)
                        $(element).addClass('wrap');
                    var interval = topToBottom(element, speed, delay);
                    uuid = new Date().getTime();
                    intervalPool.push({
                        uuid: uuid,
                        way: way,
                        element: element,
                        interval: interval,
                        speed: speed
                    });
                    break;
                }
                default: {
                    console.log('不支持的类型');
                    break;
                }
            }
        }
        return uuid;
    }
    /*
        调用该方法停止滚动
        uuid创建滚动时返回的id
    */
    this.release = function (uuid) {
        var item = null;
        for (var index = 0; index < intervalPool.length; index++) {
            item = intervalPool[index];
            if (uuid != null && uuid != undefined && uuid == item.uuid) {
                clearInterval(item.interval);
                item.interval = null;
                break;
            }
            else if (uuid == null || uuid == undefined) {
                clearInterval(item.interval);
                item.interval = null;
            }
        }
        return item;
    }
    /*
        调用该方法恢复滚动
        uuid创建滚动时返回的id
    */
    this.resume = function (uuid) {
        var item = null;
        if (uuid != null && uuid != undefined) {
            for (var index = 0; index < intervalPool.length; index++) {
                if (intervalPool[index].uuid == uuid) {
                    item = intervalPool[index];
                    if (item.interval == null) {
                        switch (item.way) {
                            case 'up': {
                                var interval = bottomToTop(item.element, item.speed);
                                item.interval = interval;
                                break;
                            }
                            case 'down': {
                                var interval = topToBottom(item.element, item.speed);
                                item.interval = interval;
                                break;
                            }
                        }
                    }
                    else {
                        console.log('scroll interval still running!');
                    }
                    break;
                }
            }
        }
        return item;
    }
    function cicle(element) {
        var ch = $(element).height();
        var dh = $(element).parent().height();
        var content = $(element).clone().removeAttr('id');
        var html = $(content).addClass('scrollMeClone')[0].outerHTML;
        var context = '';
        var count = Math.ceil(dh / $(element).height());
        for (var i = 0; i < count; i++) {
            var obj = $(html).attr('name', 'node' + i);
            var min = ch * (count - i), max = dh + (i * ch);
            $(obj).attr('data-min', -min);
            $(obj).attr('data-max', max);
            context += $(obj)[0].outerHTML;
        }
        $(element).hide();
        var uuid = new Date().getTime();
        $(element).after('<div id="' + uuid + '">' + context + '</div>');
        return uuid;
    }
    /*
        调用该方法使元素从上到下滚动
    */
    function bottomToTop(element, speed, delay) {
        setClass(element);
        var dh = $(element).parent().height();
        var interval = setInterval(function () {
            var top = getTop(element);
            if (top == undefined)
                top = dh;
            top -= speed;
            if (top <= -$(element).height())
                top = dh;
            setStyle(element, top);
        }, delay);
        return interval;
    }
    /*
        调用该方法使元素从下到上滚动
    */
    function topToBottom(element, speed, delay) {
        setClass(element);
        var dh = $(element).parent().height();
        var interval = setInterval(function () {
            var top = getTop(element);
            if (top == undefined)
                top = 0;
            top += speed;
            if (top >= dh)
                top = 0;
            setStyle(element, top);
        }, delay);
        return interval;
    }
    /*
        调用该方法获取style中的top值
    */
    function getTop(element) {
        var style = $(element).attr('style'), top = undefined;
        if (style != undefined && style != null && style != '') {
            var array = style.split(';');
            for (var index = 0; index < array.length; index++) {
                if (array[index].indexOf('top') > -1) {
                    top = parseFloat(array[index].split(':')[1]);
                    break;
                }
            }
        }
        return top;
    }
    /*
        调用该方法重组style值
    */
    function setStyle(element, top) {
        var style = $(element).attr('style');
        var output = '';
        if (style != undefined && style != null && style != '') {
            var array = style.split(';');
            for (var i = 0; i < array.length; i++) {
                if (array[i].indexOf('top') == -1)
                    output += sl;
            }
        }
        output += "top:" + top + "px";
        $(element).attr('style', output);
    }
    function setClass(element) {
        if (!$(element).hasClass('scrollMe'))
            $(element).addClass('scrollMe');
    }
}
var scroll = new scrollMe();