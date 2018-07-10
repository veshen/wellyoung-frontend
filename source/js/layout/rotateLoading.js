/**
 * Created by wangwei on 2017/7.
 */
require('../../css/layout/rotateLoading.scss');
var loading={
    data(){
        return {

        }
    },
    ready() {
        this.loading_box();
    },
    loading_box(){
        //init
        let rotateLoading=document.createElement('div');
        rotateLoading.className="rotateLoading-inner";
        rotateLoading.innerHTML = "<div class='load-container load6'><div class='loader'>Loading...</div></div>"
        document.body.appendChild(rotateLoading);
    },
    loading_hide(){
        "use strict";
        var rotateLoadingBox = document.querySelector('.rotateLoading-inner');
        if (rotateLoadingBox) {
            this.removeElement(rotateLoadingBox);
        }
    },
    removeElement(_element){
        var _parentElement = _element.parentNode;
        if(_parentElement){
            _parentElement.removeChild(_element);
        }
    }
};
module.exports=loading;
