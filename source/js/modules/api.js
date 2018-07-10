
import 'whatwg-fetch';
//base

var baseUrl;
var sger;
var type = location.hostname
console.log(type)
switch(type){
    case 'localhost':
    baseUrl = 'http://preview.wellyoung.top/';
    sger = '_=' + new Date().getTime();
    break;
    default:
    baseUrl = '/';
    sger = '_=' + new Date().getTime();
}


var url={
    /*  wellyong  */
    //首页
    'getHomeData':'home',
    // 获取分类列表
    'getCates':'category',
    // 分类详情页
    'getCatePage':'category/{cateId}',
    // 所有商品列表
    'getAllList':'all',
    //获取商品详情
    'getProductDetail' : 'flower/{productId}',
    //添加购物车
    'addCart' : 'cart/add',
    //登录
    'login' : 'login',
    //获取购物车列表
    'getCartList':'cart',
    //更新购物车
    'updateCart' : 'cart/update',
    //删除购物车商品
    'delCart' : 'cart/delete',
    //address
    'getAddressAll' : 'address',
    //添加地址
    'addAddress' : 'address/create',
    //修改地址
    'updataAddress' : 'address/{addressId}/update',
    //获取地址详细信息
    'getAddressInfo' : 'address/{addressId}',
    //删除地址
    'removeAddress': 'address/{addressId}/delete',
    //购买
    'getOrdreBuy' : 'order/buy',
    //创建订单
    'createOrderWellyoung':'order/create',
    //最近订单
    'getOrderRecent':'order/recent',
    'wechatConfig': 'weixin/info',//微信config
    //订单详情
    'orderDetail': 'order/{orderId}',
    //取消订单
    'cancelOrder':'order/{orderId}/cancel',
    //提交发票
    'pushInvoice' : 'order/{orderId}/invoice',
    //积分明细
    'getPointlogs':'user/pointlogs',
    //获取用户订单
    'getUserOrder':'order'
};


//obj
var api={};
/* well yong start */
// 首页内容
api.getHomeData = function(){
    return _get(baseUrl+url.getHomeData);
}

// 获取分类列表
api.getCates = function(){
    return _get(baseUrl+url.getCates);
}

// 获取分类页数据
api.getCatePage = function(urlParm){
    let _url=_urlMixPram(urlParm,url.getCatePage);
    return _get(baseUrl+_url);
}

// 获取所有商品
api.getAllList = function(data){
    let _url = markUrl(url.getAllList,data);
    return _get(baseUrl+_url);
}

//积分明细
api.getPointlogs=function(data){
    let _url = markUrl(url.getPointlogs,data);
    return _get(baseUrl+_url);
};

//获取用户订单
api.getUserOrderList=function(data){
    let _url = markUrl(url.getUserOrder,data);
    return _get(baseUrl+_url);
};

//取消未支付订单
api.pushInvoice=function(urlParm,data){
    let _url=_urlMixPram(urlParm,url.pushInvoice);
    return _post(baseUrl+_url,data);
};

//取消未支付订单
api.cancelOrder=function(urlParm,data){
    let _url=_urlMixPram(urlParm,url.cancelOrder);
    return _post(baseUrl+_url,data);
};

//订单详情
api.getOrderDetail=function(urlParm){
    let _url=_urlMixPram(urlParm,url.orderDetail);
    return _get(baseUrl+_url);
};

//获取WechatConfig
api.getWechatConfig=function(){
    return _get(baseUrl+url.wechatConfig);
};

//获取地址详细信息
api.getOrderRecent=function(){
    return _get(baseUrl+url.getOrderRecent);
};
//创建订单
api.createOrderWellyoung=function(data){
    return _post(baseUrl+url.createOrderWellyoung,data);
};
//购买
api.getOrdreBuy=function(data){
    return _post(baseUrl+url.getOrdreBuy,data);
};

//删除地址
api.removeAddress=function(data){
    let _url=_urlMixPram(data,url.removeAddress);
    return _post(baseUrl+_url);
};


//获取地址详细信息
api.getAddressInfo=function(data){
    let _url=_urlMixPram(data,url.getAddressInfo);
    return _get(baseUrl+_url);
};

//修改地址
api.updataAddress = function(parame,data){
    let _url=_urlMixPram(parame,url.updataAddress);
    return _post(baseUrl+_url,data);
}

//添加地址
api.addAddress=function(data){
    return _post(baseUrl+url.addAddress,data);
};

//address
api.getAddressAll=function(){
    return _get(baseUrl+url.getAddressAll);
};

//删除购物车商品
api.delCart=function(data){
    return _post(baseUrl+url.delCart,data);
};

//更新购物车
api.updateCart=function(data){
    return _post(baseUrl+url.updateCart,data);
};

//获取购物车列表
api.getCartList = function(){
    return _get(baseUrl+url.getCartList);
}

//获取商品详情
api.getProductDetail = function(data){
    let _url=_urlMixPram(data,url.getProductDetail);
    return _get(baseUrl+_url);
}

//添加购物车
api.addCart=function(data){
    return _post(baseUrl+url.addCart,data);
};

//登录
api.login=function(data){
    return _post(baseUrl+url.login,data);
};
/* end */

function markUrl(link,data){
    if (typeof data != "undefined" && data != "") {
        var paramArr = [];
        for (var attr in  data) {
            paramArr.push(attr + '=' +  data[attr]);
        }
        link += '?' + paramArr.join('&');
    }
    return link;
}

//function
function _urlMixPram(parm,url){
    let _url=url;
    for(let i in parm){
        _url=_url.replace('{'+i+'}',parm[i]);
    }
    return _url;
}

function _get(url){
    let _parameter={};
    _parameter.headers={
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };
    _parameter.method='GET';
    _parameter.credentials='include';

    let _url='';
    if(url.search(/\?/)>=0){
        _url=url+'&'+sger;
    }else{
        _url=url+'?'+sger;
    }

    return fetch(_url,_parameter).then((res)=>{
        "use strict";
        if (res.status >= 200 && res.status < 300) {
            console.log(res,'_get');
            return res.json();
        }
    },()=>{
        "use strict";
        console.log(url+'请求失败','_get');
    }).then((res)=>{
        if(res){
            return res.data||res
        }else{
            return Promise.reject(new Error(url+'请求失败'))
        }
    })

}

function _post(url,data){
    let _parameter={};
    _parameter.headers={
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };
    _parameter.method='POST';
    _parameter.credentials='include';
    _parameter.body=JSON.stringify(data);

    let _url='';
    if(url.search(/\?/)>=0){
        _url=url+'&'+sger;
    }else{
        _url=url+'?'+sger;
    }

    return fetch(_url,_parameter).then((res)=>{
        "use strict";
        if (res.status >= 200 && res.status < 300) {
            return res.json();
        }else{
            return res;
        }
    },()=>{
        "use strict";
        console.log(url+'请求失败','_post');
    }).then((res)=>{
        if(res){
            if(res.data){
                return res.data
            }else{
                return res
            }
        }else{
            return Promise.reject(new Error(url+'请求失败'))
        }

    });
}
//exports
module.exports=api;
