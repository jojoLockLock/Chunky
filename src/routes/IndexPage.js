import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import ChatModal from './ChatFrame';
function IndexPage({login,userData,initSocket,setSocketConnectState,sendMessage}) {


  return (
    <div className={styles.normal}>
      <ChatModal/>
    </div>
  );
}

IndexPage.propTypes = {
};

function mapStateToProps(state) {
  return {
    // userData:state.user,
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
