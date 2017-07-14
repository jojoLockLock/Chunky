/**
 * Created by jojo on 2017/7/13.
 */
import React from 'react';
import { connect } from 'dva';
import ChatBox from '../components/ChatBox/ChatBox';
import {Row,Col,message as Message} from 'antd';
const {ChatInput,ChatMessage}=ChatBox;

class ChatFrame extends React.Component{

  constructor(props){
    super(props);
    this.state={
      messageValue:"",
      canPull:true,
      isLoading:false,
      value:"",
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
        activeDate:nowTimestamp,
        type:"left"
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
      this.props.getChatRecords({
        targetAccount:"tester2",
        limit:10,
        skip:0,
      }).then(()=>{
        console.info("init")
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
  sendMessage=()=>{


    console.info("....");
    this.props.sendMessage({
      to:"tester2",
      content:this.state.value,
    })

    this.setState({
      value:""
    });
  };
  //初始化 并连接到socket
  initSocket=()=>{


  };
  onChange=(e)=>{
    this.setState({
      value:e.target.value,
    })

  }
  fetchMoreChatRecords=()=>{
    if(this.state.loading){
      return;
    }

    if("tester2" in this.props.chat.noMoreChatRecords){
      return;
    }
    const skip=(this.props.chat.chatRecords["tester2"]||[]).length;
    this.setState({
      loading:true
    })
    this.props.getChatRecords({
      targetAccount:"tester2",
      limit:10,
      skip:skip,
    }).then(()=>{
      this.setState({
        loading:false,
      })
    })
  }
  render() {
    const {chat,user}=this.props;
    const {userAccount}=user.data||{};
    let chatRecords=chat.chatRecords["tester2"]||[];
    let friendList=(this.props.user.data||{}).friendList||[];
    return (
      <div>
        <Row>
          <Col span={6} style={{border:"1px solid black",height:500}}>
            {
              friendList.map(f=>{
                return <span key={`friend-${userAccount}`}>
                  {f.userAccount}</span>
              })
            }
          </Col>
          <Col span={18}>
            <Row>
              <Col style={{height:"500px"}}>
                <ChatBox chatBoxKey={"test"}
                         canPull={!("tester2" in this.props.chat.noMoreChatRecords)}
                         loading={this.state.loading}
                         scrollToTopCallBack={this.fetchMoreChatRecords}
                         configKey={"test"}>
                  {chatRecords.map(i=>{
                    i.type==="center"&&console.info(i.content);
                    return (
                      <ChatMessage key={i.key}
                                   content={i.content}
                                   type={i.type}/>
                    )
                  })}
                </ChatBox>
              </Col>
            </Row>
            <Row>
              <Col style={{height:"100px"}}>
                <ChatInput value={this.state.value}
                           onChange={this.onChange}
                           onPressEnter={this.sendMessage}
                           onConfirm={this.sendMessage}/>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
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
    },
    sendMessage:(payload)=>{
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
export default connect(mapStateToProps,mapDispatchToProps)(ChatFrame);
