require('../modules/global.js');
require('../../css/app/orderCreate.scss');

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
let AddressSelect       = require('../layout/addressSelect.js');

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "address" : props.data.address || false,
            "buy" : props.data.buy,
            "notes" : '',
            "invoiceActive" : false,
            "disclaimer" : false,
            "invoice" : {
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
    setRemarks(e){
        let notes = e.target.value;
        this.setState({notes});
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
    async selectAddress(addressId,e){
        try {
            var This = this;
            rotateLoading.ready();
            const addressList = await api.getAddressAll();
            rotateLoading.loading_hide();
            console.log(addressList.addresses);
            AddressSelect.showAddress(addressId,(address)=>{
                console.log(address);
                This.setState({address})
            });
        } catch (e) {

        } finally {

        }
    }
    async createOrderWellyoung(){
        try {
            let invoice = false;
            if (this.state.invoiceActive) {
                if (this.state.invoice.owner==='company') {
                    if (!this.state.invoice.title) {
                        Toast.msg(['请填写发票抬头~'],2000);
                        return;
                    }
                    if (!this.state.invoice.tax_no) {
                        Toast.msg(['请填写发票税号~'],2000);
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
            let arr = this.state.buy.products.map((item)=>{
                return{
                    "productId":item.id,
                    "productType" : "flower",
                    "deliveryDate" :item.deliveryDate,
                    "qty" : item.qty
                }
            })
            const {address,notes} = this.state;
            if (!address) {
                Toast.msg(['请添加您的收货地址~'],2000);
                return;
            }
            let obj ={
                "products": arr,
                "fromCart": false,
                "address_id": address.id,
                "payment": "wechatpay",
                "invoice": invoice,
                "notes" : notes
            }
            const res = await api.createOrderWellyoung(obj);
            if (res.status) {
                wx.ready(()=>{
                    wx.chooseWXPay({
                        timestamp:res.order.wechatpay.timeStamp-0,
                        nonceStr:res.order.wechatpay.nonceStr,
                        package:res.order.wechatpay.package,
                        signType:res.order.wechatpay.signType,
                        paySign:res.order.wechatpay.paySign,
                        success: function () {
                            LS.removeItem('productData');
                            window.location.href = "/wellyoung/orderResult?orderId=" + res.order.id;
                        },
                        cancel: function(){
                            LS.removeItem('productData');
                            window.location.href = "/wellyoung/orderDetail?orderId=" + res.order.id;
                        }
                    })
                })
            }else{
                Toast.msg([res.message],2000);
            }

        } catch (e) {

        } finally {

        }
    }

    render() {
        const {address,invoiceActive} = this.state;
        const {products} = this.state.buy;
        return (
            <div className="container">
                {
                    this.state.address?
                    <div className="address-box">
                        <div className="title">
                            <p>配送地址</p>
                        </div>
                        <div className="address-content" onClick={this.selectAddress.bind(this,address.id)}>
                            <div className="address-content-left">
                                <div className="add-info">
                                    <span className="address-name-box">{address.receiver}</span>
                                    <span className="address-phone-number">{address.phone}</span>
                                    <span className={address.tag?"tag-box":"hide"}>{address.tag}</span>
                                </div>
                                <div className="address-info-box">
                                    {address.area}
                                </div>
                            </div>
                            <div className="address-content-right">
                                <span className="iconfont icon-right"></span>
                            </div>
                        </div>
                    </div>
                    :<div className="add-address-box" onClick={()=>{
                        let url = window.location.pathname + window.location.search;
                        location.href='/wellyoung/addAddress?returnUrl='+encodeURIComponent(url);
                    }}>
                        <p>添加收货地址</p>
                        <span className="iconfont icon-right"></span>
                    </div>
                }
                <div className="product-list-box">
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
                                        <p className="originalPrice"><s>￥{item.originalPrice}</s></p>
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
                        <span>￥{this.state.buy.deliveryFee}</span>
                    </div>
                    <div>
                        <span>优惠折扣</span>
                        <span>￥{this.state.buy.discount}</span>
                    </div>
                    <div>
                        <span>商品总额</span>
                        <span>￥{this.state.buy.originalTotal}</span>
                    </div>
                </div>
                <div className="order-total-box">
                    <span>实付金额</span>
                    <em>￥{this.state.buy.total}</em>
                </div>

                <div className="order-remarks-box">
                    <p>留言备注</p>
                    <div>
                        <textarea onChange={this.setRemarks.bind(this)}></textarea>
                    </div>
                </div>

                <div className="order-disclaimer-box">
                    <div className="title-box">
                        <p>服务免责声明</p>
                        <span className={this.state.disclaimer?"iconfont icon-down":"iconfont icon-down active"} onClick={()=>{
                            this.setState({disclaimer:!this.state.disclaimer})
                        }}></span>
                    </div>
                    {
                        this.state.disclaimer?
                        <div className="disclaimer-content">
                            <h4>致未央用户：</h4>
                            <p>本鲜花服务平台将竭诚为您提供优质的鲜花订阅服务，但  服务过程中，可能会遇到不可抗力的因素，导致服务发生终端、延期。依照《中华人民共和国合同法》的相关规定，不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件。不可抗力因素一半包括但不限于对鲜花质量、物流（航班延误、取消、交通管制等）造成重大影响的以下事件：<br/>1）	自然灾害（包括特殊的极端天气，雾霾、暴雨、大雪等）；<br/>2）	如因不可抗力因素导致服务中断、停发、延迟等情况时，未央将在第一时间与您沟通（请确保平台留存的联系方式保持畅通），协商并及时进行调整。由此给您造成的损失，未央在法律允许的范围内全部或部分免责。因个人体质不同，部分人群对花粉友过敏现象，请您结合自身及收货方的具体情况进行订购，未央对此情况在法律允许的范围内免责。<br/>3）	国定节假日等特殊节日（如春节、劳动节、国庆、端午节等）暂停或者顺延，我们会提前告知请您详细阅读上述声明，点击订购视为对上述内容已经知悉，感谢您对未央的理解与支持。</p>
                        </div>
                        :null
                    }

                </div>
                <div className="invoice-box">
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
                                    <div>{this.state.buy.total}元</div>
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
                                    <div>{this.state.buy.total}元</div>
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

                <div className="bottom-bar-box">
                    <div className="pay-info">需要支付：<span>￥{this.state.buy.total}</span></div>
                    <div className="pay-btn" onClick={this.createOrderWellyoung.bind(this)}>提交订单</div>
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
        var productData  = JSON.parse(LS.getItem('productData'));
        console.log(productData);
        if(!productData||productData.productList.length==0){
            Toast.msg(['数据错误请重试~'],2000);
            return;
        }
        const res = await api.getOrdreBuy({"products":productData.productList});
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
        data = {res}
        />, _main);

}
