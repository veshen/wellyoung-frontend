import React, {Component} from 'react';
import ReactDom from 'react-dom';
import '../../css/global/animate.css';
import '../../css/layout/cartPop.scss';

let sgMethods           = require('../modules/sgMethods.js');
let Toast               = require('../layout/toast.js');
let api                 = require('../modules/api.js');

class CartPop extends Component {
    constructor(props){
        super(props);
        this.state = {
            count : 1,
            deliveryDay:'workDay'
        }
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
            const {deliveryDay,count} = this.state;
            const productId = this.props.data.id;
            const {productType} = this.props.data;
            let obj = {
                productId,
                productType,
                deliveryDate:deliveryDay,
                qty:count
            };
            console.log(obj);
            const res = await api.addCart(obj);
            if (res.status) {
                this.props.close();
                Toast.msg([res.message],2000);
            }else{
                Toast.msg([res.message],2000);
            }

        } catch (e) {
            console.log(e);
        } finally {

        }
    }
    render (){
        let cartListSwitch = this.props.show;
        let {data,count,deliveryDay} = this.state;
        let {firstImage,displayPrice,orderPrice,originalPrice,displayedInventory,deliveryDate} = this.props.data;
        console.log(cartListSwitch,displayPrice,orderPrice,displayedInventory,deliveryDate);
        return (
            <div className={cartListSwitch?"cartPop show":"cartPop hide"}>
                <div
                    onClick={()=>{this.props.close()}}
                    className={cartListSwitch?"mark animated fadeIn":"hide"}
                ></div>
                <div
                    id="cartListBox"
                    className={cartListSwitch?"cartListBox animated slideInUp":"cartListBox animated slideOutDown"}
                >
                    <span className="iconfont icon-off" onClick={()=>{this.props.close()}}></span>
                    <div className="add-cart-content">
                        <div className="add-cart-info">
                            <div className="img-box">
                                <img src={firstImage}/>
                            </div>
                            <div className="info-box">
                                <p className="price">&yen;{displayPrice}</p>
                                <p className={displayPrice==(orderPrice||originalPrice)?"hide":"originalPrice"}>
                                    <s>&yen;{orderPrice||originalPrice}</s>
                                </p>
                                <p className="stock">库存{displayedInventory}</p>
                            </div>
                        </div>
                        <div className="add-cart-time">
                            <h3>配送时间</h3>
                            <div className="tags-box">
                                <p className={deliveryDay=='workDay'?"cur":""} onClick={()=>{
                                    this.setState({deliveryDay:'workDay'})
                                }}>{deliveryDate&&deliveryDate.workDay}</p>
                                <p className={deliveryDay=='weekend'?"cur":""} onClick={()=>{
                                    this.setState({deliveryDay:'weekend'})
                                }}>{deliveryDate&&deliveryDate.weekend}</p>
                            </div>
                        </div>
                        <div className="add-cart-count">
                            <div className="title">购买数量</div>
                            <div className="panel">
                                <div className="reduce" onClick={this.operationCartCount.bind(this,'reduce')}>{"-"}</div>
                                <div className="count-box">{count}</div>
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

export default CartPop;
