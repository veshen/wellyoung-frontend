require('../modules/global.js');
require('../../css/app/orderList.scss');
let loading = require('../layout/loading.js');
let rotateLoading = require('../layout/rotateLoading.js');
loading.ready();
let React = require('react');
let ReactDom = require('react-dom');
let sgMethods = require('../modules/sgMethods.js');
let LS = require('../modules/localstorage.js');
let Toast = require('../layout/toast.js');
let api = require('../modules/api.js');
let wx = require('weixin-js-sdk');
import {Tabs, WhiteSpace} from 'antd-mobile';
const TabPane = Tabs.TabPane;

class TabExample extends React.Component {
    constructor(...args) {
        super(...args);
    }
    componentWillMount(){

    }
    callback(key) {
        console.log('onChange', key);
        this.props.changeCurrentType(key);
    }
    handleTabClick(key) {
    }
    componentDidMount(){
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
    handleScroll(e){
        var scrollTop = document.body.scrollTop;
        var clientHeight = document.documentElement.clientHeight;
        var scrollHeight = document.body.scrollHeight;
        if(scrollTop + clientHeight >= scrollHeight){
            console.log('滑动到底部啦～');

            var rotateLoadingBox = document.querySelector('.rotateLoading-inner');
            if (rotateLoadingBox) {
                return;
            }
            if (this.props.hasNext) {
                rotateLoading.ready();
                this.props.getNextPage();
            }else{
                rotateLoading.loading_hide();
                return;
            }

        }
    }
    render() {
        return (
            <div className="tabExample">
                <Tabs defaultActiveKey="1" swipeable={false} onChange={this.callback.bind(this)} onTabClick={this.handleTabClick}>
                    <TabPane tab="全部" key="1">
                        <div>
                            <OrderItem orderList={this.props.all} foldMenu={this.props.foldMenu}/>
                        </div>
                    </TabPane>
                    <TabPane tab="待付款" key="2">
                        <div>
                            <OrderItem orderList={this.props.cretaed} foldMenu={this.props.foldMenu}/>
                        </div>
                    </TabPane>
                    <TabPane tab="待收货" key="3">
                        <div>
                            <OrderItem orderList={this.props.paid} foldMenu={this.props.foldMenu}/>
                        </div>
                    </TabPane>
                    <TabPane tab="已完成" key="4">
                        <div>
                            <OrderItem orderList={this.props.delivery} foldMenu={this.props.foldMenu}/>
                        </div>
                    </TabPane>
                </Tabs>
                <WhiteSpace/>
            </div>
        );
    }
}

class OrderItem extends React.Component {
    constructor(props) {
        super(props);

    }
    componentWillMount() {}

