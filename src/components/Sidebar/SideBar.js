/**
 * Created by Administrator on 2017/4/7.
 */
import React from 'react';
import styles from './SideBar.css';
import classnames from 'classnames';
import {Input,Button} from 'antd';
import QueueAnim from 'rc-queue-anim';
import ReactDOM from 'react-dom';
const SideBar=({children,activeKey})=>{

    return(
      <ul className={styles['side-bar']}>
        {children.map((child,index)=>{
          let props=child.props;
          if(activeKey.indexOf(child.key)!=-1){
            props={...props,isActive:true};
          }
          return <Item {...props} key={child.key}/>
        })}
      </ul>
    )
};
const {PropTypes} =React;
SideBar.propTypes={
  activeKey:PropTypes.arrayOf(PropTypes.string)
};
const Item=({children,isActive,onClick})=>{
    const classes=classnames({
      [styles['active']]:isActive,
      [styles['side-bar-item']]:true
    });
    return (
      <li className={classes} onClick={onClick}><span className={styles['item-content']}>{children}</span></li>
    )
};
SideBar.Item=Item;
export default SideBar;
