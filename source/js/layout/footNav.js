import React,{Component} from 'react';
import ReactDom from 'react-dom';
import '../../css/layout/footNav.scss';

const FootNav = (props)=>{
    const activePage = props.role;
    return (
        <div className='footNav flex'>
            <div className={activePage=='home'?'active navItem':'navItem'}>
                <a className='flex' href='/wellyoung/index'><i className='icon-home'></i><p>首页</p></a>
            </div>
            <div className={activePage=='cate'?'active navItem':'navItem'}>
                <a className='flex' href='/wellyoung/cateMenu'><i className='icon-cate'></i><p>分类</p></a>
            </div>
            <div className={activePage=='cart'?'active navItem':'navItem'}>
                <a className='flex' href='/wellyoung/cart'><i className='icon-cart'></i><p>购物车</p></a>
            </div>
            <div className={activePage=='uc'?'active navItem':'navItem'}>
                <a className='flex' href='/wellyoung/personal'><i className='icon-my'></i><p>个人中心</p></a>
            </div>
        </div>
    )
}

export default FootNav;
