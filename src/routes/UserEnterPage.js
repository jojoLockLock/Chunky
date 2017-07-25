/**
 * Created by jojo on 2017/7/25.
 */
import React from 'react';
import { connect } from 'dva';
import styles from './UserEnterPage.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import JoIcon from '../components/JoIcon/JoIcon';
import {Alert} from 'antd';
class Page extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      activeFrame:"login"
    }
  }
  switchFrame=()=>{
    this.setState({
      activeFrame:this.state.activeFrame==="login"?"register":"login"
    })
  }
  getActiveFrame=()=>{
    const {login,register}=this.props;
    const {activeFrame}=this.state;
    if(activeFrame==="login"){
      return (
        <div className={styles["login-modal"]}>
          <LoginForm onSubmit={login}
                     switchFrame={this.switchFrame}/>
        </div>
      )
    }
    if(activeFrame==="register"){
      return (
        <div className={styles["register-modal"]}>
          <RegisterForm onSubmit={register}
                        switchFrame={this.switchFrame}/>
        </div>
      )
    }
  }
  render() {
    return (
      <div className={styles["user-enter"]}>
        <div className={styles["wrap"]}>
          <div style={{paddingTop:"20px",color:"#3db8c1"}}>
            <p style={{fontSize:"50px",textAlign:"center"}}>
              <JoIcon type="pig" />
            </p>
            <h1 style={{fontSize:"24px",textAlign:"center",fontWeight:"100"}}>
              Sign in to Chunky</h1>
          </div>
          {this.getActiveFrame()}
          <Alert message={
            this.state.activeFrame==="login"
              ?
              <p>Don't have account? <a onClick={this.switchFrame}>Go to sign up!</a> </p>
              :
              <p>Already have account? <a onClick={this.switchFrame}>Go to sign in!</a> </p>}
                 style={{padding:"0"}}
                 className={styles["footer-tip"]} />
        </div>
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
