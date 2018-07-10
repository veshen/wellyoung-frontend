import wx from 'weixin-js-sdk';
let api=require('../modules/api.js');
var methods={};

methods.initMain=function(){
  let main=document.createElement('div');
  main.className='main';
  document.body.appendChild(main);
};

//fetch
methods.get=function(url){
  let _parameter={};
  _parameter.headers={
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  _parameter.method='GET';
  _parameter.credentials='include';


  return fetch(url,_parameter).then((res)=>{
    "use strict";
    if (res.status >= 200 && res.status < 300) {
      return res.json();
    }
  },()=>{
    "use strict";
    console.log(url+'请求失败');
  }).then((res)=>{
    if(res){
      return res.data
    }else{
      return Promise.reject(new Error(url+'请求失败'))
    }
  })

}

methods.post=function(url,data){
  let _parameter={};
  _parameter.headers={
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  _parameter.method='POST';
  _parameter.credentials='include';
  _parameter.body=JSON.stringify(data);

  return fetch(url,_parameter).then((res)=>{
    "use strict";
    if (res.status >= 200 && res.status < 300) {
      return res.json();
    }
  },()=>{
    "use strict";
    console.log(url+'请求失败');
  }).then((res)=>{
    if(res){
      return res.data
    }else{
      return Promise.reject(new Error(url+'请求失败'))
    }

  });
}

//touch事件滚动触发fix
methods.touchClick=function(eventStart,callback){
  "use strict";
  let sTime=eventStart.timeStamp;
  if(eventStart.target){
    eventStart.target.addEventListener('touchend',function(e){
      let eTime=e.timeStamp;
      if(eTime-sTime<150&&Math.abs(e.changedTouches[0].screenY-eventStart.touches[0].screenY)<50){
        if(typeof callback=='function'){
          callback();
        }
      }
    });
  }else{
    callback();
  }
};

//滚动禁止开关
methods.scrollSwitch=function(bool,callback){
  "use strict";
  if(!bool){
    document.querySelector('html').style.height='100%';
    document.querySelector('html').style.overflow='hidden';
    document.body.style.height='100%';
    document.body.style.overflow='hidden';
  }else{
    document.querySelector('html').style.height='';
    document.querySelector('html').style.overflow='';
    document.body.style.height='';
    document.body.style.overflow='';
  }
  if(typeof callback=='function'){
    callback();
  }
};

//微信分享
methods.wxShare=function(share){

  api.getWechatConfig()
  .then((res)=>{
      if(!share&&res.share){
        share={
          title: res.share.title, // 分享标题
          desc: res.share.summary, // 分享描述
          link: res.share.link, // 分享链接
          imgUrl: res.share.icon, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
            // 用户确认分享后执行的回调函数
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        };
      }


    let configInfo={
      debug: false,
      appId: res.jssdk.appId,
      timestamp: res.jssdk.timestamp,
      nonceStr: res.jssdk.nonceStr,
      signature: res.jssdk.signature,
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'chooseWXPay',
        'getLocation'
      ]
    };
    console.log(configInfo)
    this.wxShareInfo(configInfo,share);
  });

};

methods.wxShareInfo=function(configInfo,share){
  wx.config({
    debug: false,
    appId: configInfo.appId,
    timestamp: configInfo.timestamp,
    nonceStr: configInfo.nonceStr,
    signature: configInfo.signature,
    jsApiList: [
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'onMenuShareQZone',
      'chooseWXPay',
      'getLocation'
    ]
  });
  wx.ready(function () {
    let _share=share||{};
    let _shareTimeLine={};
    let _shareAppMessage={};
    for(let i in _share){
      _shareTimeLine[i]=_share[i];
      _shareAppMessage[i]=_share[i];
    }
    _shareTimeLine.success=function(){
      _share.success();
      console.log('分享到朋友圈');
    };
    _shareAppMessage.success=function(){
      _share.success();
      console.log('发送给朋友');
    };
    wx.onMenuShareTimeline(_shareTimeLine);
    wx.onMenuShareAppMessage(_shareAppMessage);
    //获取location
    wx.getLocation({
      type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        var speed = res.speed; // 速度，以米/每秒计
        var accuracy = res.accuracy; // 位置精度
        methods.location={
          latitude:latitude,
          longitude:longitude,
          speed:speed,
          accuracy:accuracy
        };
      }
    });
  });
  wx.error(function(res){
    console.log(res)
  });

};

//location
methods.wxConfig=false;
methods.location={
    latitude:0,
    longitude:0,
  //latitude:31.230416,
  //longitude:121.473701,
  //latitude:31.150904,//
  //longitude:121.367648,
  siteId:''
};
methods.locationTimeCheck=0;
//setTimeout(()=>{
//  methods.location={
//    latitude:31.210353,
//    longitude:121.423944
//  };
//},100);

