/**
 * Created by Administrator on 2016/12/4.
 * global modules
 */
//window.$=window.jQuery=require('jquery');
require('./rem.js');

window.onload=(function(){

    Array.prototype.remove = function(obj) {
        for (var i = 0; i < this.length; i++) {
            var temp = this[i];
            if (!isNaN(obj)) {
                temp = i;
            }
            if (temp == obj) {
                for (var j = i; j < this.length; j++) {
                    this[j] = this[j + 1];
                }
                this.length = this.length - 1;
            }
        }
    }
})();
