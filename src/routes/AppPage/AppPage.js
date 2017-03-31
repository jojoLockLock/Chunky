/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';
import { connect } from 'dva';
import { Link} from 'dva/router';
import {Button,Spin} from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './AppPage.css';
const AppPage=()=>{
  
  return (
    <QueueAnim duration={800} animConfig={{ opacity: [1, 0], translateY: [0, 100] }}>
      <div className={styles.app} key="app">
          <h1>App Page</h1>
      </div>
    </QueueAnim>
  )
      
      
  
};
const select=(state)=>{
  const {log}=state;
  return {
    loading:state.loading.models.log,
    log,
  }
};
export default connect()(AppPage);
