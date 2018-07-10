/**
 * Created by wangwei on 2017/7.
 */
require('../../css/layout/diaLogConfirm.scss');
var diaLogConfirm={
    data(){
        return {

        }
    },
    ready(text,clickType) {
        return this.loading_box(text,clickType);
    },
    loading_box(text,clickType){
        var This = this;
        return new Promise((resolve,reject)=>{
            //init
            let diaLogConfirm=document.createElement('div');
            diaLogConfirm.className="diaLogConfirm-inner";
            diaLogConfirm.innerHTML =
                `<div class='diaLogConfirm-container'>
                    <div class='content-text'>${text}</div>
                    <div class='btnBox'>
                        <a class='cancelBtn'>取消</a>
                        <a class='confirmBtn'>确认</a>
                    </div>
                </div>`
            document.body.appendChild(diaLogConfirm);
            var diaLogInner = document.querySelector('.diaLogConfirm-inner');
            var cancelBtn = diaLogInner.querySelector(".cancelBtn");
            var confirmBtn = diaLogInner.querySelector(".confirmBtn");
            if (clickType) {
                cancelBtn.onclick = function(){
                    resolve(false);
                    This.loading_hide();
                }
                confirmBtn.onclick = function(){
                    resolve(true);
                    This.loading_hide();
                }
                diaLogInner.onclick = function(){
                    resolve(false);
                    This.loading_hide();
                }
            }else{
                cancelBtn.addEventListener("touchstart",function(){
                    resolve(false);
                    This.loading_hide();
                });
                confirmBtn.addEventListener("touchstart",function(){
                    resolve(true);
                    This.loading_hide();
                });
                diaLogInner.addEventListener("touchstart",function(){
                    resolve(false);
                    This.loading_hide();
                });
            }

        })

    },
    loading_hide(){
        "use strict";
        var diaLogConfirm = document.querySelector('.diaLogConfirm-inner');
        if (diaLogConfirm) {
            this.removeElement(diaLogConfirm);
        }
    },
    removeElement(_element){
        var _parentElement = _element.parentNode;
        if(_parentElement){
            _parentElement.removeChild(_element);
        }
    }
};
module.exports=diaLogConfirm;
