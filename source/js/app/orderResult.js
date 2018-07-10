require('../modules/global.js');
require('../../css/app/orderResult.scss');

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
                <div className="box">
                    <img src="https://wellyoung-static.oss-cn-shanghai.aliyuncs.com/images/order-result1.jpg"/>
                    <h3>恭喜你，支付成功</h3>
                    {/*<p><span className="icon icon-integral"></span>转发即可获得积分</p>*/}
                </div>
                <div className="btn" onClick={()=>{
                    window.location.href = "/wellyoung/orderDetail?orderId=" + sgMethods.urlParmKey('orderId');
                }}>查看订单详情</div>
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
        loading.loading_hide();
        if (document.querySelector('.loadingBox')) {
            document.querySelector('.loadingBox').innerHTML = '';
        }
        updataRender()
        LS.init()
    } catch (e) {

    } finally {
        sgMethods.wxShare();
    }

};

function updataRender() {
    //render
    let _main = document.querySelector('.main');

    ReactDom.render(
        <Index
        />, _main);

}
