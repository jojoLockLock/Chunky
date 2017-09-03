import React from 'react';
import { connect } from 'dva';
import styles from './IndexPage.css';
import ChatFrame from '../modules/ChatFrame/ChatFrame';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import {Button} from 'antd';
import JoIcon from '../components/JoIcon/JoIcon';
import UserEnterPage from './UserEnterPage';
import classnames from 'classnames';
class IndexPage extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      loading:{
        login:false,
        register:false,
      },
      activeFrame:"login"
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
  render() {
    const {user}=this.props;

    const chatFrameClasses=classnames({
      [styles["chat-frame"]]:true,
      ["animated"]:true,
      ["fadeIn"]:true,
    })

    return (
      <div className={styles["normal"]}>
        {user.isLogin
          ?
          <ChatFrame className={chatFrameClasses}/>
          :
          <UserEnterPage/> }

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
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(IndexPage);
