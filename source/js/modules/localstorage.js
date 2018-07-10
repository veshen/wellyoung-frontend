var localstorage={};

localstorage.version=20180417;
localstorage.cartVersion=20180417;

localstorage.init=function(){
  //localstroage version 控制
  console.log('LS init');
  console.log('LS version:'+localstorage.version);
  console.log('LS cartVersion:'+localstorage.cartVersion);
  if(window.localStorage.version!=localstorage.version){
    this.clear();
    window.location.reload();
  }
  if(window.localStorage.cartVersion!=localstorage.cartVersion){
    window.localStorage.cartVersion=localstorage.cartVersion;
    this.removeItem('cartdata');
    window.location.reload();
  }
};

localstorage.clear=function(callback){
  console.log('LS clear');
  window.localStorage.clear();
  window.localStorage.version=localstorage.version;
  if(typeof callback=='function'){
    callback();
    window.location.reload();
  }
};

localstorage.setItem=function(key,val){
  "use strict";
  return window.localStorage.setItem(key,val);
};
localstorage.getItem=function(key){
  "use strict";
  return window.localStorage.getItem(key);
};
localstorage.getItemOnce=function(key){
  "use strict";
  let val=window.localStorage.getItem(key);
  this.removeItem(key);
  return val;
};
localstorage.removeItem=function(key){
  "use strict";
  return window.localStorage.removeItem(key);
};



module.exports=localstorage;
