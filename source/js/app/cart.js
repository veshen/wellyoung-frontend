require('../modules/global.js');
require('../../css/app/cart.scss');

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
            cartList : props.data.cart.products || [],
            edState : true,
            selectAll : true,
            currentPrice : props.data.cart.total||0
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
    async operationCartCount(item,type,index){
        try {
            rotateLoading.ready();
            let {rowId,qty,deliveryDate} = item;
            let obj = {rowId,qty,deliveryDate};
            let cartList = this.state.cartList;
            if (type == 'reduce') {
                if (obj.qty==1) {
                    const res = await DiaLogConfirm.ready("确定要删除吗？",true);
                    console.log(res);
                    if (res) {
                        const delCartInfo = await api.delCart({rowId:rowId});
                        cartList.remove(index);
                    }

                }else{
                    obj.qty--;
                    const res = await api.updateCart(obj);
                    console.log(res);
                    cartList[index].qty = obj.qty;
                }
            }else{
                obj.qty++;
                const res = await api.updateCart(obj);
                console.log(res);
                cartList[index].qty = obj.qty;
            }
            this.refreshData(cartList);
        } catch (e) {

        } finally {

        }
    }
    selectAll(){
        let {selectAll,cartList} = this.state;
        cartList.map((item)=>{
            item.select = !selectAll;
        })
        this.setState({selectAll : !selectAll})
        this.refreshData(cartList);
    }
    selectItem(index){
        let {selectAll,cartList} = this.state;
        cartList[index].select = !cartList[index].select;
        selectAll = !cartList.some((element, index, array)=>{
            return element.select === false;
        });

        this.setState({selectAll})
        this.refreshData(cartList);
    }
    async delSku(index){
        try {
            let cartList = this.state.cartList;
            const res = await DiaLogConfirm.ready("确定要删除吗？",true);
            console.log(res);
            if (res) {
                const delCartInfo = await api.delCart({rowId:cartList[index].rowId});
                cartList.remove(index);
            }
            this.refreshData(cartList);
        } catch (e) {

        } finally {

        }
    }
    refreshData(cartList){
        let currentPrice = 0;
        cartList.map((item)=>{
            if (item.select) {
                currentPrice += item.price * item.qty;
            }
        })
        this.setState({cartList,currentPrice});
        rotateLoading.loading_hide();
    }
    async selectDeliveryDate(type,index){
        try {
            rotateLoading.ready();
            let cartList = this.state.cartList;
            if (cartList[index].deliveryDate===type) {
                rotateLoading.loading_hide();
                return;
            }
            let {rowId,qty,deliveryDate} = cartList[index];
            let obj = {rowId,qty,deliveryDate};
            obj.deliveryDate = type;
            const res = await api.updateCart(obj);
            cartList[index].deliveryDate = type;
            this.refreshData(cartList);
        } catch (e) {

        } finally {

        }
    }
    toOrderCreate(){
        const {cartList} = this.state;
        let arr = [];
         cartList.map((item)=>{
            if (item.select) {
                arr.push({
                    "productId": item.productId,
                    "productType": item.productType,
                    "deliveryDate": item.deliveryDate,
                    "qty": item.qty,
                });
            }
        });
        if(arr.length===0){
            Toast.msg(['请选择你要购买的商品~'],2000);
        }else{
            LS.setItem('productData',JSON.stringify({"productList":arr,type:'cartList'}));
            window.location.href = "/wellyoung/orderCreate";
        }
    }
    render() {
        return (
            <div className="container">
                <div className="cart-top">
                    <div className="cart-top-left">
                        <span className={this.state.selectAll?"iconfont icon-select active":"iconfont icon-select"}
                            onClick={this.selectAll.bind(this)}
                        ></span>全选
                    </div>
                    <div className="cart-top-right" onClick={()=>{
                        this.setState({edState:!this.state.edState})
                    }}>
                        <span className="iconfont icon-ed"></span>{this.state.edState?"管理":"完成"}
                    </div>
                </div>
                <div className="cart-list-box">
                    {
                        this.state.cartList.map((item,index)=>{
                            return(
                                <div className="cart-list-item" key={index}>
                                    <div className="item-left-box"><span className={item.select?"iconfont icon-select active":"iconfont icon-select"} onClick={this.selectItem.bind(this,index)}></span></div>
                                    <div className="item-right-box">
                                        <div className="img-box"><img src={item.image}/></div>
                                        <div className="cart-list-content">
                                            {
                                                this.state.edState?
                                                <div className="cart-list-display">
                                                    <h3 className="logo-text">{item.brand}</h3>
                                                    <p className="product-name">{item.name}</p>
                                                    <div className="tag-box">{item.deliveryDate==='weekend'?"周末配送":"工作日配送"}</div>
                                                    <p className="price">￥{item.price}</p>
                                                    <p className={item.price==item.originalPrice?"hide":"originalPrice"}><s>￥{item.originalPrice}</s></p>
                                                    <span className="product-count">x{item.qty}</span>
                                                </div>
                                                :<div className="cart-list-ed">
                                                    <div className="ed-box">
                                                        <div className="ed-count-box">
                                                            <div onClick={this.operationCartCount.bind(this,item,'reduce',index)}>-</div>
                                                            <div className="count-box">{item.qty}</div>
                                                            <div onClick={this.operationCartCount.bind(this,item,'add',index)}>+</div>
                                                        </div>
                                                        <div className="ed-time-box">
                                                            <p className={item.deliveryDate==='weekend'?"active":""} onClick={this.selectDeliveryDate.bind(this,'weekend',index)}>双休日</p>
                                                            <p className={item.deliveryDate==='workday'?"active":""} onClick={this.selectDeliveryDate.bind(this,'workday',index)}>工作日</p>
                                                        </div>
                                                    </div>
                                                    <div className="del-btn" onClick={this.delSku.bind(this,index)}>删除</div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="bottom-bar-box">
                    <div className="price-box">总计：<span>￥{this.state.currentPrice}</span></div>
                    <div className="sett-btn" onClick={this.toOrderCreate.bind(this)}>结算</div>
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
        const res = await api.getCartList();
        console.log(res);
        res.cart.products.map((item)=>{
            item.select = true;
        })
        loading.loading_hide();
        if (document.querySelector('.loadingBox')) {
            document.querySelector('.loadingBox').innerHTML = '';
        }
        updataRender(res)
        LS.init()
    } catch (e) {

    } finally {
    }

};

function updataRender(res) {
    //render
    let _main = document.querySelector('.main');

    ReactDom.render(
        <Index
            data = { res }
        />, _main);

}
