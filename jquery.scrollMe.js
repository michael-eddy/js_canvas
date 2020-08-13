/*
    滚动插件 scrollMe
    需要先引用jquery后再引用
    创建： var id = scroll.scroll(element,way,speed);
    销毁： scroll.release(id)
    恢复： scroll.resume(id)
*/
var scrollMe = function () {
    var intervalPool = [];
    /*
        调用该方法使元素滚动
        element需要滚动的元素
        way元素滚动的方向 (top:,tottom:)
        speed元素滚动的速度，10≤x
    */
    this.scroll = function (element, way, speed = 10) {
        var uuid = '';
        if (element != undefined && element != null) {
            switch (way) {
                case 'top': {
                    var interval = topToBottom(element, speed);
                    uuid = new Date().getTime();
                    intervalPool.push({ uuid, way, element, interval });
                    break;
                }
                case 'bottom': {
                    var interval = bottomToTop(element, speed);
                    uuid = new Date().getTime();
                    intervalPool.push({ uuid, way, element, interval });
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
                            case 'top': {
                                var interval = topToBottom(item.element, item.speed);
                                item.interval = interval;
                                break;
                            }
                            case 'bottom': {
                                var interval = bottomToTop(item.element, item.speed);
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
    function topToBottom(element, speed) {
        setStyle(element);
        var dh = $(element).parent().height();
        var interval = setInterval(function () {
            var p = dh;
            if ($(element).attr('p') != undefined && $(element).attr('p') != null)
                p = parseInt($(element).attr('p'));
            p -= 1;
            if (p <= -$(element).height())
                p = dh;
            $(element).attr('p', p);
            $(element).attr('style', 'top:' + p + 'px');
        }, speed);
        return interval;
    }
    function bottomToTop(element, speed) {
        setStyle(element);
        var dh = $(element).parent().height();
        var interval = setInterval(function () {
            var p = 0;
            if ($(element).attr('p') != undefined && $(element).attr('p') != null)
                p = parseInt($(element).attr('p'));
            p += 1;
            if (p >= dh)
                p = 0;
            $(element).attr('p', p);
            $(element).attr('style', 'top:' + p + 'px');
        }, speed);
        return interval;
    }
    function setStyle(element) {
        if (!$(element).hasClass('scrollMe'))
            $(element).addClass('scrollMe');
    }
}
var scroll = new scrollMe();