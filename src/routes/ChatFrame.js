/**
 * Created by jojo on 2017/7/13.
 */
import React from 'react';
import { connect } from 'dva';
import ChatBox from '../components/ChatBox/ChatBox';
import {Row,Col,message as Message,Badge,
Button,Modal,Icon,notification as Notification} from 'antd';
import FrendList from '../components/FriendList/FrendList';
import moment from 'moment'
import styles from './ChatFrame.css'
import classnames from 'classnames';
import QueryUser from './QueryUser';
const {ChatInput,ChatMessage}=ChatBox;

class ChatFrame extends React.Component{

  constructor(props){
    super(props);
    this.state={
      messageValue:"",
      canPull:true,
      isLoading:false,
      value:"",
      activeKey:null,
      visible:{
        add:false
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
  notificationController=(data)=>{
    console.info(data);

    Notification.info({
      message:"好友添加请求",
      placement:"bottomRight",
      description:`${data.payload.userAccount} 想成为你的好友`,
      icon: <Icon type="user-add" style={{color:"#3db8c1"}}/>
    })
  }
  boardCastController=(data)=>{

    const {receiveNewMessage,user,chat,setMessageCount}=this.props;
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

    setMessageCount({
      userAccount:from,
      count:(chat.messageCount[from]||0)+1,
    })

    this.props.setFriendItemToTopByUserAccount(from);

    ChatBox.scrollToBottom("test");
  }
  componentDidMount=()=>{
    const {user,initSocket,setSocketConnectState}=this.props;
    const {friendList}=user.data;

    initSocket({
      onClose:()=>{
        setSocketConnectState(false);
      },
      controllers: {
        boardCast: this.boardCastController,
        notification:this.notificationController,
      }
    })

    this.props.getAllChatRecords().then(result=>{
      this.props.sortFriendListByActiveDate();
    })

    // this.props.sortFriendListByActiveDate();
  }
  messageOnChange=(e)=>{

    this.setState({
      messageValue:e.target.value
    })

    ChatBox.scrollToBottom("test");
  };
  //发送信息
  sendMessage=()=>{
    const {activeKey}=this.state;

    if(!activeKey){
      return;
    }

    this.props.sendMessage({
      to:activeKey,
      content:this.state.value,
    })

    this.setState({
      value:""
    });

    ChatBox.scrollToBottom("test");

    this.props.setFriendItemToTopByUserAccount(activeKey);

  };
  onChange=(e)=>{

    this.setState({
      value:e.target.value,
    })

  }
  getChatRecords=(targetAccount)=>{
    if(this.state.loading){
      return;
    }
    const {activeKey}=this.state;
    if(!targetAccount){
      return;
    }
    if(targetAccount in this.props.chat.noMoreChatRecords){
      return;
    }
    const skip=(this.props.chat.chatRecords[targetAccount]||[]).length;
    this.setState({
      loading:true
    })
    this.props.getChatRecords({
      targetAccount,
      limit:10,
      skip:skip,
    }).then(()=>{
      this.setState({
        loading:false,
      })
    })
  }
  getScrollToTopCallBack=(targetAccount)=>{
    return ()=>{
      this.getChatRecords(targetAccount);
    }
  }
  putUserFriendRequest=(payload)=>{
    this.props.putUserFriendRequest(payload)
      .then(()=>{
        this.getStateHandle("visible")("add",false)();
      })
      .catch(msg=>{

      })
      .then(()=>{

      })
  }
  friendListOnChange=(key)=>{


    this.setState({
      activeKey:key,
    })

    this.props.setMessageCount({
      userAccount:key,
      count:0,
    })

    ChatBox.scrollToBottom("test");

  }
  getFriendListData=()=>{
    const {chat,user}=this.props,
          friendList=(user.data||{}).friendList||[],
          chatRecords=chat.chatRecords;

    return friendList.map(f=>{
      let userAccout=f.userAccount,
          records=chatRecords[userAccout]||[],
          lastMessage=records[records.length-1]||{};

          return {
            icon:f.icon,
            time:this.getTimeLabelContent(lastMessage.activeDate),
            count:chat.messageCount[userAccout]||0,
            title:f.userName,
            subtext:lastMessage.content,
            key:f.userAccount
          }
    })
  }
  getTimeLabelContent=(time)=>{
    if(!time){
      return "";
    }
    const messageTime=moment(time),
          messageYear=messageTime.year(),
          messageMonth=messageTime.month(),
          messageDate=messageTime.date(),
          now=moment(),
          nowYear=now.year(),
          nowMonth=now.month(),
          nowDate=now.date();
    if(messageYear===nowYear&&messageMonth===nowMonth&&messageDate===nowDate){
      return messageTime.format("HH:mm");
    }

    return messageTime.format("MM-DD");
  }
  render() {
    const {chat,user,className}=this.props,
          {userAccount}=user.data||{},
          {activeKey}=this.state,
          classes=classnames({
            [styles["frame"]]:true,
            [className||""]:true
          })
    let chatRecords=chat.chatRecords[activeKey]||[];


    return (
      <div className={classes}>
        <div className={styles["frame-side-bar"]}>
          <ul className={styles["operation-list"]}>
            <li className={styles["operation-item"]}>
              <Badge dot={true}>
                <a>
                  <Icon type="notification" />
                </a>
              </Badge>
            </li>
            <li className={styles["operation-item"]}>
              <Badge dot={true}>
                <a>
                  <Icon type="user" />
                </a>
              </Badge>
            </li>
            <li className={styles["operation-item"]}>
              <Button icon="plus"
                      onClick={this.getStateHandle("visible")("add",true)}/>
            </li>
          </ul>


        </div>
        <div className={styles["frame-left"]}>
          <div className={styles["friend-list-header"]}>

          </div>
          <div className={styles["friend-list-content"]}>
            <FrendList data={this.getFriendListData()}
                       activeKey={activeKey}
                       onChange={this.friendListOnChange}/>
          </div>
        </div>
        <div className={styles["frame-right"]}>
          <div className={styles["chat-header"]}>
            {this.state.activeKey}
          </div>
          <div style={{height:"calc( 100% - 180px)"}} className={styles["chat-content-wrap"]}>
            <ChatBox chatBoxKey={"test"}
                     canPull={!(activeKey in this.props.chat.noMoreChatRecords)}
                     loading={this.state.loading}
                     scrollToTopCallBack={this.getScrollToTopCallBack(this.state.activeKey)}
                     configKey={"test"}>

              {[
                ...(
                  activeKey in this.props.chat.noMoreChatRecords
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
          </div>
          <div className={styles["chat-footer"]} style={{
            height:"120px",
            width:"100%",
            borderTop:"1px solid #cccccc"}}>
            <ChatInput value={this.state.value}
                       onChange={this.onChange}
                       onPressEnter={this.sendMessage}
                       onConfirm={this.sendMessage}/>
          </div>
        </div>

        <Modal visible={this.state.visible.add}
               width={400}
               footer={null}
               onCancel={this.getStateHandle("visible")("add",false)}
               title={<h3><Icon type="user-add"/>&nbsp;添加好友</h3> }>
          <QueryUser queryUser={this.props.queryUser}
                     putUserFriendRequest={this.putUserFriendRequest}/>
        </Modal>

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
    },
    setMessageCount:(payload)=>{
      dispatch({
        type:"chat/setMessageCount",
        payload:{
          ...payload,
        }
      })
    },
    sortFriendListByActiveDate:(payload)=>{
      dispatch({
        type:"user/sortFriendListByActiveDate",
        payload:{

        }
      })
    },
    setFriendItemToTopByUserAccount:(userAccount)=>{
      dispatch({
        type:"user/setFriendItemToTopByUserAccount",
        payload:{
          userAccount
        }
      })
    },
    getAllChatRecords:()=>{
      return new Promise((resolve,reject)=>{
        dispatch({
          type:"chat/getAllChatRecords",
          resolve,
          reject,
        })
      })
    },
    queryUser:(value)=>{
      return new Promise((resolve,reject)=>{
        dispatch({
          type:"user/queryUser",
          payload:{
            value,
          },
          reject,
          resolve,
        })
      })
    },
    putUserFriendRequest:(targetAccount)=>{
      return new Promise((resolve,reject)=>{
        dispatch({
          type:"user/putUserFriendRequest",
          payload:{
            targetAccount,
          },
          reject,
          resolve,
        })
      })
    },
    patchUserFriendRequest:(targetAccount,resCode)=>{
      return new Promise((resolve,reject)=>{
        dispatch({
          type:"user/patchUserFriendRequest",
          payload:{
            targetAccount,
            resCode,
          },
          reject,
          resolve,
        })
      })
    }
  }

}
export default connect(mapStateToProps,mapDispatchToProps)(ChatFrame);