    timer(endTime){
        switch (endTime){
          case '12:00':
            return '12:30前';
            break;
          case '18:00':
            return '18:00前';
            break;
          default :
            return endTime+'前';
        }
    }
    foldMenu(orderId,e){
         e.stopPropagation();
        this.props.foldMenu(orderId)
    }
    toOrderDetail(orderListData){
        if (orderListData.targetUrl) {
            window.location.href = orderListData.targetUrl;
        }
    }
    getStr(n){
        if (n<10) {
            n = "0" + n;
        }
        return n;
    }
    render() {
        var orderItem = [];
        var orderListData = this.props.orderList;

        return (
            <section className="order-item-box">
                {
                    orderListData.length==0?
                    <section className="cart-empty">
                        <div className="icon">
                            <span className="icons icon-order-empty"></span>
                        </div>
                        <p className="tips">您还没有下单哦~</p>
                    </section>
                    :null
                }
                {
                    this.props.orderList.map((data,index)=>{
                        return(
                            <div className="order-list-item" key={index} onClick={()=>{
                                window.location.href = '/wellyoung/orderDetail?orderId=' + data.id;
                            }}>
                                <div className="order-list-top">
                                    <span>{data.created_at}</span>
                                    <em>{data.status_desc}</em>
                                </div>
                                {
                                    data.products.map((item,subIndex)=>{
                                        return(
                                            <div className="cart-list-item" key={subIndex}>
                                                <div className="item-left-box"></div>
                                                <div className="item-right-box">
                                                    <div className="img-box"><img src={item.firstImage}/></div>
                                                    <div className="cart-list-content">
                                                        <div className="cart-list-display">
                                                            <h3 className="logo-text">{item.brand}</h3>
                                                            <p className="product-name">{item.name}</p>
                                                            <div className="tag-box">{item.deliveryDate==='weekend'?"周末配送":"工作日配送"}</div>
                                                        </div>
                                                        <div className="cart-list-right">
                                                            <p className="price">￥{item.price}</p>
                                                            <p className={item.price==item.originalPrice?"hide":"originalPrice"}><s>￥{item.originalPrice}</s></p>
                                                            <span className="product-count">x{item.qty}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <div className="order-list-bottom">
                                    <span>共{data.products.length}件商品</span>
                                    <em>共计￥188.00</em>
                                </div>
                            </div>
                        )
                    })
                }
            </section>
        )
    }
}

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            all : {
                data : [],
                hasNext : false,
                pageNum : 1
            },
            cretaed : {
                data : [],
                hasNext : false,
                pageNum : 1
            },
            paid : {
                data : [],
                hasNext : false,
                pageNum : 1
            },
            delivery : {
                data : [],
                hasNext : false,
                pageNum : 1
            },
            currentType : 'all',
            currentTypeNum : 1,

        }
    }
    async componentWillMount() {
        const res = await this.getOrderList(1,'all');
        loading.loading_hide()
        if (document.querySelector('.loadingBox')) {
            document.querySelector('.loadingBox').innerHTML = '';
        }
    }
    async getOrderList(typeNum,Ordertype) {
        try {

            var rotateLoadingBox = document.querySelector('.rotateLoading-inner');
            if (!rotateLoadingBox) {
                rotateLoading.ready();
            }
            var timer = setTimeout(function(){
                rotateLoading.loading_hide();
            },10000)
            const res = await api.getUserOrderList({page:typeNum,status : Ordertype});
            clearTimeout(timer);
            let orderList = this.state[Ordertype].data;
            console.log(res,1999);
            orderList = orderList.concat(res.orders);
            console.log(orderList);
            let obj = {
                hasNext : res.pager.hasPages,
                data : orderList,
                page : typeNum
            };
            let stateObj = {};
            stateObj[Ordertype] = obj;
            this.setState(stateObj);
            rotateLoading.loading_hide();
            return true;
        } catch (e) {
            console.log(e)
            clearTimeout(timer);
            rotateLoading.loading_hide();
            return false;
        } finally {

        }
    }
    changeCurrentType(key){
        console.log(key + "key");
        var currentType = this.state.currentType;
        switch (key) {
            case "1":
                currentType = "all";
                break;
            case "2":
                currentType = "cretaed";
                break;
            case "3":
                currentType = "paid";
                break;
            case "4":
                currentType = "delivery";
                break;
        }
        this.setState({
            currentType : currentType,
            currentTypeNum : key,
        })
        console.log(currentType);
        if (this.state[currentType].data.length==0) {
            this.getOrderList(1,currentType)
        }
    }
    getNextPage(){
        console.log('获取下一页内容');
        let page = this.state[Ordertype].pageNum;
        page++;
        this.getOrderList(page,this.state.currentType)
    }
    foldMenu(orderId){
        var orderList = this.state[this.state.currentType].data;
        for (var i = 0; i < orderList.length; i++) {
            if (orderList[i].orderId==orderId) {
                orderList[i].foldBtn = !orderList[i].foldBtn;
                break;
            }
        }
        var obj = {};
        obj[this.state.currentType] = this.state[this.state.currentType];
        obj[this.state.currentType].data = orderList;
        this.setState(obj)
    }
    render() {
        return (
            <div>
                <TabExample
                    foldMenu={this.foldMenu.bind(this)}
                    hasNext={this.state[this.state.currentType].hasNext}
                    getNextPage={this.getNextPage.bind(this)}
                    changeCurrentType={this.changeCurrentType.bind(this)}
                    all={this.state.all.data}
                    cretaed={this.state.cretaed.data}
                    paid={this.state.paid.data}
                    delivery={this.state.delivery.data}
                />
            </div>
        )
    }
}

window.onload = async function() {
    try {
        // const login = await api.login({name:'test',password:'secret'});
        // console.log(login);
        //init main dom
        sgMethods.initMain();

        updataRender()
    } catch (e) {

    } finally {

    }


};

function updataRender() {


    //render
    let _main = document.querySelector('.main');
    sgMethods.wxShare();
    ReactDom.render(
        <Index/>, _main);

}
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
