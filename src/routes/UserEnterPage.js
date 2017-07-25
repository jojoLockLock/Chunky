/**
 * Created by jojo on 2017/7/25.
 */
import React from 'react';
import { connect } from 'dva';
import styles from './UserEnterPage.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import JoIcon from '../components/JoIcon/JoIcon';
import {Alert,Spin} from 'antd';
import QueueAnim from 'rc-queue-anim';
import classnames from 'classnames';
class Page extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      activeFrame:"login",
      errorMessage:null,
      shakeModal:false,
      loading:false,
    }
  }
  switchFrame=()=>{
    this.setState({
      errorMessage:null,
      activeFrame:this.state.activeFrame==="login"?"register":"login",
      loading:false,
    })

  }
  getActiveFrame=()=>{
    const {login,register}=this.props;
    const {activeFrame,errorMessage,shakeModal,loading}=this.state;
    if(activeFrame==="login"){
      const classes=classnames({
        [styles["login-modal"]]:true,
        "animated":shakeModal,
        "shake":shakeModal
      })
      return (
          <div className={classes} key="modal" >
            <Spin spinning={loading}>
              <LoginForm onSubmit={this.loginHandle}/>
            </Spin>
          </div>
      )
    }
    if(activeFrame==="register"){
      const classes=classnames({
        [styles["register-modal"]]:true,
        "animated":shakeModal,
        "shake":shakeModal
      })
      return (
          <div className={classes} key="modal" >
            <Spin spinning={loading}>
              <RegisterForm onSubmit={this.registerHandle}/>
            </Spin>
          </div>
      )
    }
  }
  getFooterTip=()=>{
    const message=this.state.activeFrame==="login"
      ?
      <p>Don't have account? <a onClick={this.switchFrame}>Go to sign up!</a> </p>
      :
      <p>Already have account? <a onClick={this.switchFrame}>Go to sign in!</a> </p>

    return (
      <Alert key="footer-tip"
             message={message}
             style={{padding:0}}
             className={styles["footer-tip"]}/>
    )
  }
  getErrorMessage=()=>{
    const {errorMessage}=this.state;
    return errorMessage
            ?
            <Alert message={errorMessage}
                   onClose={()=>setTimeout(()=>{
                     this.setState({errorMessage:null})
                   },200)}
                   closable={true}
                   style={{margin:"10px 0"}}
                   type="error"/>
            :null

  }
  loginHandle=(payload)=>{
    this.setState({
      loading:true,
    })

    this.props.login(payload)
      .then(result=>{

      })
      .catch(msg=>{
        this.setState({
          errorMessage:msg,
          shakeModal:true
        })
        this.resetShakeModal()

      })
      .then(result=>{
        this.setState({
          loading:false
        })
      })
  }
  registerHandle=(payload)=>{
    this.setState({
      loading:true,
    })
    this.props.register(payload)
      .then(result=>{

      })
      .catch(msg=>{
        this.setState({
          errorMessage:msg,
          shakeModal:true
        })
        this.resetShakeModal()
      })
      .then(result=>{
        this.setState({
          loading:false
        })
      })
  }
  resetShakeModal=()=>{
    setTimeout(()=>{
      this.setState({
        shakeModal:false,
      })
    },500);
  }
  render() {
    return (
      <div className={styles["user-enter"]}>
        <QueueAnim type="bottom" duration={1000} className={styles["wrap"]}>
          <p key="logo" style={{fontSize:"50px",textAlign:"center",color:"#3db8c1"}}>
            <JoIcon type="pig" />
          </p>
          <h1 key="title" style={{fontSize:"24px",textAlign:"center",fontWeight:"100"}}>
            Sign in to Chunky
          </h1>
          {this.getErrorMessage()}
          {this.getActiveFrame()}
          {this.getFooterTip()}
        </QueueAnim>
      </div>
    )
  }

}


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
    logout:()=>{
      return new Promise((resolve,reject)=>{
        dispatch({
          type:"user/logout",
          resolve,
          reject,
        })
      })
    },
    register:(payload)=>{
      return new Promise((resolve,reject)=>{
        dispatch({
          type:"user/register",
          payload:{
            ...payload
          },
          resolve,
          reject,
        })
      })
    }

  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Page);
