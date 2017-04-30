/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';
import classnames from 'classnames';
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
    window.sessionStorage.clear();
    this.dispatch({type:'log/logout'});
    message.info("退出登录成功",GLOBAL_MSG_DURATION);
  };
  componentDidMount=()=>{
    //Uncaught (in promise) undefined  自动登录时 异常 未解决
      let loginData=getTemp('loginData'),
          activeChat=getTemp('activeChat');

      if(loginData!==null){
        this.dispatch({type:'log/sessionLogin',payload:loginData});
      }

      if(activeChat!==null){
        this.dispatch({type:'chat/setActiveChat',payload:{activeChat}});
        this.dispatch({type:"chat/getChatRecordsAll"});
      }

  };
  render() {
    const {loading=false,log,children}=this.props;
    const {loginHandle,logoutHandle} =this;
    const {userData={}}=log.loginData;

    return <div className={styles.root}>
      <QueueAnim duration={800}
                 animConfig={{ opacity: [1, 0], translateY: [0, 100] }}>
        {
          log.isLogin
            ?
            <div key="app" className={styles.app}>
              <Header logoutHandle={logoutHandle} userName={userData.userName}/>
              <div className={styles['app-body']}>
                {children}
              </div>
            </div>
            :
            <div key="login" className={classnames({
              [styles['login']]:true,
              ['vertical-projection']:true
            })}>
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
