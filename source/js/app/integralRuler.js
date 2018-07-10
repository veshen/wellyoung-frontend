require('../modules/global.js');
require('../../css/app/integralRuler.scss');

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
                <ul className="integral-ruler-list">
                    <li>
                        <h3>Q:如何获取积分？</h3>
                        <p>A:您在未央花房消费的金额均可累计积分</p>
                    </li>
                    <li>
                        <h3>Q:积分获取规则？</h3>
                        <p>A:实际支付人民币1元即可获取1个积分，不足1元的金额将四舍五入计算。</p>
                    </li>
                    <li>
                        <h3>Q:积分何时到账？</h3>
                        <p>A:积分将在您的订单完成配送后计入您的个人账户</p>
                    </li>
                    <li>
                        <h3>Q:积分有什么用途？</h3>
                        <p>A:未央花房即将全面升级会员体系，届时将推出详细细则，敬请期待！</p>
                    </li>
                </ul>
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
    }

};

function updataRender(res) {
    //render
    let _main = document.querySelector('.main');

    ReactDom.render(
        <Index
        />, _main);

}
