/**
 * Created by wangwei on 2017/6/22.
 */
require('../../css/layout/indexDiaLogMark.scss');
var loading={
    data(){
        return {

        }
    },
    ready(res,callback,getCoupon) {
        this.loading_box(res,callback,getCoupon);
    },
    loading_box(res,callback,getCoupon){
        //init
        let This = this;
        let diaLog=document.createElement('div');
        diaLog.className="diaLog-inner";
        diaLog.innerHTML = "<div class='diaLog-container'><img class='picOffBtn' src='https://resource.sa-green.cn/image/active/%E5%BC%80%E5%B1%8F%E5%BC%B9%E7%AA%97%E5%85%B3%E9%97%AD%E6%8C%89%E9%92%AE.png'/>"+res.content+"</div>"
        document.body.appendChild(diaLog);
        var diaLogInner = document.querySelector('.diaLog-container');
        var aDom = diaLogInner.querySelectorAll("a");
        for (var i = 0; i < aDom.length; i++) {
            let _url=aDom[i].getAttribute('data-href');
            let trackValue=aDom[i].getAttribute('data-track');
            let dataActiveName=aDom[i].getAttribute('data-activity-name');
            if (trackValue) {
                sa.track('announcementView', {
                    "view": trackValue,
                });
            }
            if (dataActiveName) {
                getCoupon({"activityName":dataActiveName});
            }
            aDom[i].onclick = function(){
                if (trackValue) {
                    sa.track('announcementClick', {
                        "click": trackValue,
                    });
                }
                callback(res.notificationId,_url);
                This.loading_hide();
            }
        }
        document.querySelector(".diaLog-inner").onclick = function(){
            This.loading_hide();
            callback(res.notificationId,false);
        };
    },
    loading_hide(){
        "use strict";
        var diaLog = document.querySelector('.diaLog-inner');
        if (diaLog) {
            this.removeElement(diaLog);
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
