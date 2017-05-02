/**
 * Created by JoJo on 2017/4/29.
 */
import React from 'react';
import styles from './ChatModal.css';
import classnames from 'classnames';
import {Input,Button,Row,Col,message as Message,Badge,Icon,Spin} from 'antd';
import QueueAnim from 'rc-queue-anim';
import ReactDOM from 'react-dom';
import {socketHost} from '../../config/apiConfig';
import {GLOBAL_MSG_DURATION} from '../../config/componentConfig';
import ChatBox from '../../components/ChatBox/ChatBox';
import SideBar from '../../components/Sidebar/SideBar';
import socket from '../../services/socket'
const ChatMessage =ChatBox.ChatMessage;
const SideBarItem=SideBar.Item;
const ButtonGroup = Button.Group;
import { connect } from 'dva';
class ChatModal extends React.Component{
  constructor(props){
    super(props);
    this.state={
      text:"",
      isConnect:false,
      messages:[
      ],
      count:1
    };
  }
  getChangeActiveChat=(activeChat)=>{
    return ()=>{
      this.setState({
        isPulling:false
      });
      this.props.dispatch({type:'chat/closeAnimate'});
      this.props.dispatch({type:"chat/setActiveChat",payload:{activeChat}});


    }
  };
  getChatRecords=(targetAccount)=>{
    this.props.dispatch({type:"chat/getChatRecords",payload:{targetAccount}});
  };
  getPastChatRecords=()=>{
    if(this.props.loading){
      return false;
    }
    const targetAccount=this.props.chat.activeChat.userAccount;
    if(targetAccount in this.props.chat.noMoreChatRecords){

      return false;
    }
    this.getChatRecords(targetAccount);
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
      isPulling:false,
      text:e.target.value
    })
  };
  //发送信息
  sendMessage=(e)=>{
    const {text,messages,isConnect}=this.state;
    if(Object.is(text,'')){
      return;
    }
    if(isConnect===true){
      const userAccount=this.props.log.loginData.userAccount;
      const targetAccount=this.props.chat.activeChat.userAccount;
      const chatRecords=this.props.chat.chatRecords;
      this.props.dispatch({type:"chat/openAnimate"});
      this.props.dispatch({type:"chat/addChatRecords",
        payload:
          {targetAccount,
            message:{
              content:text,
              senderAccount:userAccount,
              date:Date.now(),
              key:`${targetAccount}${chatRecords[targetAccount].length}`
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
        const {chatRecords}=this.props.chat;
        try{
          const analysis=JSON.parse(msg.data);
          const type=analysis.type;
          switch (type){
            case "newMessage":
              this.props.dispatch({
                type:"chat/addChatRecords",
                payload:{
                  targetAccount:analysis.senderAccount,
                  message:{
                    content:analysis.content,
                    senderAccount:analysis.senderAccount,
                    date:Date.now(),
                    key:`${analysis.senderAccount}${chatRecords[analysis.senderAccount].length}`
                  }
                }
              });
              break;
            default:
              console.info(msg.data);
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
  //获得侧边栏
  getSideBar=()=>{
    const {log,chat}=this.props;
    const {addressList=[]}=log.loginData;
    const {activeChat={}}=chat;
    return (<SideBar activeKey={[`address${activeChat?activeChat.userAccount:"nullActive"}`]}>
      {addressList.map(item=>{
        return <SideBarItem key={`address${item.userAccount}`}
                            onClick={this.getChangeActiveChat({userAccount:item.userAccount,userName:item.userName})}
        >{item.userName}</SideBarItem>
      })}
    </SideBar>)
  };

  //获得chatBox
  getChatBox=()=>{
    const {log,chat,loading}=this.props;
    const {activeChat={},chatRecords,isAnimate,noMoreChatRecords}=chat;
    const {userAccount}=log.loginData;
    const messages=chatRecords[activeChat.userAccount]||[];
    return (<ChatBox onChangeHandle={this.messageOnChange}
                     sendHandle={this.sendMessage}
                     text={this.state.text}
                     isAnimate={isAnimate}
                     loading={loading}
                     pull={!(activeChat.userAccount in noMoreChatRecords)}
                     scrollToTopCallBack={this.getPastChatRecords}
                     title={<p style={{textAlign:'center'}}>{`Chat with ${activeChat?activeChat.userName:""}`}</p>}>
      {messages.map((msg,index)=>{
        let type=Object.is(msg.senderAccount,"sys")?"center":(Object.is(msg.senderAccount,userAccount)?"right":"left");
        return <ChatMessage type={type}
                            key={`message${msg.key}`}>
          {msg.content}</ChatMessage>

      })}
    </ChatBox>)
  };

  render() {

    return (
      <div style={{width:"500px"}}>
          <Row style={{width:'500px'}} className={'vertical-projection'}>
            <Col span={6}  style={{height:'500px'}}>
              {this.getSideBar()}
            </Col>
            <Col span={18} style={{height:'500px'}}>
              {this.getChatBox()}
            </Col>
            <Col span={18}>
              {/*<ButtonGroup>*/}
              {/*<Button onClick={this.decline}>*/}
              {/*<Icon type="minus" />*/}
              {/*</Button>*/}
              {/*<Button onClick={this.increase}>*/}
              {/*<Icon type="plus" />*/}
              {/*</Button>*/}
              {/*</ButtonGroup>*/}
            </Col>
          </Row>
      </div>
    )
  }
}

const select=(state)=>{
  const {log,chat}=state;
  return {
    loading:state.loading.models.chat,
    log,
    chat,
  }
};

export default connect(select)(ChatModal);
