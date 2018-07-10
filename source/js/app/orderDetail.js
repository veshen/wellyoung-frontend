require('../modules/global.js');
require('../../css/app/orderDetail.scss');

let loading             = require('../layout/loading.js');
let rotateLoading       = require('../layout/rotateLoading.js');
// loading.ready();
let React               = require('react');
let ReactDom            = require('react-dom');
let sgMethods           = require('../modules/sgMethods.js');
let LS                  = require('../modules/localstorage.js');
let Toast               = require('../layout/toast.js');
let api                 = require('../modules/api.js');
let wx                  = require('weixin-js-sdk');

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order : props.data.order||{},
            invoiceActive : false,
            invoice : {
                "owner" : 'company', //company personal
                "title": "",//抬头
                "tax_no": "",//税号
                "address": "",//收发票的地址
                "account": "",//开户行和帐号
                "program": "flower",//项目
                "type": "offline",
            }
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
    setInputInfo(type,e){
        let text = e.target.value;
        const {invoice} = this.state;
        invoice[type] = e.target.value;
        this.setState({invoice});
    }
    invoiceOwner(type){
        const {invoice} = this.state;
        invoice.owner = type;
        this.setState({invoice})
    }
    async cancelOrder(){
        try {
            const orderId = sgMethods.urlParmKey('orderId');
            const res = await api.cancelOrder({orderId});
            Toast.msg([res.message],2000);
        } catch (e) {

        } finally {

        }
    }
    async createOrderWellyoung(){
        try {
            rotateLoading.ready();
            let orderId = sgMethods.urlParmKey('orderId');
            let invoice = false;
            if (this.state.invoiceActive) {
                if (this.state.invoice.owner==='company') {
                    if (!this.state.invoice.title) {
                        Toast.msg(['请填写发票抬头~'],2000);
                        rotateLoading.loading_hide();
                        return;

                    }
                    if (!this.state.invoice.tax_no) {
                        Toast.msg(['请填写发票税号~'],2000);
                        rotateLoading.loading_hide();
                        return;
                    }
                    invoice = this.state.invoice;
                }else{
                    invoice = {
                        "owner" : 'personal',
                        "title": "个人",//抬头
                        "program": "flower",//项目
                        "type": "offline",
                    }
                }
            }
            console.log(invoice);

            if (invoice) {
                const inv = await api.pushInvoice({orderId},invoice);
            }

            const {order} = this.state;

            wx.ready(()=>{
                wx.chooseWXPay({
                    timestamp:order.wechatpay.timeStamp-0,
                    nonceStr:order.wechatpay.nonceStr,
                    package:order.wechatpay.package,
                    signType:order.wechatpay.signType,
                    paySign:order.wechatpay.paySign,
                    success: function () {
                        window.location.reload();
                    },
                    cancel: function(){
                        window.location.reload();
                    }
                })
            })

        } catch (e) {

        } finally {

        }
    }
    async invoice(){
        try {
            rotateLoading.ready();
            let orderId = sgMethods.urlParmKey('orderId');
            let invoice = false;
            if (this.state.invoiceActive) {
                if (this.state.invoice.owner==='company') {
                    if (!this.state.invoice.title) {
                        Toast.msg(['请填写发票抬头~'],2000);
                        rotateLoading.loading_hide();
                        return;

                    }
                    if (!this.state.invoice.tax_no) {
                        Toast.msg(['请填写发票税号~'],2000);
                        rotateLoading.loading_hide();
                        return;
                    }
                    invoice = this.state.invoice;
                }else{
                    invoice = {
                        "owner" : 'personal',
                        "title": "个人",//抬头
                        "program": "flower",//项目
                        "type": "offline",
                    }
                }
            }
            console.log(invoice);

            if (invoice) {
                const inv = await api.pushInvoice({orderId},invoice);
                Toast.msg(['提交成功'],2000);
            }
            rotateLoading.loading_hide();
        } catch (e) {

        } finally {

        }
    }
    render() {
        const {order,invoiceActive} = this.state;
        const {address,products} = this.state.order;
        return (
            <div className="container">
                <div className="order-state-box">
                    <h3>{order.status_text}</h3>
                    <p>{order.status_desc}</p>
                </div>
                <div className="address-info-box">
                    <div className='left-box'><span className="iconfont icon-address"></span></div>
                    <div className="right-box">
                        <div className="top-b"><span>收货人：{address.receiver}</span>电话：{address.phone}</div>
                        <div><span>收货地址：{address.area}</span></div>
                    </div>
                </div>
                <div className="order-info-box">
                    <div className="title-box">订单信息</div>
                    <div className="order-info-content">
                        <div>
                            <span>订单号</span>
                            <span>{order.sn}</span>
                        </div>
                        <div>
                            <span>下单时间</span>
                            <span>{order.created_at}</span>
                        </div>
                        <div>
                            <span>支付方式</span>
                            <span>微信支付</span>
                        </div>
                    </div>
                </div>
                <div className="product-list-box">
                    <div className="title-box">商品信息</div>
                    {
                        products.map((item,index)=>{
                            return(
                                <div className="product-item" key={index}>
                                    <div className="product-left-box">
                                        <img src={item.firstImage}/>
                                    </div>
                                    <div className="product-center-box">
                                        <h3>{item.brand}</h3>
                                        <p>{item.name}</p>
                                        <div>{item.deliveryDate=="workDay"?'工作日':'休息日'}</div>
                                    </div>
                                    <div className="product-right-box">
                                        <p className='price'>￥{item.price}</p>
                                        <p className={item.price==item.originalPrice?"hide":"originalPrice"}><s>￥{item.originalPrice}</s></p>
                                        <p className="count">x{item.qty}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="order-setinfo-box">
                    <div>
                        <span>运费</span>
                        <span>￥{order.deliveryFee}</span>
                    </div>
                    <div>
                        <span>优惠折扣</span>
                        <span>￥{order.discount}</span>
                    </div>
                    <div>
                        <span>商品总额</span>
                        <span>￥{order.originalTotal}</span>
                    </div>
                </div>
                <div className="order-total-box">
                    <span>实付金额</span>
                    <em>￥{order.total}</em>
                </div>
                {
                    order.invoice?
                    null
                    :<div className="invoice-box">
                        <div className="title">开票申请</div>
                        <div className="content">
                            <span className={invoiceActive
                                ? "item-toggle active"
                                : "item-toggle"} onClick={()=>{
                                    this.setState({invoiceActive:!this.state.invoiceActive})
                                }}>
                                <em></em>
                            </span>
                        </div>
                    </div>
                }

                {
                    invoiceActive?
                    <div className="invoice-box-bottom">
                        <div className="tab-box">
                            <div><span className={this.state.invoice.owner=='company'?"iconfont icon-select active":'iconfont icon-select'} onClick={this.invoiceOwner.bind(this,'company')}></span>对公发票</div>
                            <div><span className={this.state.invoice.owner=='personal'?"iconfont icon-select active":'iconfont icon-select'} onClick={this.invoiceOwner.bind(this,'personal')}></span>个人发票</div>
                        </div>
                        {
                            this.state.invoice.owner=='company'?
                            <div className="company-box">
                                <div className="item-box">
                                    <div className="item-name">开票金额</div>
                                    <div>{123}元</div>
                                </div>
                                <div className="item-box">
                                    <div className="item-name">公司名称</div>
                                    <div><input className="mobileNo" onChange={this.setInputInfo.bind(this,'title')} placeholder="请输入公司名称" type="text"/></div>
                                </div>
                                <div className="item-box">
                                    <div className="item-name">税号</div>
                                    <div><input className="mobileNo" onChange={this.setInputInfo.bind(this,'tax_no')} placeholder="请输入税号" type="text"/></div>
                                </div>
                                <div className="item-box">
                                    <div className="item-name">地址/电话</div>
                                    <div><input className="mobileNo" onChange={this.setInputInfo.bind(this,'phone')} placeholder="选填" type="text"/></div>
                                </div>
                                <div className="item-box">
                                    <div className="item-name">开户行及账号</div>
                                    <div><input className="mobileNo" onChange={this.setInputInfo.bind(this,'account')} placeholder="选填" type="text"/></div>
                                </div>
                                <div className="item-box">
                                    <div className="item-name">发票项目</div>
                                    <div>鲜花</div>
                                </div>
                                <div className="item-box">
                                    <div className="item-name">发票类型</div>
                                    <div>纸质发票</div>
                                </div>
                            </div>:
                            <div className="self-box">
                                <div className="item-box">
                                    <div className="item-name">开票金额</div>
                                    <div>{123}元</div>
                                </div>
                                <div className="item-box">
                                    <div className="item-name">发票抬头</div>
                                    <div>个人</div>
                                </div>
                                <div className="item-box">
                                    <div className="item-name">发票项目</div>
                                    <div>鲜花</div>
                                </div>
                                <div className="item-box">
                                    <div className="item-name">发票类型</div>
                                    <div>纸质发票</div>
                                </div>
                                {/*<div className="item-box">
                                    <div className="item-name">发票邮箱</div>
                                    <div><input className="mobileNo" onChange={this.setInputInfo.bind(this,'email')} placeholder="用于接收电子发票" type="text"/></div>
                                </div>*/}
                            </div>
                        }
                    </div>
                    :null
                }
                {
                    this.state.invoiceActive&&order.status !== 'created'?
                    <div className="btn-p" onClick={this.invoice.bind(this)}>补开发票</div>
                    :null
                }

                {
                    order.status === 'created'?
                    <div className="bottom-bar-box">
                        <div className="cancel-btn" onClick={this.cancelOrder.bind(this)}>取消订单</div>
                        <div className="pay-btn" onClick={this.createOrderWellyoung.bind(this)}>去支付</div>
                    </div>
                    :null
                }

            </div>
        )
    }
}

window.onload = async function(res) {
    try {
        //init main dom
        sgMethods.initMain();
        // const login = await api.login({name:'test',password:'secret'});
        // console.log(login);
        let orderId = sgMethods.urlParmKey('orderId');
        const res = await api.getOrderDetail({orderId});
        console.log(res);
        loading.loading_hide();
        if (document.querySelector('.loadingBox')) {
            document.querySelector('.loadingBox').innerHTML = '';
        }
        updataRender(res)
        LS.init()
    } catch (e) {

    } finally {
        sgMethods.wxShare();
    }

};

function updataRender(res) {
    //render
    let _main = document.querySelector('.main');

    ReactDom.render(
        <Index
        data={res}
        />, _main);

}
