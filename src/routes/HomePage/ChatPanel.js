/**
 * Created by JoJo on 2017/4/29.
 */
import React from 'react';
import styles from './ChatPanel.css';
import classnames from 'classnames';
import {Input,Button,Row,Col,message as Message} from 'antd';
import QueueAnim from 'rc-queue-anim';
import ReactDOM from 'react-dom';
import {socketHost} from '../../config/apiConfig';
import {GLOBAL_MSG_DURATION} from '../../config/componentConfig';
import ChatBox from '../../components/ChatBox/ChatBox';
import SideBar from '../../components/Sidebar/SideBar';
import socket from '../../services/socket'
const ChatMessage =ChatBox.ChatMessage;
const SideBarItem=SideBar.Item;
import { connect } from 'dva';
class ChatPanel extends React.Component{
  constructor(props){
    super(props);
    this.state={
      text:"",
      isConnect:false,
      messages:[
      ]
    };
  }
  getChangeActiveChat=(activeChat)=>{
    return ()=>{
      this.props.dispatch({type:"chat/setActiveChat",payload:{activeChat}})
      this.getChatRecords(activeChat.userAccount);
    }
  };
  getChatRecords=(targetAccount)=>{
    this.props.dispatch({type:"chat/getChatRecords",payload:{targetAccount}});
  };
  componentDidMount=()=>{
    this.linkToSocket();
  };
  componentWillUnmount=()=>{
    this.socket.onclose=null;
    this.closeLink();
  };
  componentWillReceiveProps=(nextProps)=>{

  };
  shouldComponentUpdate=(nextProps)=>{
    //由于动画效果产生的延迟，导致promise错误，没登录时不重新render
    return nextProps.log.isLogin;
  };
  messageOnChange=(e)=>{
    this.setState({
      text:e.target.value
    })
  };
  sendMessage=(e)=>{
    const {text,messages,isConnect}=this.state;
    if(text==''){
      return;
    }
    if(isConnect===true){
      const userAccount=this.props.log.loginData.userAccount;
      const targetAccount=this.props.chat.activeChat.userAccount;
      this.props.dispatch({type:"chat/addChatRecords",payload:{targetAccount,message:{
        content:text,
        senderAccount:userAccount
      }}});

      this.socket.send(JSON.stringify({type:"boardCast",content:text,targetAccount}));
    }else{
      Message.error('socket未连接',GLOBAL_MSG_DURATION)
    }
    setTimeout(()=>{
      this.setState({
        text:"",
        messages,
      });
    },0)
  };
  linkToSocket=()=>{
    let socket = new WebSocket(socketHost);
    this.socket=socket;
    try {
      socket.onopen = ()=>{
        const {token,userAccount}=this.props.log.loginData;
        socket.send(JSON.stringify({"type":"auth",userAccount,token}));
        this.setState({
          isConnect:true
        });
        Message.info("连接成功",3);
      };

      socket.onmessage = (msg)=>{
        const {userAccount}=this.props.log.loginData;
        const {messages}=this.state;
        try{
          const analysis=JSON.parse(msg.data);
          const type=analysis.type;
          switch (type){
            case "newMessage":
              messages.push({
                type:"left",
                content:analysis.content
              });
              this.setState({
                messages
              });
              break;
            default:
              Message.info(msg.data,3);
          }


        }catch(e){
          Message.error(e.message,3);
        }

      };






      socket.onclose = ()=> {
        this.setState({
          isConnect:false,
        });
        Message.warn("连接已关闭",GLOBAL_MSG_DURATION);
      };

    }
    catch (ex) {
      Message.error(ex,3);
    }

    if (window.addEventListener) {
      window.addEventListener('beforeunload', this.closeLink);

    } else {
      window.attachEvent('onbeforeunload', this.closeLink);
    }
  };
  closeLink=()=>{
    let socket=this.socket;
    try {
      socket.close();
      socket = null;
    }
    catch (ex) {
      new Error(ex);
    }
  };
  render() {
    const {log,chat}=this.props;
    const {addressList=[]}=log.loginData;
    const {activeChat,chatRecords}=chat;
    const {userAccount}=log.loginData;
    const messages=chatRecords[activeChat.userAccount]||[];

    return (
      <Row style={{width:'500px'}} className={'vertical-projection'}>
        <Col span={6}  style={{height:'500px'}}>

          <SideBar activeKey={[`address${activeChat?activeChat.userAccount:"nullActive"}`]}>
            {addressList.map(item=>{
              return <SideBarItem key={`address${item.userAccount}`}
                                  onClick={this.getChangeActiveChat({userAccount:item.userAccount,userName:item.userName})}
              >{item.userName}</SideBarItem>
            })}
          </SideBar>
        </Col>
        <Col span={18} style={{height:'500px'}}>
          <ChatBox onChangeHandle={this.messageOnChange}
                   sendHandle={this.sendMessage}
                   text={this.state.text}
                   isAnimate={false}
                   title={<p style={{textAlign:'center'}}>{`Chat with ${activeChat?activeChat.userName:""}`}</p>}
          >
            {messages.map((msg,index)=>
              <ChatMessage type={msg.senderAccount==userAccount?"right":"left"} key={`message${index}`}>{msg.content}</ChatMessage>
            )}
          </ChatBox>
        </Col>
      </Row>
    )
  }
}

const select=(state)=>{
  const {log,chat}=state;
  return {
    loading:state.loading.models.log,
    log,
    chat,
  }
};

export default connect(select)(ChatPanel);
