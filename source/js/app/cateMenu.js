import React, {Component} from 'react';
import ReactDom from 'react-dom';
import '../../css/app/cateMenu.scss';
import '../../css/global/animate.css';

require('../modules/global.js');

let loading             = require('../layout/loading.js');
let sgMethods           = require('../modules/sgMethods.js');
let api                 = require('../modules/api.js');

import Header from '../layout/header';
import FootNav from '../layout/footNav';

const CateMenu = (props)=>{
    const cates = props.data;
    return (
        <div className='cateMenu'>
            <Header />
            <div className='cateList'>
                <div className='cateTitle flex'>
                    <p>CATEGORIES</p>
                    <p>分 类</p>
                </div>
                {
                    cates.map((item,index)=>{
                        return (
                            <div key={index} className='cateItem'>
                                <a href={'/wellyoung/catePage?cateId='+item.id}>{index+1}.{item.name}</a>
                            </div>
                        )
                    })
                }
            </div>
            <FootNav role='cate' />
        </div>

    )
}

window.onload = async function(){
    try{
        const data = await api.getCates();
        updataRender(data);
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
        <CateMenu data={res} />, _main);
}
