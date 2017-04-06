/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';
import { connect } from 'dva';
import { Link} from 'dva/router';
import {Button,Spin,message} from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './HomePage.css';
import ChatBox from '../../components/ChatBox/ChatBox';
import {socketHost} from '../../config/apiConfig';
//message 与组件名字冲突！！！！！！！！！！！
const ChatMessage =ChatBox.ChatMessage;
class AppPage extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      text:"",
      messages:[]
    };

  }
  componentDidMount=()=>{
    this.linkToSocket();
  };
  componentWillReceiveProps=(nextProps)=>{
    // console.info('...');
  };
  messageOnChange=(e)=>{
    this.setState({
      text:e.target.value
    })
  };
  sendMessage=(e)=>{
    const {text,messages}=this.state;

    if(text==''){
      return;
    }
    messages.push({
      content:text,
      type:'right',
    });
    this.socket.send(JSON.stringify({'operaCode':2,content:text}));
    setTimeout(()=>{
      this.setState({
        text:"",
        messages,
      });
    },0)
  };
  linkToSocket=()=>{
    let socket = new WebSocket( socketHost);
    this.socket=socket;
    try {
      socket.onopen = (msg)=>{
        socket.send(JSON.stringify({"operaCode":1,"userName":this.props.log.loginData.userName}));
      };
      socket.onmessage = (msg)=>{
        if (typeof msg.data == "string") {
          const {messages} =this.state;
          let res=JSON.parse(msg.data);
          if(res['responseCode']==3){
            messages.push({
              content:res.content,
              type:'left',
            });
            this.setState({
              messages,
            })
          }
        }
        else {
          message.info("非文本消息");
        }
      };

      socket.onclose = (msg)=> {
        message.warn(msg.data,3);
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
  render() {
    const {messages} = this.state;
    console.info(messages);
    return (
      <QueueAnim duration={800} animConfig={{ opacity: [1, 0], translateY: [0, 100] }}>
        <div className={styles["app-home"]} key="home">
          <h1>home Page</h1>
          <ChatBox onChangeHandle={this.messageOnChange}
                   sendHandle={this.sendMessage}
                   text={this.state.text}
                   title={"Chat with..."}
          >
              {messages.map((msg,index)=>
                <ChatMessage type={msg.type} key={`message${index}`}>{msg.content}</ChatMessage>
              )}
          </ChatBox>
        </div>
      </QueueAnim>
    )


  }
}
const select=(state)=>{
  const {log,message}=state;
  return {
    loading:state.loading.models.log,
    log,
    message,
  }
};

export default connect(select)(AppPage);




