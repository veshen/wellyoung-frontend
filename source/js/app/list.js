import React, {Component} from 'react';
import ReactDom from 'react-dom';
import '../../css/app/list.scss';
import '../../css/global/animate.css';

require('../modules/global.js');

let loading             = require('../layout/loading.js');
let sgMethods           = require('../modules/sgMethods.js');
let api                 = require('../modules/api.js');

import Header from '../layout/header';
import FootNav from '../layout/footNav';
import CartPop from '../layout/cartPop';

class List extends Component {
    constructor(props) {
        super(props);
    }
    render(){
        let listData = this.props.data;
        return(

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
                                    <div className='itemAddCart icon-cart' onClick={()=>{this.props.showCartPop(item)}}></div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

        )
    }

}

class AllList extends Component {
    constructor(props){
        super(props);
        this.state = {
            listData:[],
            sortType:'',  //newest,price,sales
            sortDir:'',  //desc,asc
            num:6,
            scrollLoad:true,
            beforeScroll:0,
            pn:1,
            hasNext:true,
            selectItem:{},
            cartShow:false
        };
    }
    componentWillMount(){
        this.getListData(1,6);
        loading.loading_hide();
        if (document.querySelector('.loadingBox')) {
            document.querySelector('.loadingBox').innerHTML = '';
        }
    }
    componentDidMount(){

        window.addEventListener('scroll', ()=>{
            let {hasNext,pn,num,sortType,scrollLoad,beforeScroll,sortDir} = this.state;
            let scrollTop = document.documentElement.scrollTop;
            let scroll_dir = scrollTop - beforeScroll;
            let scrollToBottom = document.body.clientHeight-document.documentElement.clientHeight-scrollTop;

            beforeScroll = scrollTop;
            this.setState({beforeScroll});

            if(scrollToBottom < 200 && scrollLoad && scroll_dir > 0 && hasNext){
                this.setState({
                    scrollLoad:false
                });
                this.getListData(pn,num,sortType,sortDir);
            }

        });

        // window.addEventListener('pagehide',()=>{
        //     sessionStorage.setItem('listCache',JSON.stringify(this.state));
        //     sessionStorage.setItem('sc',window.scrollTop);
        // })
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
    sortList(type){
        let {num,sortType,sortDir} = this.state;
        if(type==sortType){
          sortDir = sortDir=='asc'?'desc':'asc';
        }else {
          sortType = type;
          sortDir = 'asc';
        }
        this.setState({
            pn:1,
            sortType,
            sortDir,
            listData:[]
        });
        this.getListData(1,num,sortType,sortDir);
    }
    async getListData(pn,num,sortType,sortDir){
        try{
            const listData = await api.getAllList({
                page:pn,
                perPage:num,
                orderBy:sortType,
                dir:sortDir
            });
            const originList = this.state.listData;
            let ldt;
            if(listData.details.length>0){
              this.setState({
                  listData:[...originList,...(listData.details)],
                  sortType,
                  num,
                  pn:++pn,
                  scrollLoad:true,
                  hasNext:listData.pager.hasPages
              });
            }
        }catch(e){

        }

    }
    render(){
        let {listData,selectItem,cartShow,sortType,sortDir} = this.state;
        return(
            <div className='allList'>
                <Header />
                <div className='sort-bar flex'>
                    <div className='sort-item flex' onClick={()=>{this.sortList('')}}>全部商品</div>
                    <div className={sortType=='sales'?'sort-item cur flex':'sort-item flex'} onClick={()=>{this.sortList('sales')}}>销量
                        <p className='flex'>
                            <i className={sortType=='sales'&&sortDir=='asc'?'uper cur':'uper'}></i>
                            <i className={sortType=='sales'&&sortDir=='desc'?'down cur':'down'}></i>
                        </p>
                    </div>
                    <div className={sortType=='newest'?'sort-item cur flex':'sort-item flex'} onClick={()=>{this.sortList('newest')}}>新品
                        <p className='flex'>
                            <i className={sortType=='newest'&&sortDir=='asc'?'uper cur':'uper'}></i>
                            <i className={sortType=='newest'&&sortDir=='desc'?'down cur':'down'}></i>
                        </p>
                    </div>
                    <div className={sortType=='price'?'sort-item cur flex':'sort-item flex'} onClick={()=>{this.sortList('price')}}>价格
                        <p className='flex'>
                            <i className={sortType=='price'&&sortDir=='asc'?'uper cur':'uper'}></i>
                            <i className={sortType=='price'&&sortDir=='desc'?'down cur':'down'}></i>
                        </p>
                    </div>
                </div>
                <div className='doubCol glist'>
                    <List data={listData} showCartPop = {this.showCartPop.bind(this)} />
                </div>
                <CartPop show={cartShow} close={this.closeCartPop.bind(this)} data={selectItem} />
                <FootNav />
            </div>
        )
    }
}

window.onload = async function(){
    try{
        updataRender();
    }catch(e){}

}

function updataRender(res) {
    sgMethods.initMain();
    let _main = document.querySelector('.main');

    ReactDom.render(
        <AllList />, _main);
}
