require('../modules/global.js');
require('../../css/app/personal.scss');

let loading             = require('../layout/loading.js');
let rotateLoading       = require('../layout/rotateLoading.js');
// loading.ready();
let React               = require('react');
let ReactDom            = require('react-dom');
let sgMethods           = require('../modules/sgMethods.js');
let LS                  = require('../modules/localstorage.js');
let Toast               = require('../layout/toast.js');
let DiaLogConfirm       = require('../layout/diaLogConfirm.js');
let api                 = require('../modules/api.js');
let wx                  = require('weixin-js-sdk');

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "orders" : props.data.orders||[],
            "user" : props.data.user||{}
        }
    }
    componentWillMount(){
        // console.log('组件渲染之前');
    }
    componentDidMount() {
        // console.log('组件挂载之后');
    }
    componentDidUpdate(){

    }
    componentWillUnmount() {

    }
    render() {
        return (
            <div className="container">
                <div className="user-info-box">
                    <img src={this.state.user.avatar}/>
                    <p className="user-name">{this.state.user.displayName}</p>
                    <div className="user-integral">积分{this.state.user.point}</div>
                </div>
                <div className="menu-box">
                    <div className="menu-item" onClick={()=>{
                        window.location.href = "/wellyoung/integral";
                    }}>
                        <span className="iconfont icon-integral"></span>
                        <p>我的积分</p>
                    </div>
                    <div className="menu-item" onClick={()=>{
                        window.location.href = "/wellyoung/privilege";
                    }}>
                        <span className="iconfont icon-privilege"></span>
                        <p>我的特权</p>
                    </div>
                    <div className="menu-item" onClick={()=>{
                        window.location.href = "/wellyoung/address";
                    }}>
                        <span className="iconfont icon-address"></span>
                        <p>地址管理</p>
                    </div>
                </div>
                <div className="order-list-box">
                    <div className="title-box">
                        <p>最近的订单</p>
                        <div onClick={()=>{
                            window.location.href = "/wellyoung/orderList";
                        }}>查看全部订单<span className="iconfont icon-right"></span></div>
                    </div>
                    <div className="order-list">
                        {
                            this.state.orders.map((item,index)=>{
                                return(
                                    <div className="order-item" key={index} onClick={()=>{
                                        window.location.href = "/wellyoung/orderDetail?orderId=" + item.id;
                                    }}>
                                        <div className="item-left">
                                            <img src={item.products[0].firstImage}/>
                                        </div>
                                        <div className="item-center">
                                            <h3>{item.products[0].brand}</h3>
                                            <p>{item.products[0].name}</p>
                                            <div className="item-price">订单金额:<span>￥{item.total}</span></div>
                                            <div>订单状态:<span>{item.status_text}</span></div>
                                        </div>
                                        <div className="item-right"><span className="iconfont icon-right"></span></div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </div>
        )
    }
}

window.onload = async function() {
    try {
        //init main dom
        sgMethods.initMain();
        // const login = await api.login({name:'test',password:'secret'});
        // console.log(login);
        const res = await api.getOrderRecent();
        console.log(res);
        loading.loading_hide();
        if (document.querySelector('.loadingBox')) {
            document.querySelector('.loadingBox').innerHTML = '';
        }
        res.orders = res.orders.filter((item)=>{
            return item.products.length!==0;
        })
        updataRender(res)
        LS.init()
    } catch (e) {
        alert(JSON.stringify(e));
    } finally {
        sgMethods.wxShare();
    }

};

function updataRender(res) {
    //render
    let _main = document.querySelector('.main');

    ReactDom.render(
        <Index
            data = {res}
        />, _main);

}
