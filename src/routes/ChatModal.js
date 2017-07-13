/**
 * Created by jojo on 2017/7/13.
 */
import React from 'react';
import { connect } from 'dva';
import ChatBox from '../components/ChatBox/ChatBox';
import {Row,Col,message as Message} from 'antd';
const {ChatInput,ChatMessage}=ChatBox;

class ChatModal extends React.Component{

  constructor(props){
    super(props);
    this.state={
      messageValue:""
    }
  }
  boardCastController=(data)=>{

    const {receiveNewMessage,user}=this.props;
    const {userAccount}=user.data;
    const {from}=data.payload;

    let nowTimestamp=new Date().getTime();

    data.status===1&&receiveNewMessage({
      userAccount:from,
      message:{
        ...data.payload,
        to:userAccount,
        key:`${nowTimestamp}-${from}`,
        activeDate:nowTimestamp
      }
    })

    ChatBox.scrollToBottom("test");
  }
  componentDidMount=()=>{
    const {login,initSocket,setSocketConnectState}=this.props;
    login({userAccount:"tester1",userPassword:"xxx"}).then(()=>{
      initSocket({
        onClose:()=>{
          setSocketConnectState(false);
        },
        controllers: {
          boardCast: this.boardCastController
        }
      })
    })
  }
  messageOnChange=(e)=>{

    this.setState({
      messageValue:e.target.value
    })

    ChatBox.scrollToBottom("test");
  };
  //发送信息
  sendMessage=(e)=>{


    // setTimeout(()=>{
    //   this.setState({
    //     text:"",
    //     messages,
    //   });
    // },0)
  };
  //初始化 并连接到socket
  initSocket=()=>{


  };
  render() {
    const {chat,user}=this.props;
    const {userAccount}=user.data||{};
    let chatRecords=chat.chatRecords["tester2"]||[];
    console.info(chatRecords,userAccount);
    return <div>
      <Row>
        <Col style={{height:"600px"}}>
          <ChatBox chatBoxKey={"test"}
                   canPull={true}
                   configKey={"test"}>
            {chatRecords.map(i=>{
              return (
                <ChatMessage key={i.key}
                             type={i.from!==userAccount?"left":"right"}>
                  {i.content}
                </ChatMessage>
              )
            })}
          </ChatBox>
        </Col>
      </Row>
      <Row>
        <Col>
          <ChatInput value="123123"/>
        </Col>
      </Row>
    </div>
  }
}
function mapStateToProps(state) {
  return {
    user:state.user,
    chat:state.chat,
  }
}
function mapDispatchToProps(dispatch,ownProps) {
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
    getChatRecords:(payload)=>{
      return ()=>{
        return new Promise((resolve,reject)=>{
          dispatch({
            type:"chat/getChatRecords",
            payload:{
              ...payload,
            },
            resolve,
            reject,
          })
        })
      }
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
    receiveNewMessage:(payload)=>{
      dispatch({
        type:"chat/addNewMessage",
        payload:{
          ...payload,
        }
      })
    }
  }

}
export default connect(mapStateToProps,mapDispatchToProps)(ChatModal);
