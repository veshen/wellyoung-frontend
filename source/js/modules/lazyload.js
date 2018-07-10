/**
 * Created by peiyuanwu on 16/10/26.
 */
export default {
  init(){
    console.log('lazy init');
    let _self=this;
    _self.load();
    clearInterval(this.timeCheck);
    this.timeCheck=setInterval(function(){
      _self.load();
    },300);
    setTimeout(function(){
      "use strict";
      clearInterval(_self.timeCheck);
    },30000);
    window.onscroll=function(){
      clearInterval(_self.timeCheck);
      _self.load();
    }
  },
  load(){
    console.log('lazy load');
    let imgList=document.querySelectorAll('img');
    let imgListArr=[];
    for(let i=0;i<imgList.length;i++){
      imgListArr[i]=imgList[i];
    }

    imgListArr.forEach(function(e){
      let _src=e.getAttribute('data-src');
      let src=e.getAttribute('src');
      let _height=window.innerHeight;
      if(_src&&_src!=src){
        let _pos=e.getBoundingClientRect();
        if(_pos.top-_height<0){
          e.setAttribute('src',_src);
          console.log(_src+' loading')
        }
      }
    })
  }
};
