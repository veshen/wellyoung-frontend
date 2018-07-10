require('../modules/global.js');
require('../../css/app/privilege.scss');

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
                <div className="user-info-box">
                    <img src=""/>
                    <p className="user-name">XXX</p>
                    <div className="user-integral">积分123</div>
                </div>
                <img className="bottom-pic" src="https://wellyoung-static.oss-cn-shanghai.aliyuncs.com/images/%E6%95%AC%E8%AF%B7%E6%9C%9F%E5%BE%85-1.jpg"/>
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