//定位获取
methods.getLocation=function(callback){
  if(methods.location.latitude==0&&methods.location.longitude==0&&methods.locationTimeCheck<10){
    methods.location.check=methods.locationTimeCheck;
    methods.locationTime=setTimeout(function(){
      methods.locationTimeCheck++;
      methods.getLocation(callback);
    },300);
  }else{
    methods.locationTimeCheck=0;
    callback(methods.location);
  }
};


methods.getMap=function(latitude, longitude){

    console.log(longitude + ',222,' + latitude)
    var getAddr = new Promise((resolve,reject)=>{
        console.log(444)
        AMap.service('AMap.Geocoder',function(){//回调函数
           //实例化Geocoder
           console.log(333)
           var geocoder = new AMap.Geocoder({
               //city: "021"//城市，默认：“全国”
           });
           console.log(222)
           // 使用geocoder 对象完成相关功能
           //逆地理编码
           var lnglatXY=[longitude, latitude];//地图上所标点的坐标
           console.log(longitude + ',11,' + latitude)
           geocoder.getAddress(lnglatXY, function(status, result) {
               if (status === 'complete' && result.info === 'OK') {
                  //获得了有效的地址信息:

                 var  _locationName = result.regeocode.formattedAddress
                 resolve(_locationName);
                  //return _locationName

                  //即，result.regeocode.formattedAddress
               }else{
                  //获取地址失败
                  console.log('获取地址失败～');
                  reject();
               }
           });
       });

   })
   return getAddr;
}

//url参数获取
methods.urlParmGet=function(){
  return (location.search).replace('?','');
};

methods.urlParmKey=function(key){
  let arr=this.urlParmGet().split('&');
  let _format={};
  let i=0;
  arr.map((item)=>{
    let _itemArr=item.split('=');
    if(_itemArr.length>1){
      _format[_itemArr[0]]=_itemArr[1];
    }else{
      _format[i]=_itemArr[0];
      i++;
    }
  });
  if(key){
    return _format[key]
  }else{
    return _format
  }
};


//对象属性比较
methods.compare = function (propertyName) {
    return function(object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];
      if (value2 < value1) {
        return 1;
      } else if (value2 > value1) {
        return -1;
      } else {
        return 0;
      }
    }
 }

//对象拷贝
methods.deepcopy = function (obj) {
    var out = [],i = 0,len = obj.length;
    for (; i < len; i++) {
        if (obj[i] instanceof Array){
            out[i] = deepcopy(obj[i]);
        }
        else out[i] = obj[i];
    }
    return out;
}

//对象拷贝2
methods.cloneObj = function(obj){
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ?
            cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};

//判断元素ele是否含有指定class，返回布尔值
function hasClass(ele, classStr) {
    return new RegExp('(\\s|^)' + classStr + '(\\s|$)').test(ele.className);
}

methods.addClass = function(ele, classStr) {
    if(ele.className == ''){
		ele.className = classStr;
	} else if (!hasClass(ele,classStr)){
		ele.className += ' ' + classStr;
	}
}

//为元素ele删除指定class
methods.removeClass = function(ele, classStr) {
    if (hasClass(ele, classStr)) {
        if(ele.className == classStr){
	        ele.className = '';
        }else {
		    ele.className = ele.className.replace(new RegExp('(\\s|^)' + classStr + '(\\s|$)'),' ');
	    }
    }
}

methods.scrollTo = function(obj, end=0, interval=10, time=1000){
    clearInterval(obj.timer);
    var tween = {
        eain:function(t, b, c, d){ return - c * (t /= d) * (t - 2) + b}
    }
    var b = obj.scrollTop || 0;
    var val = end - b;
    var st = new Date().getTime();

    obj.timer = setInterval(function(){
        var t = new Date().getTime() - st;

        if( t > time){
            t = time;
            clearInterval(obj.timer);
        }
        obj.scrollTop = tween.eain(t, b, val, time);
    }, interval);
    return obj.timer;
}

methods.setTitle = (title) => {//ios设置titleß
   document.title = title;
   const mobile = navigator.userAgent.toLowerCase();
   console.log(mobile);
   if (!(/iphone|ipad|ipod/.test(mobile))) {
          return
        }
   console.log("in ios, updating title");
   const iframe = document.createElement('iframe');
   iframe.src = 'http://m.baidu.com/favicon.ico?_=' + new Date().getTime(); 
   const listener = () => {
          console.log("loaded event");
          setTimeout(() => {
            iframe.removeEventListener('load', listener);
            console.log("remove listener");

            setTimeout(() => {
              console.log("removeChild");
              document.body.removeChild(iframe);
            }, 0);
          }, 0);
         };
   iframe.addEventListener('load', listener);
   iframe.style.cssText = 'display: none; width: 0; height: 0;';
   document.body.appendChild(iframe);
}

function fixTouchMove(e){
  e.preventDefault();
  e.stopPropagation();
}

module.exports=methods;
