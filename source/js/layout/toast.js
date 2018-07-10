/**
 * Created by peiyuanwu_sagreen on 2017/3/7.
 */
require('../../css/layout/toast.scss');

let React=require('react');
let ReactDom=require('react-dom');

class Toast extends React.Component {
    constructor(props){
        super(props);
        this.state={
            callback:props.callback
        };
    }

    componentDidMount(){
        let _toast=document.querySelector('.toast');
        if(_toast.className.search('active')<=0){
            setTimeout(()=>{
                _toast.style.borderRadius=_toast.clientHeight+'px';
                _toast.className='toast active';
                setTimeout(()=>{
                    _toast.className='toast';
                    if(typeof this.state.callback=='function'){
                        this.state.callback();
                    }
                },this.props.delay)
            },1);
        }
    }

    render(){
        return(
            <div className="toast">
                {
                    this.props.msg.map((obj,i)=>{
                        return <p key={i}>{obj}</p>
                    })
                }
            </div>
        )
    }

}

let _Toast={};
_Toast.msg=(msg,delay,callback)=>{
    if(!document.querySelector('.toast_layout')){
        //creat address dom
        let _address=document.createElement('div');
        _address.className='toast_layout';
        document.body.appendChild(_address);
    }else{
        document.querySelector('.toast_layout').innerHTML='';
    }

    ReactDom.render(
        <Toast msg={msg} delay={delay} callback={callback}/>,
        document.querySelector('.toast_layout')
    );


};

module.exports=_Toast;