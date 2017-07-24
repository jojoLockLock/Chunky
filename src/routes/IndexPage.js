import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import ChatFrame from './ChatFrame';
import LoginForm from './LoginForm';
import {Button} from 'antd';

class IndexPage extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      loading:{
        login:false,
        register:false,
      }
    }
  }
  getStateHandle=(stateType)=>{
    return (type,value)=>{
      return ()=>{
        this.setState({
          [stateType]:{
            ...this.state[stateType],
            [type]:value,
          }
        })
      }
    }
  }
  loginHandle=(payload)=>{
    this.props.login&&this.props.login(payload)
      .then(result=>{

      })
      .catch(msg=>{

      })
  }
  render() {
    const {user,login}=this.props;
    return (
      <div className={styles["normal"]}>
        {user.isLogin
          ?
          <ChatFrame className={styles["chat-frame"]}/>
          :
          <div className={styles["login-modal"]}>
            <LoginForm onSubmit={login}/>
          </div>  }
          <Button onClick={this.props.logout}>LOG OUT</Button>

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
        })
      })
    }

  }
}
export default connect(mapStateToProps,mapDispatchToProps)(IndexPage);
