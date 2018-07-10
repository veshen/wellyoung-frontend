/**
 * Created by peiyuanwu_sagreen on 2017/3/7.
 */
require('../../css/layout/dialog.scss');

let React=require('react');
let ReactDom=require('react-dom');
let sgMethods=require('../modules/sgMethods.js');

let _DiaLog={};
class DiaLog extends React.Component {
    constructor(props){
        super(props);
        this.state={
            title:this.props.config.title,
            content : this.props.config.content,
            liType : this.props.config.liType?this.props.config.liType:"",
            closeBtnCallBack:this.props.closeBtnCallBack||function(){}
        };
    }

    componentWillMount(){
    }

    componentDidMount(){
            this.show();
    }

    show(){
        // sgMethods.scrollSwitch(false)
    }
    close(e){
        let _box=document.querySelector('.diaLogPop');
        let _innerBox=document.querySelector('.diaLogContent');
        _box.style.display='none';
        // sgMethods.scrollSwitch(true)
    }
    render() {
        const itemData = this.state.content;
        var   itemDom  = [];
        for (let items of itemData) {
            itemDom.push(
                <li className={this.state.liType} key={items}>{items}</li>
            )
        }

        return(
            <section className="diaLogPop">
                <div className="diaLogContent">
                    <h3>{this.state.title}</h3>
                    <ul>
                        {itemDom}
                    </ul>
                    <div className="diaLogBtn" onTouchStart={this.close.bind(this)}>知道了</div>
                </div>
            </section>
        )
}


}


_DiaLog.showDiaLog=function(config,cancelCallback){
    if(!document.querySelector('.dialog_layout')){
        let _diaLog=document.createElement('div');
        _diaLog.className='dialog_layout';
        document.body.appendChild(_diaLog);
    }else{
        document.querySelector('.dialog_layout').innerHTML='';
    }
    ReactDom.render(
        <DiaLog
            cancelCallback={cancelCallback}
            config={config}
        />,
        document.querySelector('.dialog_layout')
    );

}

module.exports=_DiaLog;
