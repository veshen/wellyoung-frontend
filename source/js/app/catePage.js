import React, {Component} from 'react';
import ReactDom from 'react-dom';
import '../../css/app/catePage.scss';

require('../modules/global.js');

let loading             = require('../layout/loading.js');
let sgMethods           = require('../modules/sgMethods.js');
let Toast               = require('../layout/toast.js');
let api                 = require('../modules/api.js');

import Header from '../layout/header';
import FootNav from '../layout/footNav';
import Wait from '../layout/wait';
import CartPop from '../layout/cartPop';

const PageIntro = (props)=>{
    return (
        <div className='pageIntro'>
            <div className='title'>
                <div className='slogan'>WELL YOUNG</div>
                <div className='txt flex'>
                    <div className='orna'></div>
                    <div className=''>{props.title}</div>
                    <div className='orna'></div>
                </div>
            </div>
            <div className='desc'>{props.desc}</div>
        </div>
    )
}

const DoubColList = (props)=> {
    const listData = props.list;
    return (
        <div className='doubCol glist'>
            <PageIntro title={props.title} desc={props.desc} />
            <div className='listWrap flex'>
                {
                    listData.map((item,index)=>{
                        return (
                            <div key={index} className='listItem'>
                                <a href={'/wellyoung/detail?productId='+item.id}><img src={item.firstImage} /></a>
                                <div className='itemName'>
                                    <b>WELL YOUNG</b>
                                    <p>{item.name}</p>
                                </div>
                                <div className='itemBuy flex'>
                                    <div className='itemPrice'>&yen;{item.displayPrice}</div>
                                    <div className='itemAddCart icon-cart' onClick={()=>{props.showCartPop(item)}}></div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const DoubColListTc = (props)=> {
    const listData = props.list;
    return (
        <div className='doubColTc glist'>
            <PageIntro title={props.title} desc={props.desc} />
            <div className='listWrap flex'>
                {
                    listData.map((item,index)=>{
                        return (
                            <div key={index} className='listItem'>
                                <a href={'/wellyoung/detail?productId='+item.id}>
                                    <img src={item.firstImage} />
                                    <div className='itemName'>
                                        <b>WELL YOUNG<br/>定 · 制<br/>-</b>
                                        <p>{item.name}</p>
                                    </div>
                                    <div className='itemBuy'>
                                        <div className='itemPrice'>&yen;{item.displayPrice}</div>
                                    </div>
                                </a>

                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const SingleColListCross = (props)=> {
    const listData = props.list;
    return (
        <div className='singleColCross glist'>
            <PageIntro title={props.title} desc={props.desc} />
            <div className='listWrap'>
                {
                    listData.map((item,index)=>{
                        return (
                            <div key={index} className={index%2===0?'listItem flex':'listItem flex flex-reverse'}>
                                <a href={'/wellyoung/detail?productId='+item.id}><img src={item.firstImage} /></a>
                                <div className='itemInfo flex'>
                                    <div className='shopLogo'>WELL YOUNG</div>
                                    <div className='itemName'>{item.name}</div>
                                    <div className='itemPrice'>&yen;{item.displayPrice}</div>
                                    <div className='itemBuy flex'>
                                        <div className='itemToShop'>SHOP</div>
                                        <div className='itemAddCart icon-cart' onClick={()=>{props.showCartPop(item)}}></div>
                                    </div>
                                </div>
                            </div>
                        )

                    })
                }
            </div>
        </div>
    )
}

const SingleColListFull = (props)=> {
    const listData = props.list;
    return (
        <div className='singleColFull glist'>
            <PageIntro title={props.title} desc={props.desc} />
            <div className='listWrap'>
                {
                    listData.map((item,index)=>{
                        return (
                            <div key={index} className='listItem'>
                                <a href={'/wellyoung/detail?productId='+item.id}><img src={item.firstImage} /></a>
                                <div className='itemName'>
                                    <b>WELL YOUNG</b>
                                    <p>{item.name}</p>
                                </div>
                                <div className='itemAbstract'>{item.summary}</div>
                                <div className='itemBuy flex'>
                                    <div className='itemPrice'>&yen;{item.displayPrice}</div>
                                    <div className='itemAddCart' onClick={()=>{props.showCartPop(item)}}>加入购物车</div>
                                </div>

                            </div>
                        )

                    })
                }
            </div>
        </div>
    )
}

class CatePage extends Component {
    constructor(props){
        super(props);
        this.state = {
            pageData:props.data.category,
            listData:props.data.category.flowers,
            selectItem:{},
            cartShow:false
        }
    }
    showCartPop(res){
        this.setState({
            selectItem:res,
            cartShow:true
        })
    }
    closeCartPop(){
        this.setState({
            selectItem:{},
            cartShow:false
        })
    }
    render(){
        const {pageData,listData,cartShow,selectItem} = this.state;
        let list;
        switch (pageData.style) {
            case 'two-column':
                list = (
                    <DoubColList
                        title = {pageData.name}
                        desc = {pageData.description}
                        list = {listData}
                        showCartPop = {this.showCartPop.bind(this)}
                    />
                )
                break;
            case 'two-column-custom':
                list = (
                    <DoubColListTc
                        title = {pageData.name}
                        desc = {pageData.description}
                        list = {listData}
                        showCartPop = {this.showCartPop.bind(this)}
                    />
                )
                break;
            case 'around':
                list = (
                    <SingleColListCross
                        title = {pageData.name}
                        desc = {pageData.description}
                        list = {listData}
                        showCartPop = {this.showCartPop.bind(this)}
                    />
                )
                break;
            case 'one-column':
                list = (
                    <SingleColListFull
                        title = {pageData.name}
                        desc = {pageData.description}
                        list = {listData}
                        showCartPop = {this.showCartPop.bind(this)}
                    />
                )
                break;
            default:
                list = (
                    <DoubColList
                        title = {pageData.name}
                        desc = {pageData.description}
                        list = {listData}
                        showCartPop = {this.showCartPop.bind(this)}
                    />
                )
                break;
        }
        let body;
        if(pageData.flowers.length>0){
            body = (
                <div>
                    <div className='banner'><img src={pageData.first_image} /></div>
                    {list}
                    <CartPop show={cartShow} close={this.closeCartPop.bind(this)} data={selectItem} />
                </div>
            )
        }else {
            body = <Wait />
        }
        return (
            <div className='catePage'>
                <Header />
                {body}
                <FootNav />
            </div>
        )
    }
}

window.onload = async function(){
    try{
        sgMethods.initMain();
        let cateId = sgMethods.urlParmKey('cateId');
        const data = await api.getCatePage({cateId});
        updataRender(data);
        // const login = await api.login({name:'test',password:'secret'});
        // console.log(login);
    }catch(e){

    }

}

function updataRender(res) {
    let _main = document.querySelector('.main');
    loading.loading_hide();
    if (document.querySelector('.loadingBox')) {
        document.querySelector('.loadingBox').innerHTML = '';
    }
    ReactDom.render(
        <CatePage data={res} />, _main);
}
