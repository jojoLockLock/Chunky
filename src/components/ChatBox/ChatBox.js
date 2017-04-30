/**
 * Created by Administrator on 2017/4/6.
 */
import React from 'react';
import styles from './ChatBox.css';
import classnames from 'classnames';
import {Input,Button,Spin} from 'antd';
import QueueAnim from 'rc-queue-anim';
import ReactDOM from 'react-dom';
const ChatBox=({className,onChangeHandle,sendHandle,children,text,title,isAnimate=true,isPulling=false})=>{
  const classes=classnames({
    [className]:className||false,
    [styles['chat-box']]:true,
  });
  return (
    <div className={classes}>
      <ChatTitle>{title}</ChatTitle>
        <ChatPanel isAnimate={isAnimate} isPulling={isPulling}>
          {children}
        </ChatPanel>
      <ChatInput onChangeHandle={onChangeHandle} sendHandle={sendHandle} value={text}/>
    </div>
  )
};
//进行属性校验
const {PropTypes} =React;
ChatBox.propTypes={
  className:PropTypes.string,
  isAnimate:PropTypes.bool,
  onChangeHandle:PropTypes.func,
  sendHandle:PropTypes.func,
  text:PropTypes.string,
  title:PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
    PropTypes.number,
  ])
};
const ChatTitle=({children})=>{
  const classes=classnames({
    [styles['chat-title']]:true
  });
  return (
    <div className={classes}>{children}</div>
  )
};

class ChatPanel extends React.Component{
  constructor(props) {
    super(props);
    this.chatPanel=null;
    this.preScrollHeight=0;
  }
  componentDidMount=()=>{
    this.scrollChatPanelToBottom();
  };
  componentDidUpdate=()=>{
    this.scrollChatPanelToBottom();
  };
  componentWillReceiveProps=(nextProps)=>{
    this.preScrollHeight=this.chatPanel.scrollHeight;
  };
  scrollChatPanelToBottom=()=>{
    let chatPanel=ReactDOM.findDOMNode(this.refs.chatPanel);
    this.chatPanel=chatPanel;
    //延迟执行..
    setTimeout(()=>{

      if(this.props.isPulling){
        chatPanel.scrollTop=chatPanel.scrollHeight-this.preScrollHeight;
      }else{
        chatPanel.scrollTop = chatPanel.scrollHeight;
      }
    },0)
  };
  getNextMessageType=()=>{
    const messages =this.props.children;
    return messages.length==0?"right":(messages[messages.length-1].props.type||"left");
  };
  render() {
    const classes=classnames({
      [styles['chat-panel']]:true
    });
    const {isAnimate}=this.props;
    const duration=isAnimate?500:0;

      return (
        <QueueAnim className={classes}
                   type={this.getNextMessageType()}
                   component="div"
                   duration={duration}
                   interval={0}
                   onEnd={this.scrollChatPanelToBottom}
                   ref={"chatPanel"}>

          {this.props.children}
        </QueueAnim>
      )


  }
}
class ChatMessage extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    const {type="left",children}=this.props;
    const classes=classnames({
      [styles['chat-message']]:true,
    });
    const contentClasses=classnames({
      [styles['chat-message-content']]:true,
      [styles['chat-message-content-right']]:type=='right',
      [styles['chat-message-content-left']]:type=='left',
    });
    return (
      <div className={classes}>
        <p className={contentClasses}>
          {children}&nbsp;
        </p>
      </div>
    )
  }
}

const ChatInput=({onChangeHandle,sendHandle,value})=>{
  const classes=classnames({
    [styles['chat-input-wrap']]:true,
  });
  const onKeyPress=(e)=>{
    if(e.keyCode==13){

    }
  };
  return (
    <div className={classes}>
      <Input type="textarea"
             value={value}
             onChange={onChangeHandle}
             className={styles['chat-input']}
             onPressEnter={sendHandle}
      />
      <Button className={styles['chat-button']}
              type="primary"
              onClick={sendHandle}
              size="small">发送</Button>
    </div>
  )
};
ChatBox.ChatMessage=ChatMessage;
export default ChatBox;

