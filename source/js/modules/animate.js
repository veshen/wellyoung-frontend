/*
 * space 命名空间
 * win window 对象
 * undef undefined
 */
;(function(space, win, undef){

//		var log = function(msg){
//			console.log(msg)
//		}

    /*
     * 缓动算法
     */
    var tween = {
        eain:function(t, b, c, d){ return - c * (t /= d) * (t - 2) + b}
    }

    /*
     * 获取Element对象css属性值
     */
    var css = window.getComputedStyle ?
        function(a, b, c){
            if( c == undefined){
                b = b.replace(/([A-Z])/g, "-$1");
                b = b.toLowerCase();
                return window.getComputedStyle(a, null).getPropertyValue(b);
            }else{
                a.style[b] = c;
            }
        }
        :function(a, b, c){
            if( c == undefined){
                if(b == "opacity"){
                    return a.style.filter.indexOf("opacity=") >= 0 ? parseFloat(a.style.filter.match(/opacity=([^)]*)/)[1]) / 100 : "1";
                }else { return a.currentStyle[b] == "auto" ? 0 : a.currentStyle[b];}
            }else{
                if(b == "opacity"){
                    a.style.filter = (a.filter || "").replace(/alpha\([^)]*\)/, "") + "alpha(opacity=" + c * 100 + ")";
                }else{ a.style[b] = c }
            }
        }


    var $ = function(id){
        return typeof id == 'string' ? document.getElementById(id) : id;
    }

    /*
     *  用于规范 需要变化对象的 key/vlaue
     */
    var getJsonMap = function(jsonMap){

        var arr = [];
        var a = null;
        for(a in jsonMap){
            var json = {};
            var test = String(jsonMap[a]).match(/(\d+)($|([a-z]+))/);
                json.interval = null;
                json.style = a;
                json.val = typeof jsonMap[a] == "number" ? jsonMap[a] : parseFloat(test[1]);
                json.px = test[3];
                arr[arr.length] = json;
        }

        return arr;

    }

    /*
     * animate 开始
     * id String|Element
     * jsonMap json对象
     * time 时长
     * callBack 回调函数，将会接收当前element对象作为第一个参数
     */
    var Animate = function(id, jsonMap, time, callBack){

        if( !(this instanceof win[space]) ){
            return new Animate(id, jsonMap);
        }

        this.init(id, jsonMap, time, callBack);


    }

    Animate.prototype = {
        init:function(id, jsonMap, time, callBack){
            this.config = {
                ele:$(id),
                delay:0,
                jsonMap:getJsonMap(jsonMap),
                time: time || 400,
                callBack: callBack === undef ? typeof time == "function" ? time : undef : callBack
            }
            return this;
        },
        /*
         * 主要实现方法
         */
        go:function(elem, style, val, callBack, time, px, callback){

            px = px || '';
            /*
             * 可能无法得到元素的真实值，
             * 比如可能得到 auto  空值等，都会引发BUG(只是一些特殊的属性 才会返回这些值)
             * 这里的零时解决办法是 默认为0
             */
            var b = parseFloat( css(elem, style) ) || 0;

            val = val - b;
            var st = new Date().getTime();
            var a = setInterval(function(){
                var t = new Date().getTime() - st;
                if( t > time){t = time;clearInterval(a);callBack&&callBack(elem);}
                css(elem, style, parseFloat(tween.eain(t, b, val, time))+ px, 2);
            }, 10);
            return a;
        },
        /*
         * 对外公开的 play() 开始动画
         */
        play:function(){

            var self = this, config = self.config;

            if(config.delay){
                setTimeout(function(){self.play()}, config.delay);
                config.delay = 0;
                return self;
            }

            var elem = config.ele;
            var callBack = config.callBack;
            var time = config.time;
            var i = 0;
            var j = 0;
            var len = config.jsonMap.length;

            var systemCallBack = function(){
                if(++j == len){
                    callBack && callBack(elem);
                };
            }

            for(; i<len; i++){
                config.jsonMap[i].interval = self.go(elem, config.jsonMap[i].style, config.jsonMap[i].val, callBack, time, config.jsonMap[i].px, systemCallBack);
            }


            return self;
        },

        /*
         * 停止动画
         */
        stop:function(k){

            var self = this, config = self.config;
            var i = 0;
            var len  = config.jsonMap.length;

            for(; i<len; i++){

                if(config.jsonMap[i].interval){
                    clearTimeout(config.jsonMap[i].interval);
                }

                if(k == true){
                    config.ele.style[config.jsonMap[i].style] = config.jsonMap[i].val + config.jsonMap[i].px;
                }
            }

            return self;
        },
        /*
         * 延迟队列
         */
        delay:function(time){
            this.config.delay = time;
            return this;
        },

        /*
         * 级联调用，貌似现在还不太好用
         */
        animate:function(jsonMap, time, callBack){
            //this.delay(null);
            return this.init(this.config.ele, jsonMap, time, callBack);
        }
    }

    win[space] = Animate;

})("animate", window);
