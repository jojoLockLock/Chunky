/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';
import { connect } from 'dva';
import { Link} from 'dva/router';
import {Button,Spin} from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './HomePage.css';
class AppPage extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <QueueAnim duration={800} animConfig={{ opacity: [1, 0], translateY: [0, 100] }}>
        <div className={styles["app-home"]} key="home">
          <h1>home Page</h1>
        </div>
      </QueueAnim>
    )


  }
}
const select=(state)=>{
  const {log}=state;
  return {
    loading:state.loading.models.log,
    log,
  }
};
export default connect()(AppPage);


const connectSocket=()=> {
  if(this.state.userName.trim().length==0){
    return false;
  }
  let socket = new WebSocket( socketHost);

  this.socket=socket;
  try {
    socket.onopen = (msg)=>{
      socket.send(JSON.stringify({"operaCode":1,"userName":this.state.userName}));
      message.info(`连接成功，您的用户名是${this.state.userName}`,2,);
      this.setState({
        isConnect:true
      })
    };
    socket.onmessage = (msg)=>{
      if (typeof msg.data == "string") {
        message.info(msg.data);
      }
      else {
        message.info("非文本消息");
      }
    };

    socket.onclose = (msg)=> {
      message.warn(msg.data,3);
      this.setState({
        isConnect:false
      })
    };
  }
  catch (ex) {
    message.error(ex,3);
  }
  window.onbeforeunload = ()=> {
    try {
      socket.close();
      socket = null;
    }
    catch (ex) {
    }
  };
};
