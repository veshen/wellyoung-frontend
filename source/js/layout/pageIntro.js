import React,{Component} from 'react';
import ReactDom from 'react-dom';
import '../../css/layout/pageIntro.scss';

const PageIntro = (props)=>{
    return (
        <div className='pageIntro'>
            <div className='title'>
                <div className='slogan'>WELL YOUNG</div>
                <div className='txt flex'>
                    <div className='orna'></div>
                    <div className=''>{props.title}</div>
                    <div className='orna'></div>
                </div>
            </div>
            <div className='desc'>{props.desc}</div>
        </div>
    )
}

export default PageIntro;
