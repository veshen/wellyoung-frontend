require('../modules/global.js');
require('../../css/app/address.scss');

let loading             = require('../layout/loading.js');
let rotateLoading       = require('../layout/rotateLoading.js');
loading.ready();
let React               = require('react');
let ReactDom            = require('react-dom');
let sgMethods           = require('../modules/sgMethods.js');
let LS                  = require('../modules/localstorage.js');
let Toast               = require('../layout/toast.js');
let DiaLogConfirm       = require('../layout/diaLogConfirm');
let api                 = require('../modules/api.js');
let wx                  = require('weixin-js-sdk');

class AddressList extends React.Component {
    constructor(props){
        super(props);
    }
    delAddress(item,index){
        this.props.delAddress(item,index);
    }
    setDefauleAddress(item,index){
        if (item.is_default) {
            return;
        }else{
            this.props.setDefauleAddress(item,index);
        }
    }
    updateAdd(item){//跳转到订单详情,修改订单地址
        if(sgMethods.urlParmKey('url') == 'orderDetail'){
            LS.setItem('OrderDetailUpdateAddress',JSON.stringify(item))
            location.href = '/vpage/orderDetail?orderId=' + sgMethods.urlParmKey('orderId')
            //location.replace('/vpage/orderDetail?orderId=' + sgMethods.urlParmKey('orderId'))
        }
    }
    render() {
        return (
            <ul className="delivery-address-list">
                {
                    this.props.list.map((item,index)=>{
                        return(
                            <li key={index} >
                                <div className="address-item-container">
                                    <div className="address" onClick={this.updateAdd.bind(this,item)}>
                                        <div className="contact">
                                            <div className="address_head">{item.receiver}
                                                <div className={item.tag?"address_tag":"hide"}>
                                                    {item.tag}
                                                </div>
                                            </div>
                                            <span className="tel">{item.phone}</span>
                                        </div>
                                        <p className="add">{item.area}</p>
                                        <p className="add">{item.address}</p>
                                    </div>
                                    <div className="arrow">
                                        <div className="arrow_l" onClick={this.setDefauleAddress.bind(this,item,index)}>
                                            <span className={item.is_default?"icons icons-radio icona-choose":"icons icons-radio"}></span>
                                            <em>默认地址</em>
                                        </div>
                                        <div className="arrow_r">
                                            <div className="arrow_r_item" onClick={()=>{window.location.href = "/wellyoung/addAddress?addressId="+item.id}}>
                                                <span className="icons icon-edit"></span>
                                                <em>编辑</em>
                                            </div>
                                            <div className="arrow_r_item" onClick={this.delAddress.bind(this,item,index)}>
                                                <span className="icons icon-del"></span>
                                                <em>删除</em>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list : this.props.addressList,
            none : false
        }
    }
    componentWillMount() {
    }
    async delAddress(item,index){
        try {
            const result = await DiaLogConfirm.ready('确定要删除地址？',true);
            if (result) {
                const res = await api.removeAddress({addressId:item.id});
                console.log(res);
                if (res.status) {
                    Toast.msg([res.message],2000);
                    const list = this.state.list;
                    list.remove(index);
                    this.setState({list});
                }else{
                    Toast.msg([res.message],2000);
                }

            }
        } catch (e) {

        }
    }
    async setDefauleAddress(item,index){
        try {
            item.is_default = true;
            const res = await api.updataAddress({addressId:item.id},item);
            console.log(res);

            const {list} = this.state;
            list.map((item)=>{
                item.is_default=false;
            })
            list[index].is_default = true;
            this.setState({list});
        } catch (e) {

        }
    }
    render() {
        return (
            <div className="delivery-address">
                <AddressList
                    list={this.state.list}
                    delAddress={this.delAddress.bind(this)}
                    setDefauleAddress={this.setDefauleAddress.bind(this)}
                />
                <nav className="nav-bottom-button delivery-address-btn">
                    <div className="buttons">
                        <div className="btn" onClick={()=>{
                            window.location.href = '/wellyoung/addAddress'}
                        }>
                            <span className="btn-text">添加收货地址</span>
                        </div>
                    </div>
                </nav>
                {
                    this.state.list&&this.state.list instanceof Array&&this.state.list.length>0?null
                    :<section className="address-empty">
                        <div className="icon">
                            <span className="icons icon-address-empty"></span>
                        </div>
                        <p className="tips">您还没有添加收货地址哦~</p>
                    </section>
                }
            </div>
        )
    }
}

window.onload = async function() {
    //init main dom
    sgMethods.initMain();
    // const login = await api.login({name:'test',password:'secret'});
    // console.log(login);
    const res = await api.getAddressAll();
    updataRender(res.addresses)
    loading.loading_hide();
    if (document.querySelector('.loadingBox')) {
        document.querySelector('.loadingBox').innerHTML = '';
    }

};

function updataRender(res) {

    if (document.querySelector('.loadingBox')) {
        document.querySelector('.loadingBox').innerHTML = '';
    }
    //render
    let _main = document.querySelector('.main');
    sgMethods.wxShare();
    ReactDom.render(
        <Index
            addressList = {res}
        />, _main);

}
