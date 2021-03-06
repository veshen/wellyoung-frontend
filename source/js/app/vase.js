import React, {Component} from 'react';
import ReactDom from 'react-dom';
import '../../css/app/vase.scss';

require('../modules/global.js');

let loading             = require('../layout/loading.js');
let rotateLoading       = require('../layout/rotateLoading.js');
let sgMethods           = require('../modules/sgMethods.js');
let LS                  = require('../modules/localstorage.js');
let Toast               = require('../layout/toast.js');
let api                 = require('../modules/api.js');

import Header from '../layout/header';
import FootNav from '../layout/footNav';
import Wait from '../layout/wait';
import PageIntro from '../layout/pageIntro';

class Vase extends Component {
    constructor(props){
        super(props);
        this.listData = [
            {
                img:'',
                name:'商品名称xxxxxxxxxxxxxxxxx',
                url:'',
                price:'188'
            },
            {
                img:'',
                name:'商品名称xxxxxxxxxxxxxxxxx',
                url:'',
                price:'188'
            },
            {
                img:'',
                name:'商品名称xxxxxxxxxxxxxxxxx',
                url:'',
                price:'188'
            },
            {
                img:'',
                name:'商品名称xxxxxxxxxxxxxxxxx',
                url:'',
                price:'188'
            },
            {
                img:'',
                name:'商品名称xxxxxxxxxxxxxxxxx',
                url:'',
                price:'188'
            }
        ]
    }
    render(){
        const listData = this.listData;
        return (
            <div className='vase'>
                <Header />
                <div className='banner'><img src='' /></div>
                <div className='glist'>
                    <PageIntro title='未央花器' desc='简介包涵一小段简介；一张图片（图片自动获取主题花束页最新上架的产品的图片）' />
                    <div className='listWrap'>
                        {
                            listData.map((item,index)=>{
                                if(index%2===0){
                                    return (
                                        <div key={index} className='listItem flex'>
                                            <a href={item.url}><img src={item.img} /></a>
                                            <div className='itemInfo flex'>
                                                <div className='shopLogo'>WELL YOUNG</div>
                                                <div className='itemName'>{item.name}</div>
                                                <div className='itemPrice'>&yen;{item.price}</div>
                                                <div className='itemBuy flex'>
                                                    <div className='itemToShop'>SHOP</div>
                                                    <div className='itemAddCart'></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }else {
                                    return (
                                        <div key={index} className='listItem flex'>
                                            <div className='itemInfo flex'>
                                                <div className='shopLogo'>WELL YOUNG</div>
                                                <div className='itemName'>{item.name}</div>
                                                <div className='itemPrice'>&yen;{item.price}</div>
                                                <div className='itemBuy flex'>
                                                    <div className='itemToShop'>SHOP</div>
                                                    <div className='itemAddCart'></div>
                                                </div>
                                            </div>
                                            <a href={item.url}><img src={item.img} /></a>
                                        </div>
                                    )
                                }

                            })
                        }
                    </div>
                </div>
                <FootNav />
            </div>
        )
    }
}

window.onload = function(){
    updataRender();
}

function updataRender(res) {
    sgMethods.initMain();
    let _main = document.querySelector('.main');
    loading.loading_hide();
    if (document.querySelector('.loadingBox')) {
        document.querySelector('.loadingBox').innerHTML = '';
    }
    ReactDom.render(
        <Vase />, _main);
}
