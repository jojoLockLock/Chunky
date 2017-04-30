/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';
import { connect } from 'dva';
import { Link} from 'dva/router';
import {Button,Spin,message as Message,Row,Col} from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './HomePage.css';


import ChatModal from './ChatModal';
//message 与组件名字冲突！！！！！！！！！！！

class HomePage extends React.Component{
  constructor(props) {
    super(props);


  }

  render() {

    return (
      <QueueAnim duration={800} animConfig={{ opacity: [1, 0], translateY: [0, 100] }}>
        <div className={styles["app-home"]} key="home">
            <ChatModal/>
        </div>
      </QueueAnim>
    )


  }

}

export default connect()(HomePage);




