/**
 * Created by jojo on 2017/7/13.
 */
import React from 'react';
import { connect } from 'dva';
import ChatBox from '../components/ChatBox/ChatBox';
import {Row,Col,Badge,
Button,Modal,Icon,notification as Notification,Tooltip,Popconfirm} from 'antd';
import FrendList from '../components/FriendList/FrendList';
import moment from 'moment'
import styles from './ChatFrame.css'
import classnames from 'classnames';
import QueryFrame from './QueryFrame';
import NotificationPanel from './NotificationPanel';
import JoIcon from '../components/JoIcon/JoIcon';
import {Message} from '../components/CommonConfigComponents'
import EmojiPicker from '../components/EmojiPicker/EmojiPicker';
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
        add:false,
        chatPanel:true,
        notification:false,
        emojiPicker:false,
      },
      activePanel:"message",
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

    Notification.info({
      message:"好友添加请求",
      placement:"bottomRight",
      description:`${data.payload.userAccount} 想成为你的好友`,
      icon: <Icon type="user-add" style={{color:"#3db8c1"}}/>
    })



    this.props.setHaveNew({
      type:"notifications",
      value:true,
    })

    this.props.getFriendNotifications({limit:15,skip:0})

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
        Message.success("已发送好友请求")
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
  getChatPanel=()=>{

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
      <div className={styles["frame-right"]}>
        <div className={styles["chat-header"]}>
          {activeKey
            ?
            <p>
              &nbsp;&nbsp;
              {activeUeserName}({activeKey})</p>
            :
            null}
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
          <div style={{position:"absolute",zIndex:999}}>
            <EmojiPicker onClick={this.emojiOnClick}
                         onChange={this.emojiPickerOnChange}
                         visible={this.state.visible.emojiPicker}/>
          </div>
          <ChatInput value={this.state.value}
                     onChange={this.onChange}
                     onPressEnter={this.sendMessage}
                     onConfirm={this.sendMessage}/>
        </div>
      </div>
    )
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
  emojiOnClick=(value)=>{
    this.getStateHandle("visible")("emojiPicker",false)();
    this.setState({
      value:this.state.value+value,
    })
  }
  emojiPickerOnChange=()=>{
    this.getStateHandle("visible")("emojiPicker",!this.state.visible.emojiPicker)();
  }
  getHolderPanel=()=>{
    return (
      <div className={styles["frame-right"]}>

        <div style={{
          textAlign:"center",
          fontSize:"80px",
          color:"#cccccc",
          paddingTop:"250px"}}>
          {/*<Icon type="meh" />*/}
          <JoIcon type="pig"/>
          <p style={{fontSize:"18px"}}>Why there is a piggy?</p>
        </div>
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
  render() {
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
      <div className={classes}>
        <div className={styles["frame-side-bar"]}>
          <div className={styles["side-bar-menu"]}>
              <a >
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
          <ul className={styles["operation-list"]}>


            {/*<li className={styles["operation-item"]}>*/}
              {/*<Badge dot={false}>*/}
                {/*<a style={this.state.activePanel!=="user"?itemStyle:{}}>*/}
                  {/*<Icon type="user" />*/}
                {/*</a>*/}
              {/*</Badge>*/}
            {/*</li>*/}
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


        </div>

        {this.getLeftPanel()}


        {activeKey?this.getChatPanel():this.getHolderPanel()}




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
