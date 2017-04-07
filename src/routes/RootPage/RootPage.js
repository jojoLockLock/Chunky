/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';

import { connect } from 'dva';
import {Button,Spin,message} from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './RootPage.css';
import LoginModal from './LoginModal';
import Header from './Header';
import {GLOBAL_MSG_DURATION} from '../../config/componentConfig';
import {getTemp} from '../../utils/tools';

class RootPage extends React.Component{
  constructor(props) {
    super(props);
    this.dispatch=props.dispatch;
  }
  loginHandle=(userData)=>{
    this.dispatch({type:'log/login',payload:userData});
  };
  logoutHandle=()=>{
    this.dispatch({type:'log/logout'});
    message.info("退出登录成功",GLOBAL_MSG_DURATION);
    window.sessionStorage.clear();
  };
  componentDidMount=()=>{
    let loginData=getTemp('loginData');
    if(loginData!==null){
        this.dispatch({type:'log/sessionLogin',payload:loginData});
    }
    
  };
  render() {
    const {loading=false,log,children}=this.props;
    const {loginHandle,logoutHandle} =this;
    return <div className={styles.root}>
      <QueueAnim duration={800}
                 animConfig={{ opacity: [1, 0], translateY: [0, 100] }}>
        {
          log.isLogin
            ?
            <div key="app" className={styles.app}>
              <Header logoutHandle={logoutHandle} userName={log.loginData.userName}/>
              <div className={styles['app-body']}>
                {children}
              </div>
            </div>
            :
            <div key="login" className={styles.login}>
              <LoginModal loading={loading}
                          loginHandle={loginHandle}/>
            </div>
        
        }
      </QueueAnim>
    </div>
  }
}
const select=(state)=>{
  const {log}=state;
  return {
    loading:state.loading.models.log,
    log,
  }
};

export default connect(select)(RootPage);
