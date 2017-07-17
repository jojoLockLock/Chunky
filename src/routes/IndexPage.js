import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import ChatFrame from './ChatFrame';
import LoginForm from './LoginForm';
function IndexPage({login,user,initSocket,setSocketConnectState,sendMessage}) {



  return (
    <div className={styles["normal"]}>
      {user.isLogin
        ?
        <ChatFrame className={styles["chat-frame"]}/>
        :
        <div className={styles["login-modal"]}>
          <LoginForm onSubmit={login}/>
        </div>  }


    </div>
  );
}

IndexPage.propTypes = {
};

function mapStateToProps(state) {
  return {
    // userData:state.user,
    user:state.user,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    login:(payload)=>{
      return new Promise((resolve,reject)=>{
        dispatch({
          type:"user/login",
          payload:{
            ...payload,
          },
          resolve,
          reject,
        })
      })
    },
    initSocket:(payload)=>{
      return new Promise((resolve,reject)=>{
        dispatch({
          type:"chat/initSocket",
          payload:{
            ...payload
          },
          resolve,
          reject,
        })
      })
    },
    setSocketConnectState:(isConnect)=>{
      dispatch({
        type:"chat/setSocketConnectState",
        payload:!!isConnect
      })
    },
    sendMessage:(payload)=>{
      return ()=>{
        return new Promise((resolve,reject)=>{
          dispatch({
            type:"chat/sendMessage",
            payload:{
              ...payload,
            },
            resolve,
            reject,
          })
        })
      }
    },
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(IndexPage);
