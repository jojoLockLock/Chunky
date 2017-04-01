/**
 * Created by Administrator on 2017/3/31.
 */
import React from 'react';
import {Link} from 'dva/router';
import styles from './Header.css';
import {Popconfirm} from 'antd';
import QueueAnim from 'rc-queue-anim';
const Header=({logoutHandle,userName})=>{
  
  
  return (
    <div className={styles['app-header']}>
        <QueueAnim animConfig={{ opacity: [1, 0], translateX: [0,500] }}
                   component="ul"
                   className={styles.nav}
                   delay={300}>
          <li key="home"><Link to="/home">Home</Link></li>
          <li key="404"><Link to="/404">404</Link></li>
          <li key="logout">
            <Popconfirm onConfirm={logoutHandle} title={"确定退出？"}>
              <a>Logout</a>
            </Popconfirm>
          </li>
          <li key="userName">
            {userName}
          </li>
        </QueueAnim>
    </div>
  )
};


export default Header;

