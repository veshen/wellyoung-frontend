require('../modules/global.js');
require('../../css/app/detail.scss');
require('../../css/global/animate.css');
require('../../css/global/swiper-4.2.0.min.css');

let loading             = require('../layout/loading.js');
let rotateLoading       = require('../layout/rotateLoading.js');
// loading.ready();
let React               = require('react');
let ReactDom            = require('react-dom');
let sgMethods           = require('../modules/sgMethods.js');
let LS                  = require('../modules/localstorage.js');
let Swiper              = require('../modules/swiper-4.2.0.min');
let Toast               = require('../layout/toast.js');
let api                 = require('../modules/api.js');
let wx                  = require('weixin-js-sdk');

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : props.data.detail,
            cart : props.data.cart,
            user : props.data.user,
            cartListSwitch : false,
            count : 1,
            deliveryDate : 'workDay',
            eventType : null
        }
    }
    componentWillMount(){
        // console.log('组件渲染之前');
    }
    componentDidMount() {
        // console.log('组件挂载之后');
        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'horizontal',
            loop: true,
            autoplay:true,

            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
              type : 'fraction'
            },
        })
    }
    componentDidUpdate(){

    }
    componentWillUnmount() {
    }
    operationCartCount(type){
        let {count} = this.state;
        if (type == 'reduce') {
            if (count==1) {
                Toast.msg(['至少购买一件哦~'],2000);
                return;
            }
            count--;
        }else{
            count++;
        }
        this.setState({count})
    }
    async addCart(){
        try {
            const {productType} = this.state.data;
            const {deliveryDate,count,eventType} = this.state;
            const productId = sgMethods.urlParmKey('productId');
            let obj = {productId,productType,deliveryDate,"qty":count};
            console.log(obj);
            if (eventType==='addCart') {
                const res = await api.addCart(obj);
                if (res.status) {
                    this.setState({cartListSwitch:false,cart:res.cart})
                    Toast.msg([res.message],2000);
                }else{
                    Toast.msg([res.message],2000);
                }
            }else{
                LS.setItem('productData',JSON.stringify({productList:[obj],type:eventType}));
                window.location.href = "/wellyoung/orderCreate";
            }

        } catch (e) {

        } finally {

        }
    }
    render() {
        const {images,discounts,topic,composition,arrange,tips,details,container,delivery,notice,deliveryDate} = this.state.data;
        return (
            <div className="container">
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        {
                            images.map((item,index)=>{
                                return(
                                    <div key={index} className="swiper-slide"><img src={item}/></div>
                                )
                            })
                        }
                    </div>
                    <div className="swiper-pagination"></div>
                </div>
                <div className="product-info-box">
                    <img className="text-logo" src="https://wellyoung-static.oss-cn-shanghai.aliyuncs.com/images/logotext.jpg"/>
                    <h3 className="product-name">{this.state.data.name}|{this.state.data.summary}</h3>
                    <p className="shop-desc">本店花束风格是法式自然风，主要表达的是感受到植物的 自然生长，轻松打理。</p>
                    <div className="price-box"><span className="">￥{this.state.data.displayPrice}</span><em>.00</em></div>
                    <div className={this.state.data.displayPrice==this.state.data.originalPrice?"hide":"original-price-box"}><s>￥{this.state.data.originalPrice}</s></div>
                    <div className="tag-box">
                        {
                            this.state.data.limitSell==1?
                            <div className="tag">限量预售</div>
                            :this.state.data.limitSell==2?
                            <div className="tag">限量销售</div>
                            :null
                        }
                        <div className="stock-box">还剩{this.state.data.displayedInventory}份</div>
                    </div>
                </div>
                {
                    discounts instanceof Array&&discounts.length>0?
                    <div className="discount-info-box">
                        <div className="discount-type">{discounts[0]}</div>
                        {
                            discounts[1]?
                            <div className="discount-content"><span className="iconfont icon-select"></span>{discounts[1]}</div>
                            :null
                        }
                        {
                            discounts[2]?
                            <div className="discount-content"><span className="iconfont icon-select"></span>{discounts[2]}</div>
                            :null
                        }
                    </div>
                    :null
                }

                <div className="product-content">
                    <img className="top-pic" src="https://wellyoung-static.oss-cn-shanghai.aliyuncs.com/images/detail-1.jpg"/>
                    {
                        topic.visible?
                        <div className="topic-box">
                            <img src={topic.image}/>
                            <div className="topic-content">
                                <h3 className="topic-title">{topic.title}</h3>
                                <p>{topic.summary}</p>
                            </div>
                        </div>
                        :null
                    }
                    {
                        composition.visible?
                        <div className="composition-box">
                            <div className="common-head">
                                <h3>COMPOSITION</h3>
                                <p>花材</p>
                            </div>
                            <img src={composition.image}/>
                            {
                                composition.summary?
                                <div className="composition-content">{composition.summary}</div>
                                :null
                            }

                        </div>
                        :null
                    }
                    {
                        arrange.visible?
                        <div className="arrange-box">
                            <div className="common-head">
                                <h3>STEPS</h3>
                                <p>步骤</p>
                            </div>
                            <div className="steps-list">
                                {
                                    arrange.steps.map((item,index)=>{
                                        return(
                                            <div key={index} className="steps-item">
                                                <img src={item.image}/>
                                                <p>{item.summary}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        :null
                    }
                    {
                        tips.visible?
                        <div className="tips-box">
                            <div className="common-head">
                                <h3>TIPS</h3>
                                <p>贴士</p>
                            </div>
                            <img src={tips.image}/>
                            {
                                tips.summary?
                                <div className="tips-content">{tips.summary}</div>
                                :null
                            }

                        </div>
                        :null
                    }
                    {
                        details.visible?
                        <div className="detail-box">
                            <div className="common-head">
                                <h3>DETAILS</h3>
                                <p>细节</p>
                            </div>
                            <div>
                                {
                                    details.images.map((item,index)=>{
                                        return(
                                            <img key={index} src={item}/>
                                        )
                                    })
                                }
                            </div>
                            {
                                details.content?
                                <div className="detail-content">{details.content}</div>
                                :null
                            }

                        </div>
                        :null
                    }
                    {
                        container.visible?
                        <div className="container-box">
                            <div className="common-head">
                                <h3>CONTAINER</h3>
                                <p>花器</p>
                            </div>
                            <img src={container.image}/>
                            <div className="container-content">{container.content}</div>
                        </div>
                        :null
                    }
                    {
                        !delivery.visible?
                        <div className="delivery-box">
                            <div className="common-head">
                                <h3>DELIVERY</h3>
                                <p>配送</p>
                            </div>
                            <div className="title-box">
                                <em>—</em>
                                <span>收货地区</span>
                                <em>—</em>
                            </div>
                            <div className="area">{delivery.area}</div>
                            <div className="title-box">
                                <em>—</em>
                                <span>收货时间</span>
                                <em>—</em>
                            </div>
                            <div className="delivery-time">
                                {
                                    delivery.time.map((item,index)=>{
                                        return(
                                            <p key={index}>{item}</p>
                                        )
                                    })
                                }
                                <p>节假日酌情发送</p>
                            </div>
                        </div>
                        :null
                    }
                    {
                        notice.visible?
                        <div className="notice-box">
                            <div className="notice-head">
                                <div>
                                    <h3>NOTICE</h3>
                                    <p>注意事项</p>
                                </div>
                                <span className="iconfont icon-down"  onClick={()=>{this.setState({noticeActive:!this.state.noticeActive})}}></span>
                            </div>
                            {this.state.noticeActive?
                            <div className="notice-content">
                                <p>{notice.content}</p>
                            </div>
                            :null}


                        </div>
                        :null
                    }
                    <img src="https://resource.sa-green.cn/image/jpg/detail-bottom-jpg.jpg"/>
                </div>
                <div className="bottom-bar-box">
                    <div className="bar-left">
                        <span className="iconfont icon-cart" onClick={()=>{
                            window.location.href = "/wellyoung/cart";
                        }} ></span>
                        <div className="count-box">{this.state.cart.count}</div>
                    </div>
                    <div className="bar-right">
                        <div className="add-cart-btn" onClick={()=>{this.setState({cartListSwitch:true,eventType : 'addCart'})}}>加入购物车</div>
                        <div className="buy-now-btn" onClick={()=>{this.setState({cartListSwitch:true,eventType : 'buyNow'})}}>立即购买</div>
                    </div>
                </div>
                <div onClick={()=>{this.setState({cartListSwitch:false})}} className={this.state.cartListSwitch?"mark animated fadeIn":"hide"}></div>
                <div id="cartListBox" className={this.state.cartListSwitch?"cartListBox animated slideInUp":"cartListBox animated slideOutDown"}>
                    <span className="iconfont icon-off" onClick={()=>{this.setState({cartListSwitch:false})}}></span>
                    <div className="add-cart-content">
                        <div className="add-cart-info">
                            <div className="img-box">
                                <img src={this.state.data.firstImage}/>
                            </div>
                            <div className="info-box">
                                <p className="price">￥{this.state.data.displayPrice}</p>
                                <p className={this.state.data.displayPrice==this.state.data.originalPrice?"hide":"originalPrice"}><s>￥{this.state.data.originalPrice}</s></p>
                                <p className="stock">库存{this.state.data.displayedInventory}</p>
                            </div>
                        </div>
                        <div className="add-cart-time">
                            <h3>配送时间</h3>
                            <div className="tags-box">
                                <p className={this.state.deliveryDate=='workDay'?"cur":""} onClick={()=>{
                                    this.setState({deliveryDate:'workDay'})
                                }}>{deliveryDate.workDay}</p>
                                <p className={this.state.deliveryDate=='weekend'?"cur":""} onClick={()=>{
                                    this.setState({deliveryDate:'weekend'})
                                }}>{deliveryDate.weekend}</p>
                            </div>
                        </div>
                        <div className="add-cart-count">
                            <div className="title">购买数量</div>
                            <div className="panel">
                                <div className="reduce" onClick={this.operationCartCount.bind(this,'reduce')}>{"-"}</div>
                                <div className="count-box">{this.state.count}</div>
                                <div className="add" onClick={this.operationCartCount.bind(this,'add')}>{"+"}</div>
                            </div>
                        </div>
                    </div>
                    <button onClick={this.addCart.bind(this)}>确定</button>
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
        let productId = sgMethods.urlParmKey('productId')
        const res = await api.getProductDetail({productId});
        loading.loading_hide();
        if (document.querySelector('.loadingBox')) {
            document.querySelector('.loadingBox').innerHTML = '';
        }
        // const login = await api.login({name:'test',password:'secret'});
        // console.log(login);
        updataRender(res)
        LS.init()
        console.log(res);
        let _share = {
              title: res.share.title, // 分享标题
              desc: res.share.summary, // 分享描述
              link: res.share.link, // 分享链接
              imgUrl: res.share.icon, // 分享图标
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
    } catch (e) {

    } finally {

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
