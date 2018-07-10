require('../modules/global.js');
require('../../css/app/integral.scss');

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
            points : props.data.points,
            user : props.data.user
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
        const {points,user} = this.state;
        return (
            <div className="container">
                <div className="integral-header">
                    <div className="content">
                        <span>当前积分</span>
                        <em>{user.point}</em>
                    </div>
                    <a onClick={()=>{
                        window.location.href = "/wellyoung/integralRuler"
                    }}>积分规则</a>
                </div>
                <div className="title-box">积分记录</div>
                <ul className="integral-list">
                    {
                        points.map((item,index)=>{
                            return(
                                <li className="integral-item" key={index}>
                                    <div className="integral-item-left">
                                        <h3>{item.action}</h3>
                                        <p>{item.time}</p>
                                    </div>
                                    <div className="integral-item-right">
                                        <b>+</b><span>{item.point}</span>
                                    </div>
                                </li>
                            )
                        })
                    }
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
        const res = await api.getPointlogs();


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
        data = {res}
        />, _main);

}
