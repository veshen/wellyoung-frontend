/**
 * Created by peiyuanwu_sagreen on 2017/1/7.
 */
require('../../css/layout/loading.scss');
var loading={
    data(){
        return {

        }
    },
    ready() {
        //var body = document.body;
        //var div = document.createElement("div");
        //div.className = "loadingBox";
        //div.innerHTML = '<span class="loadingShadow"></span><div class="loadingIcon icon-loading-1"></div>';
        //body.appendChild(div);
        this.loading_box();
    },
    loading_box(){
        //init
        var icon=document.getElementsByClassName('loadingIcon');
        var index=0;
        var _className='loadingIcon icon-loading-'+(index+1);
        clearInterval(window.loadingTime);
        window.loadingTime=setInterval(function(){
            if(!icon[0]){
                clearInterval(window.loadingTime);
                return false;
            }
            icon[0].className=_className;
            index++;
            if(index>=4){
                index=0;
            }
            _className='loadingIcon icon-loading-'+(index+1);
        },400)
    },
    loading_hide(){
        "use strict";
        document.querySelector('.loadingBox').style.opacity='0';
    }
};
module.exports=loading;
