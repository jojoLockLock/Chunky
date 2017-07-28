/**
 * Created by jojo on 2017/7/13.
 */
import React from 'react';
import { connect } from 'dva';
import {Row,Col,Badge,
Button,Modal,Icon,notification as Notification,Tooltip,Popconfirm} from 'antd';
import FrendList from '../../components/FriendList/FrendList';
import moment from 'moment'
import styles from './ChatFrame.css'
import classnames from 'classnames';
import QueryFrame from '../../routes/QueryFrame';
import NotificationPanel from '../../routes/NotificationPanel';
import JoIcon from '../../components/JoIcon/JoIcon';
import ChatFrameRight from '../ChatFrame_Right/ChatFrame_Right';

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
        add:false,
        chatPanel:true,
        notification:false,
        emojiPicker:false,
      },
      activePanel:"message",
    }
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


    this.props.getFriendNotifications({
      limit:15,
      skip:0,
    })

    this.props.getBasicData();
    // this.props.sortFriendListByActiveDate();
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

    const {type}=data.payload;

    switch (type){
      case "friend-request/req":
        this.friendRequestReqHandle(data);
        break;
      case "friend-request/res":
        this.friendRequestResHandle(data);
        break;
      default:
        console.info(data)
    }


  }
  friendRequestReqHandle=(data)=>{
    Notification.info({
      message:"New Friend Request",
      placement:"bottomRight",
      description:`${data.payload.userAccount} wanna be your friend`,
      icon: <Icon type="user-add" style={{color:"#3db8c1"}}/>
    })

    this.props.setHaveNew({
      type:"notifications",
      value:true,
    })

    this.props.getFriendNotifications({limit:15,skip:0})
  }
  friendRequestResHandle=(data)=>{
    Notification.info({
      message:"You have a new Friend ",
      placement:"bottomRight",
      description:`${data.payload.userAccount} became your friend`,
      icon: <Icon type="user-add" style={{color:"#3db8c1"}}/>
    })
    this.props.getBasicData();
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

    data.status===1&&this.props.setHaveNew({
      type:"chats",
      value:true,
    })


    this.props.setFriendItemToTopByUserAccount(from);

    ChatBox.scrollToBottom("test");
  }

  //发送信息
  sendMessage=(payload)=>{
    const {to}=payload;
    this.props.sendMessage(payload)
    this.props.setFriendItemToTopByUserAccount(to);
  };
  putUserFriendRequest=(payload)=>{
    this.props.putUserFriendRequest(payload)
      .then(()=>{
        this.getStateHandle("visible")("add",false)();
        Message.success("Success send friend request")
      })
      .catch(msg=>{
        Message.error(msg);
      })
      .then(()=>{

      })
  }
  friendListOnChange=(key)=>{
    this.setState({
      activeKey:key,
    })

    let count=this.props.chat.messageCount[key]
    if(count!==0){
      this.props.initUnreadMessagesCount({targetAccount:key});
    }

    this.props.setMessageCount({
      userAccount:key,
      count:0,
    })


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
  closeChat=()=>{
    this.setState({
      activeKey:null
    })
  }
  getSideBarOnChange=(key)=>{
    return ()=>{
      this.setState({
        activePanel:key
      })
    }
  }

  getFriendListPanel=()=>{

    const {activeKey}=this.state;
    const data=this.getFriendListData();

    const content=data.length===0
      ?
      <p style={{textAlign:"center",color:"#cccccc"}}>
        Oh ! You are a lonely piggy.
      </p>
      :
      <FrendList data={data}
                 activeKey={activeKey}
                 onChange={this.friendListOnChange}/>

    return this.combineLeftPanelTemplate("FRIENDS",content)
  }
  getCorner=()=>{
    const {activeKey}=this.state;
    return (
      <div className={"corner"}
           style={{height:"30px",lineHeight:"30px"}}>
        {
          activeKey
            ?
            <a onClick={this.closeChat}
               style={{
                 cursor:"pointer",
                 position:"relative",
                 zIndex:"10",
                 fontSize:"16px",
                 fontWeight:"900"
               }}>
              <Icon type="close"/>
            </a>
            :null
        }
      </div>
    )
  }
  getNotificationPanel=()=>{
    const data=[...this.props.user.notifications.friendRequest].reverse();
    const content=data.length===0&&!this.props.refetchState["friendRequest"]
      ?
      <p style={{textAlign:"center",color:"#cccccc"}}>
        No one wanna become friends with you!
      </p>
      :
      <NotificationPanel data={data}
                         getBasicData={this.props.getBasicData}
                         getFriendNotifications={this.props.getFriendNotifications}
                         patchUserFriendRequest={this.props.patchUserFriendRequest}/>

    return this.combineLeftPanelTemplate("NOTIFICATIONS",content)
  }
  getSearchPanel=()=>{
    const {user}=this.props;
    const content=<QueryFrame queryUser={this.props.queryUser}
                              friendList={[
                                ...user.data.friendList,
                                {userAccount:user.data.userAccount}
                              ]}
                              putUserFriendRequest={this.putUserFriendRequest}/>;
    return this.combineLeftPanelTemplate("SEARCH",content);
  }
  combineLeftPanelTemplate=(title,content)=>{

    const classes=classnames({
      [styles["frame-left"]]:true,
      "frame-left":true,
    })

    return (
      <div className={classes}>
        {this.getCorner()}
        <div className={styles["frame-left-header"]}>
          <h1 className={styles["title"]}>{title}</h1>
        </div>
        <div className={styles["friend-list-content"]}>
          {content}
        </div>
      </div>
    )
  }
  getLeftPanel=()=>{
    const {activePanel}=this.state;
    if(activePanel==="message"){
      return this.getFriendListPanel();
    }
    if(activePanel==="notification"){
      return this.getNotificationPanel();
    }
    if(activePanel==="search"){
      return this.getSearchPanel();
    }
  }
  getSideBar=()=>{
    const {user,className}=this.props,
      {activeKey}=this.state,
      classes=classnames({
        [styles["frame"]]:true,
        [className||""]:true
      })

    const itemStyle={
      color:"#cccccc"
    }

    const {haveNew}=user;
    return (
      <div className={styles["frame-side-bar"]}>
        <div className={styles["side-bar-menu"]}>
          <a>
            <JoIcon type="menu-l"/>
          </a>
        </div>
        <div className={styles["user-overview"]}>
          <div className={styles["user-icon"]}>
            <img src={user.data.icon}/>
          </div>
          <span className={styles["user-message"]}>
              {user.data.userName}
              </span>
        </div>
        {this.getOperationList()}
      </div>
    )
  }
  getOperationList=()=>{

    const {user,className}=this.props,
      {activeKey}=this.state,
      classes=classnames({
        [styles["frame"]]:true,
        [className||""]:true
      })

    const itemStyle={
      color:"#cccccc"
    }

    const {haveNew}=user;

    //获得未读信息总量
    const messageCount=this.props.chat.messageCount;
    let totalCount=0;
    if(Object.keys(messageCount).length!==0){
      Object.keys(messageCount).forEach(uc=>{
        totalCount+=messageCount[uc];
      })
    }

    return (
      <ul className={styles["operation-list"]}>
        <li className={styles["operation-item"]}>
          <Badge count={totalCount}>
            <a  style={this.state.activePanel!=="message"?itemStyle:{}}
                onClick={()=>{
                  this.getSideBarOnChange("message")();
                  this.props.setHaveNew({
                    type:"chats",
                    value:false,
                  })
                }}>
              <Icon type="message" />
            </a>
          </Badge>
        </li>
        <li className={styles["operation-item"]}>
          <Badge dot={haveNew["notifications"]}>
            <a onClick={()=>{
              this.getStateHandle("visible")("notification",true)()
              this.getSideBarOnChange("notification")();
              this.props.setHaveNew({
                type:"notifications",
                value:false,
              })
            }}
               style={this.state.activePanel!=="notification"?itemStyle:{}}>
              <Icon type="notification" />
            </a>
          </Badge>
        </li>
        <li className={styles["operation-item"]}>
          <a onClick={()=>{
            this.getStateHandle("visible")("add",true)();
            this.getSideBarOnChange("search")();

          }}
             style={this.state.activePanel!=="search"?itemStyle:{}}>
            <Icon type="search" />
          </a>
        </li>
        <li className={styles["operation-item"]} style={{marginTop:"20px"}}>
          <Popconfirm onConfirm={this.props.logout}
                      okText={"Sure"}
                      cancelText={"Cancel"}
                      title={"Are you sure to exit?"}>
            <a >
              <Icon type="poweroff" />
            </a>
          </Popconfirm>
        </li>

      </ul>
    )
  }
  getFrameRight=()=>{
    const {chat,user}=this.props,
      {friendList}=user.data||{},
      {activeKey}=this.state;

    let chatRecords=chat.chatRecords[activeKey]||[];

    let activeUeserName="";

    friendList.some(f=>{
      if(f.userAccount===this.state.activeKey){
        activeUeserName=f.userName;
        return true;
      }
    });

    return (
      <ChatFrameRight className={styles["frame-right"]}
                      sendMessage={this.sendMessage}
                      chatRecords={chatRecords}
                      userName={activeUeserName}
                      userAccount={activeKey}
                      getChatRecords={this.props.getChatRecords}
                      noMoreChatRecords={activeKey in chat.noMoreChatRecords}/>
    )
  }
  render() {
    const {className}=this.props,
          classes=classnames({
            [styles["frame"]]:true,
            [className||""]:true
          })


    return (
      <div className={classes}>
        {this.getSideBar()}
        {this.getLeftPanel()}
        {this.getFrameRight()}
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    user:state.user,
    chat:state.chat,
    refetchState:state.refetchState
  }
}
function mapDispatchToProps(dispatch,ownProps) {
  return {
    dispatch,
    getBasicData:()=>{
      return new Promise((resolve,reject)=>{
        dispatch({
          type:"user/getBasicData",
          resolve,
          reject,
        })
      })
    },
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
    },
    getFriendNotifications:(payload)=>{
      return new Promise((resolve,reject)=>{
        dispatch({
          type:"user/getFriendNotifications",
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
    },
    setRefetchState:(payload={})=>{
      dispatch({
        type:"refetchState/setRefetchState",
        payload:{
          ...payload
        }
      })
    },
    setHaveNew:(payload={})=>{
      dispatch({
        type:"user/setHaveNew",
        payload:{
          ...payload
        }
      })
    },
    initUnreadMessagesCount:(payload={})=>{
      dispatch({
        type:"chat/initUnreadMessagesCount",
        payload:{
          ...payload,
        }
      })
    }


  }

}
export default connect(mapStateToProps,mapDispatchToProps)(ChatFrame);
