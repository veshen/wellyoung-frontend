import React, {Component} from 'react';
import ReactDom from 'react-dom';
import '../../css/app/index.scss';

require('../modules/global.js');
require('../../css/global/animate.css');
require('../../css/global/swiper-4.2.0.min.css');

let loading             = require('../layout/loading.js');
let rotateLoading       = require('../layout/rotateLoading.js');
let sgMethods           = require('../modules/sgMethods.js');
let LS                  = require('../modules/localstorage.js');
let Swiper              = require('../modules/swiper-4.2.0.min');
let Toast               = require('../layout/toast.js');
let api                 = require('../modules/api.js');

import Header from '../layout/header';
import SwiperBanner from '../layout/swiperBanner';
import FootNav from '../layout/footNav';

const IndexModel = (props)=>{
    let data = props.data;
    if(data.newest_flower){
        return (
            <div className='indexModel'>
                <a href={'/wellyoung/detail?productId='+data.newest_flower.id}>
                    <img src={data.newest_flower.firstImage} />
                </a>
                <p className='wly'>WELL YOUNG</p>
                <p className='modelName'>{data.name}</p>
                <p className='modelDesc'>{data.description}</p>
                <p className='modelPrice'>{data.newest_flower.displayPrice||0}.00 起</p>
                <a href={'/wellyoung/catePage?cateId='+data.id} className='moreBtn'>了解更多</a>
            </div>
        )
    }else {
        return <div></div>
    }

}

class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
            banners:props.data.banners,
            categories:props.data.categories
        }
    }
    componentWillMount() {
        loading.loading_hide()
        if (document.querySelector('.loadingBox')) {
            document.querySelector('.loadingBox').innerHTML = '';
        }
    }
    render(){
        const banners = this.state.banners;
        const models = this.state.categories;
        const cates = [...models];
        if(cates.length<8){
            const holder = {
                name:'敬请期待'
            }
            for(let i=cates.length;i<8;i++){
                cates.push(holder);
            }
        }
        console.log(models,cates);
        return(
            <div className='index'>
                <Header/>
                <SwiperBanner data={banners}/>
                <div className='menu flex'>
                {
                    cates.map((item,index)=>{
                        return(
                            <div key={index} className='menuItem'>
                                <a href={item.id?'/wellyoung/catePage?cateId='+item.id:'javscript:void(0)'}>{item.name}</a>
                            </div>
                        )
                    })
                }
                </div>
                <div>
                {
                    models.map((item,index)=>{
                        return (
                            <IndexModel key={index} data={item} />
                        )
                    })
                }
                </div>
                <div className='bottomLinks'></div>
                <FootNav role='home' />
            </div>
        )

    }
}

window.onload = async function(){
    try{
        const data = await api.getHomeData();
        updataRender(data);
        let _share = {
              title: 'WellYoung未央花房', // 分享标题
              desc: 'Live Well Stay Young', // 分享描述
              link: location.href, // 分享链接
              imgUrl: 'https://resource.sa-green.cn/image/jpg/WechatIMG238.jpeg', // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
          };
        sgMethods.wxShare(_share);
    }catch(e){}
}

function updataRender(res) {
    sgMethods.initMain();
    let _main = document.querySelector('.main');
    loading.loading_hide();
    if (document.querySelector('.loadingBox')) {
        document.querySelector('.loadingBox').innerHTML = '';
    }
    ReactDom.render(
        <Index data={res} />, _main);
}
