require('../modules/global.js');
require('../../css/app/addAddress.scss');
let loading = require('../layout/loading.js');
let rotateLoading = require('../layout/rotateLoading.js');
loading.ready();
let React = require('react');
let ReactDom = require('react-dom');
let sgMethods = require('../modules/sgMethods.js');
let LS = require('../modules/localstorage.js');
let Toast = require('../layout/toast.js');
let DiaLogConfirm = require('../layout/diaLogConfirm');
let api = require('../modules/api.js');
let wx = require('weixin-js-sdk');

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address : "",
            phone: "",
            receiver: "",
            tag : "",
            is_default: true,
            area : "",
            late : 0,
            long : 0,
            city_name : "",
            selectMap : false,
            phoneNumberCheck : false,
            activeAddressInfo : true,
        }
    }
    componentWillMount(){

    }
    componentDidMount(){
        let This = this;
        window.addEventListener('message', function(event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
            var loc = event.data;
            if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
              console.log('location', loc);
              This.selectMapAddress(loc)
            }
        }, false);
        const addressInfo = this.props.addressInfo?this.props.addressInfo.address: false;
        if (addressInfo) {
            let state = this.state;
            for (var attr in addressInfo) {
                state[attr] = addressInfo[attr];
            }
            state.phoneNumberCheck = true;
            state.activeAddressInfo = true
            this.setState(state);
            document.getElementById("userName").value=state.receiver;
            document.getElementById("mobileNo").value=state.phone;
            document.getElementById("addressInfo").value=state.address;
        }
    }
    chooseTag(val) {
        if (val!==this.state.tag) {
            this.setState({tag:val});
        }else{
            this.setState({tag:""});
        }

    }
    setContactName(e){
        let name = e.target.value;
        this.setState({receiver:name});
    }
    setContactNo(e){
        let mobileNo = e.target.value;
        if(mobileNo.length===11){
            this.setState({phoneNumberCheck : true,phone:mobileNo});
        }else{
            this.setState({phoneNumberCheck : false})
        }
    }
    setDefaultAddr(){
        let is_default = !this.state.is_default;
        this.setState({
            is_default
        })
    }
    selectMap(){
        this.setState({selectMap:true})
    }
    setAddressInfo(e){
        let address = e.target.value;
        this.setState({address})
    }
    hideSelectMap(){
        this.setState({selectMap:false})
    }
    async saveAddr(){
        try {
            const {address, phone, receiver, tag, is_default, area, late, long, city_name, phoneNumberCheck, activeAddressInfo} = this.state;
            if (receiver==="") {
                Toast.msg(["请输入联系人姓名"],2000);
                return;
            }
            if (phoneNumberCheck===false) {
                Toast.msg(["请输入正确的电话号码"],2000);
                return;
            }
            if (late==0||long==0) {
                Toast.msg(["请选择您的地址"],2000);
                return
            }
            if (address===""&&activeAddressInfo) {
                Toast.msg(["请输入您的详细地址"],2000);
                return
            }

            const obj = {address, phone, receiver, tag, is_default, area, late, long, city_name};
            console.log(obj);
            let addressId = sgMethods.urlParmKey('addressId')||false;
            if (addressId) {
                const res = await api.updataAddress({"addressId":addressId},obj);
                Toast.msg([res.message],2000,()=>{
                    window.location.href = "/wellyoung/address";
                });
            }else{
                const res = await api.addAddress(obj);

                console.log(res);

                let returnUrl = sgMethods.urlParmKey('returnUrl') || false;
                if (returnUrl) {
                    let backHref = decodeURIComponent(returnUrl);
                    window.location.href = backHref;
                }else{
                    Toast.msg([res.message],2000,()=>{
                        window.location.href = "/wellyoung/address";
                    });

                }
            }

        } catch (e) {
            console.log(e);
        }
    }
    async selectMapAddress(loc){
        try {
            if (loc.latlng) {
                var long = loc.latlng.lng;
                var late = loc.latlng.lat;
            }else{
                return;
            }
            this.setState({
                area : loc.poiaddress,
                city_name : loc.cityname,
                selectMap : false,
                late,
                long,
            });
        } catch (e) {
            console.log(e.name+e.message);
        }
    }
    render() {
        return (
            <div>
                <ul className="addressMain">
                    <li>
                        <div className="title">联系人</div>
                        <div className="content">
                            <div className="nameText">
                                <input id="userName" onChange={this.setContactName.bind(this)} placeholder="姓名" type="text"/>
                            </div>
                        </div>
                    </li>
                    <li className="m-b">
                        <div className="title">手机号码</div>
                        <div className="content">
                            <input className="mobileNo" id="mobileNo" placeholder="手机号码" onChange={this.setContactNo.bind(this)} type="text"/>
                        </div>
                    </li>
                    <li>
                        <div className="title">所在地区</div>
                        <div className="content">
                            <div className="nameText addressInfo"  onClick={this.selectMap.bind(this)}>
                                {
                                    this.state.area&&this.state.area!==""?
                                    <h3>{this.state.area}</h3>
                                    :<p>选择收货地址</p>
                                }
                                <span className="icon-right-blod"></span>
                            </div>
                        </div>
                    </li>
                    <li className="m-b">
                        <div className="title">详细地址</div>
                        <div className="content">
                            <div className={this.state.activeAddressInfo?"chooseContent":"hide"}>
                                <input className="mobileNo" id="addressInfo" onChange={this.setAddressInfo.bind(this)} placeholder="请输入" type="text"/>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="title">标签</div>
                        <div className="content">
                            <div className="chooseContent">
                                <div onClick={this.chooseTag.bind(this,'公司')} className={this.state.tag==='公司'?'cur':''}>公司</div>
                                <div onClick={this.chooseTag.bind(this,'家')} className={this.state.tag==='家'?'cur':''}>家</div>
                                <div onClick={this.chooseTag.bind(this,'礼物')} className={this.state.tag==='礼物'?'cur':''}>礼物</div>
                            </div>
                        </div>
                    </li>
                    <li className="setDefault">
                        <div className="title">设为默认</div>
                        <div className="content">
                            <span onClick={this.setDefaultAddr.bind(this)} className={this.state.is_default
                                ? "item-toggle active"
                                : "item-toggle"}>
                                <em></em>
                            </span>
                        </div>
                    </li>
                </ul>
                <div onClick={this.saveAddr.bind(this)} className="saveBtn">保 存 地 址</div>
                {
                    this.state.selectMap?
                    <div id="mapBox">
                        <iframe id="mapPage" width="100%" height="100%"
                            src="http://apis.map.qq.com/tools/locpicker?search=1&type=1&key=UMQBZ-PJBK5-LAQI3-QCTY7-ITKDT-YTFOV&referer=myapp">
                            {/*src="http://apis.map.qq.com/tools/locpicker?search=1&type=1&key=4T6BZ-H2AHP-D4FDR-VQGHC-NGQG3-6LBOO&referer=myapp">*/}
                        </iframe>
                    </div>
                    :null
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
    let addressId = sgMethods.urlParmKey('addressId')||false;
    var res;
    if (addressId) {
        res = await api.getAddressInfo({"addressId":addressId});
        console.log(res);
    }

    updataRender(res)
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
    ReactDom.render(
        <Index
            addressInfo={res}
            />, _main);

}
