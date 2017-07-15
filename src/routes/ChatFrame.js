/**
 * Created by jojo on 2017/7/13.
 */
import React from 'react';
import { connect } from 'dva';
import ChatBox from '../components/ChatBox/ChatBox';
import {Row,Col,message as Message} from 'antd';
import FrendList from '../components/FriendList/FrendList';

const {ChatInput,ChatMessage}=ChatBox;

class ChatFrame extends React.Component{

  constructor(props){
    super(props);
    this.state={
      messageValue:"",
      canPull:true,
      isLoading:false,
      value:"",
      friendList:[
        {
          title:"BboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojo",
          subtext:"BboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojo",
          icon:"http://h.hiphotos.baidu.com/zhidao/wh%3D600%2C800/sign=" +
          "4c665748aa64034f0f98ca009ff35509/a71ea8d3fd1f413490979ceb241f95cad0c85e86.jpg",
          time:"17:50",
          key:"one",
          count:1
        },
        {
          title:"BboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojo",
          subtext:"BboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojo",
          icon:"http://h.hiphotos.baidu.com/zhidao/wh%3D600%2C800/sign=" +
          "4c665748aa64034f0f98ca009ff35509/a71ea8d3fd1f413490979ceb241f95cad0c85e86.jpg",
          time:"17:50",
          key:"two",
          count:31
        },
        {
          title:"BboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojo",
          subtext:"BboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojoBboyJojo",
          icon:"http://h.hiphotos.baidu.com/zhidao/wh%3D600%2C800/sign=" +
          "4c665748aa64034f0f98ca009ff35509/a71ea8d3fd1f413490979ceb241f95cad0c85e86.jpg",
          time:"17:50",
          key:"three",
          count:0
        }
      ]
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

      this.getChatRecords();
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
  getChatRecords=()=>{
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
  friendListOnChange=(key)=>{
    this.setState({
      activeKey:key,
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
          <Col span={24} style={{border:"1px solid black",height:500}}>
            <FrendList data={this.state.friendList} activeKey={this.state.activeKey} onChange={this.friendListOnChange}/>
          </Col>
          <Col span={18}>
            <Row>
              <Col style={{height:"500px"}}>
                <ChatBox chatBoxKey={"test"}
                         canPull={!("tester2" in this.props.chat.noMoreChatRecords)}
                         loading={this.state.loading}
                         scrollToTopCallBack={this.getChatRecords}
                         configKey={"test"}>

                  {[
                    ...(
                      "tester2" in this.props.chat.noMoreChatRecords
                        ?
                        [<ChatMessage key={`no-more-records-key`}
                                      type="center"
                                      content="没有更多的聊天记录了"/>]
                        :
                        []
                    ),
                    ...chatRecords.map(i=>{
                      return <ChatMessage key={i.key}
                                        content={i.content}
                                        type={i.type}/>
                  })]}
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
