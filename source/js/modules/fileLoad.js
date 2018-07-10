/**
 * Created by peiyuanwu_sagreen on 2016/12/16.
 */
var fileLoad={};
fileLoad.progress=0;

fileLoad.loading=function(arr,callback){
    callback(this.progress);
    this.itemLoading(arr,0,arr.length-1,callback);
};

fileLoad.itemLoading=function(item,index,len,callback){
    let _file='';
    item.type='';
    if(item[index].match('.gif')||item[index].match('.png')||item[index].match('.jpg')||item[index].match('.jpeg')){
        item.type='image'
    }
    switch (item.type){
        case 'image':
             _file=new Image();
            break;
    }
    _file.src=item[index];
    _file.onload=function(){
        console.log('Loading '+_file.src+' ok');
        fileLoad.progress=(((index+1)/(len+1))*100).toFixed(2);
        if(index<len){
            index++;
            setTimeout(function(){
                fileLoad.itemLoading(item,index,len,callback)
            },200)
        }
        callback(fileLoad.progress);
    };


};

module.exports=fileLoad;