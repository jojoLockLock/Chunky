/**
 * Created by jojo on 2017/7/28.
 */
import React,{PropTypes} from 'react';
import styles from './ChatFrame_Right.css';
import EmojiPicker from '../../components/EmojiPicker/EmojiPicker';
import ChatBox from '../../components/ChatBox/ChatBox';
import classnames from 'classnames';
import JoIcon from '../../components/JoIcon/JoIcon';
const {ChatInput,ChatMessage}=ChatBox;
export default class extends React.Component{
  static PropTypes={
    noMoreChatRecords:PropTypes.bool,
    sendMessage:PropTypes.func,
    getChatRecords:PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state={
      loading:false,
      inputIsFocus:false,
      value:""
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
  onChange=(e)=>{

    this.setState({
      value:e.target.value,
    })

  }
  onInputBlur=()=>{
    this.setState({
      inputIsFocus:false,
    })
  }
  onInputFocus=()=>{

    this.setState({
      inputIsFocus:true,
    })

  }
  emojiOnClick=(value)=>{

    this.getStateHandle("visible")("emojiPicker",false)();

    this.setState({
      value:this.state.value+value,
    })

    ChatInput.getFocus("chat-input");

  }
  sendMessage=()=>{
    const {userAccount}=this.props;

    if(!userAccount){
      return;
    }
    if(!("sendMessage" in this.props)){
      return;
    }

    this.props.sendMessage({
      to:userAccount,
      content:this.state.value,
    })

    this.setState({
      value:""
    });

    ChatBox.scrollToBottom("chat-box");


  };
  getChatRecords=()=>{
    const {loading}=this.state,
          {userAccount,noMoreChatRecords,chatRecords,getChatRecords}=this.props;

    if(loading||noMoreChatRecords||(!userAccount)){
      return;
    }

    this.setState({
      loading:true
    })

    let skip=(chatRecords||[]).length;

    getChatRecords&&getChatRecords({

      targetAccount:userAccount,
      skip,
      limit:10,

    }).then(result=>{

      this.setState({
        loading:false,
      })

    })
  }
  componentDidUpdate=()=>{
  }
  componentDidMount=()=>{
    ChatInput.getFocus("chat-input");
  }
  componentWillReceiveProps=(newProps)=>{
    if(newProps.userAccount!==this.props.userAccount){
      ChatBox.scrollToBottom("chat-box");
      ChatInput.getFocus("chat-input");

    }
  }
  render() {

    const {props,state}=this,
          {userName,userAccount,noMoreChatRecords,chatRecords,className}=props,
          {visible,loading,inputIsFocus}=state,
          classes=classnames({
            [className]:true
          })

    if(!userAccount){
      return (
        <div className={classes}>
          <div className={styles["placeholder-panel"]}>
            <JoIcon type="pig"/>
            <p style={{fontSize:"18px"}}>Why there is a piggy?</p>
          </div>
        </div>
      )
    }




    return (
      <div className={classes}>
        <ChatHeader userName={userName} userAccount={userAccount}/>
        <div className={styles["chat-content-wrap"]}>
          <ChatBox canPull={!noMoreChatRecords}
                   loading={loading}
                   scrollToTopCallBack={this.getChatRecords}
                   configKey={"chat-box"}>

            {[
              ...(
                noMoreChatRecords
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
        <div className={styles["chat-tool-bar"]}
             style={inputIsFocus?{background:"white"}:{}}>
          <EmojiPicker onClick={this.emojiOnClick}/>
        </div>
        <div className={styles["chat-footer"]}>

          <ChatInput value={this.state.value}
                     configKey={"chat-input"}
                     onFocus={this.onInputFocus}
                     onBlur={this.onInputBlur}
                     onChange={this.onChange}
                     onPressEnter={this.sendMessage}
                     onConfirm={this.sendMessage}/>
        </div>
      </div>
    )
  }
}


const ChatHeader=({userName,userAccount})=>{
  return (
    <div className={styles["chat-header"]}>
      {userAccount
        ?
        <p>
          &nbsp;
          &nbsp;
          {userName}({userAccount})
        </p>
        :
        null}
    </div>
  )
}
