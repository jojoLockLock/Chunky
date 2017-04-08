/**
 * Created by Administrator on 2017/4/6.
 */
import React from 'react';
import styles from './ChatBox.css';
import classnames from 'classnames';
import {Input,Button} from 'antd';
import QueueAnim from 'rc-queue-anim';
import ReactDOM from 'react-dom';
const ChatBox=({className,onChangeHandle,sendHandle,children,text,title,isAnimate=true})=>{
  const classes=classnames({
    [className]:className||false,
    [styles['chat-box']]:true,
  });
  return (
    <div className={classes}>
      <ChatTitle>{title}</ChatTitle>
      <ChatPanel isAnimate={isAnimate}>
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
  }
  componentDidMount=()=>{
    this.scrollChatPanelToBottom();
  };
  componentDidUpdate=()=>{
    this.scrollChatPanelToBottom();
  };
  scrollChatPanelToBottom=()=>{
    let chatPanel=ReactDOM.findDOMNode(this.refs.chatPanel);
    //延迟执行..
    setTimeout(()=>{
      chatPanel.scrollTop = chatPanel.scrollHeight;
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
    if(isAnimate){
      return (
        <QueueAnim className={classes}
                   type={this.getNextMessageType()}
                   component="div"
                   ref={"chatPanel"}>
          {this.props.children}
        </QueueAnim>
      )
    }else{
      return (
        <div className={classes}
             type={this.getNextMessageType()}
             ref={"chatPanel"}>
          {this.props.children}
        </div>
      )
    }
    
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

