require('../../css/layout/addressSelect.scss');

let React=require('react');
let ReactDom=require('react-dom');
let sgMethods=require('../modules/sgMethods.js');
let api=require('../modules/api.js');
let LS=require('../modules/localstorage.js');
let DiaLogConfirm       = require('../layout/diaLogConfirm');

let _AddressSelect={};
class AddressSelect extends React.Component {
    constructor(props){
        super(props);
        this.state={
            list:[],
            listNum:3,
            closeBtnCallBack:this.props.closeBtnCallBack||function(){},
            selectCallback:this.props.selectCallback||function(){},
        };

            api.getAddressAll().then(async (res)=>{
                const obj = res.addresses;
                if (obj.length===0) {
                    const res = await DiaLogConfirm.ready("你还没有收货地址 是否添加？",true);
                    if (res) {
                        let url = window.location.pathname + window.location.search;
                        location.href='/vpage/addAddress?returnUrl='+encodeURIComponent(url);
                    }else{
                        return;
                    }
                }
                this.setState({list:obj,listNum:Math.min(3,obj.length)});
                LS.setItem('addressList',JSON.stringify(obj));
                LS.setItem('addressListTime',new Date().getTime());

            });

    }

    componentWillMount(){
    }

    componentDidMount(){
            this.show();
    }

    show(){
        if(!this.state.list){
            setTimeout(()=>{
                this.show();
            },100)
        }else{

            let _self=this;
            //let _html=document.querySelector('html');
            //let _body=document.body;
            let _box=document.querySelector('.address_select');
            let _innerBox=document.querySelector('.address_select_inner');
            setTimeout(function(){
                //list height
                let _item=document.querySelectorAll('.address_select_item');
                let _list=document.querySelector('.address_select_list');
                let _listHeight=((_item[0]&&_item[0].clientHeight)||0)*_self.state.listNum;

                if(_item.length==0){
                    _self.show();
                    return false;
                }

                _list.style.height=_listHeight+'px';
                _box.style.transition='opacity 0.3s';
                _innerBox.style.transition='bottom 0.3s  0.3s';

                //_html.style.overflowY='hidden';
                //_body.style.overflowY='hidden';
                //_html.style.height='100%';
                //_body.style.height='100%';


                _box.className='address_select active';
            },300);
        }
    }

    bgClose(e){
        let _e=e.nativeEvent;
        if(this.props.bgClose&&e.nativeEvent.target.className.search('address_select')>=0){
            if(_e.target.className.search('address_select')>=0&&_e.target.className.search('address_select_')<0){
                this.close(e);
            }
        }
    }

    close(e){
        sgMethods.touchClick(e.nativeEvent,()=>{
            this.closeAction();
        });
    }
    closeAction(){
        //let _html=document.querySelector('html');
        //let _body=document.body;
        let _box=document.querySelector('.address_select');
        let _innerBox=document.querySelector('.address_select_inner');
        _box.style.transition='opacity 0.3s 0.3s';
        _innerBox.style.transition='bottom 0.3s';
        //_html.style.overflowY='auto';
        //_body.style.overflowY='auto';
        //_html.style.height='auto';
        //_body.style.height='auto';

        _box.className='address_select';
        this.state.closeBtnCallBack();
    }
    selectAddress(i,e){
        let _e=e.nativeEvent;
        sgMethods.touchClick(e.nativeEvent,()=>{
            if(_e.target.className.search('icon-edit')<0){
                this.state.selectCallback(this.state.list[i],i);
                this.closeAction();
            }
        });
    }
    goAdd(){
        let url = window.location.pathname + window.location.search;
        location.href='/wellyoung/addAddress?returnUrl='+encodeURIComponent(url);
    }
    goEdit(id,e){
    }
    render() {
        let _list=[];
        if(!this.state.list){
            this.state.list=[];
        }
        if(this.props.selectId){
            this.state.list.map((item)=>{
                if(this.props.selectId==item.id){
                    _list.push(item);
                }
            });
            this.state.list.map((item)=>{
                if(this.props.selectId!=item.id){
                    _list.push(item);
                }
            });
        }else{
            _list=this.state.list;
        }
        this.state.list=_list;//赋值返回给select使用

        return(
            <div className="address_select" onTouchStart={this.bgClose.bind(this)}>
                <div className="address_select_inner">
                    <div className="address_select_head">
                        <div className="address_select_head_left">收货地址</div>
                        <div className="address_select_head_right" onTouchStart={this.close.bind(this)}>
                            <i className="icon-down"></i>
                        </div>
                    </div>

                    <div className="address_select_body">
                        <div className="address_select_list">
                            {
                                _list.map((item,index)=>{

                                    let _select='';
                                    if(this.props.selectId==item.id){
                                        _select=<i className="icon-select"></i>
                                    }

                                    return <div onTouchStart={this.selectAddress.bind(this,index)} key={index} data-id={item.idStr} className="address_select_item" >
                                        <div className="address_select_item_left">
                                            <i onTouchStart={this.goEdit.bind(this,item.idStr)} className="icon-edit"></i>
                                        </div>
                                        <div className="address_select_item_center">
                                            <div className="address_select_item_info">
                                                <span className="address_select_item_name">{item.receiver}</span>
                                                <span  className="address_select_item_phone">{item.phone}</span>
                                                <span className="address_select_item_tag">{item.tag}</span>
                                            </div>
                                            <div className="address_select_item_address">
                                                <span className="address_select_item_area">{item.area}</span>
                                            </div>
                                        </div>
                                        <div className="address_select_item_right">
                                            {_select}
                                        </div>
                                    </div>

                                })
                            }
                        </div>
                        <div onClick={this.goAdd} className="address_select_list_add">
                            <i className="icon-address icon-add"></i>
                            添加收货地址
                        </div>
                    </div>
                </div>
            </div>
        )
}


}


_AddressSelect.showAddress=function(id,selectCallback,obj){
    if(!document.querySelector('.address_select_layout')){
        //creat address dom
        let _address=document.createElement('div');
        _address.className='address_select_layout';
        document.body.appendChild(_address);
    }else{
        document.querySelector('.address_select_layout').innerHTML='';
    }
    ReactDom.render(
        <AddressSelect
            selectCallback={selectCallback}
            selectId={id}
            bgClose={true}
            parame={obj}
        />,
        document.querySelector('.address_select_layout')
    );

}

module.exports=_AddressSelect;
