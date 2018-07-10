import React, {Component} from 'react';
import ReactDom from 'react-dom';
import '../../css/layout/swiperBanner.scss';

let Swiper = require('../modules/swiper-4.2.0.min');
require('../../css/global/swiper-4.2.0.min.css');

class SwiperBanner extends Component {
    constructor(props){
        super(props);
        this.state = {
            banners:props.data
        }
    }
    componentDidMount() {
        var mySwiper = new Swiper ('.swiper-container', {
            direction: 'horizontal',
            loop: true,
            autoplay:true,
            pagination: {
              el: '.swiper-pagination',
              bulletClass: 'my-bullet',
              bulletActiveClass: 'my-active-bullet'
            },
        })
    }
    render(){
        const {banners} = this.state;
        return (
            <div className="swiper-container">
                <div className="swiper-wrapper">
                    {
                        banners.map((item,index)=>{
                            return(
                                <div key={index} className="swiper-slide"><img src={item.url}/></div>
                            )
                        })
                    }
                </div>
                <div className="swiper-pagination"></div>
            </div>
        )
    }
}

export default SwiperBanner;
