/**
 * Created by peiyuanwu_sagreen on 2017/2/28.
 */
require('../../css/layout/floatPanle.scss');

let React=require('react');
let sgMethods=require('../modules/sgMethods.js');


//floatPanel
class FloatPanel extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:this.props.show,
            position:this.props.position||''
        }
    }
    componentDidMount(){
        if(this.state.show){
            setTimeout(()=>{
                document.querySelector('.float_panel').className='float_panel show '+this.state.position;
                document.querySelector('.show').style.pointerEvents='auto'
            },100);
        }
    }
    bgClose(e){
        if((this.props.bgClose&&e.nativeEvent.target.className.search('float_panel')>=0)||this.props.allClose){
            this.closePanel(e);
        }
    }
    closePanel(e){
        let _self=this;
        sgMethods.touchClick(e.nativeEvent,()=>{
            document.querySelector('.float_panel').className='float_panel '+ this.state.position;
            _self.props.closeBtnCallBack();
            setTimeout(()=>{
                document.querySelector('.float_panel').style.pointerEvents='none'
            },500);
        });
    }
    render(){

        return(
            <div className={"float_panel "+this.state.position} onTouchStart={this.bgClose.bind(this)}>
                <div className="float_panel_inner" style={this.props.panelStyle} >
                    <i onTouchStart={this.closePanel.bind(this)} className="icon-close" style={this.props.closeBtnStyle}></i>
                    {this.props.body}
                </div>

            </div>
        )
    }
}

module.exports=FloatPanel;
