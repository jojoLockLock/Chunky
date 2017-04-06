/**
 * Created by Administrator on 2017/4/6.
 */
import React from 'react';
import styles from './ChatBox.css';
import classnames from 'classnames';
import {Input,Button} from 'antd';
const ChatBox=({className,onChangeHandle,sendHandle,children,text,title})=>{
  const classes=classnames({
    [className]:className||false,
    [styles['chat-box']]:true,
  });
  return (
    <div className={classes}>
      <ChatTitle>{title}</ChatTitle>
      <ChatPanel >
        {children}
      </ChatPanel>
      <ChatInput onChangeHandle={onChangeHandle} sendHandle={sendHandle} value={text}/>
    </div>
  )
};

const {PropTypes} =React;
ChatBox.propTypes={
  className:PropTypes.string,
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
    let chatPanel=this.chatPanel;
    chatPanel.scrollTop = chatPanel.scrollHeight;
  };
  getChatMessage=()=>{
    const {message} =this.props.children;
    return React.Children.map(message,(child,index)=>{
      // if(!child){
      //   return null;
      // }
      //
      // const {order}=child.props;
      // // const key='123';
      // let classes=classnames({
      //   [`${classPrefix}-tab`]:true,
      //   [`${classPrefix}-active`]:activeOrder==order,
      //   [`${classPrefix}-disabled`]:child.props.disabled
      // });
      //
      // let event={};
      // if(!child.props.disabled){
      //   event={
      //     onClick:this.props.onTabClick.bind(this,order)
      //   }
      // }
      //
      // const ref={};
      // if(activeOrder === order){
      //   ref.ref='activeTab';
      // }
      //
      // return (
      //   <li role="tab"
      //
      //       aria-disabled={child.props.disabled?'true':'false'}
      //       aria-selected={activeOrder === order?'true':'false'}
      //       {...event}
      //       className={classes}
      //       key={order}
      //       {...ref}
      //   >
      //     {child.props.tab}
      //   </li>
      // )
    })
  };
  render() {
    const classes=classnames({
      [styles['chat-panel']]:true
    });
    return (
      <div className={classes} ref={target=>this.chatPanel=target}>
        {this.props.children}
      </div>
    )
  }
}
const ChatMessage=({type="left",children})=>{
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
};
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
              onClick={sendHandle}
              size="small">发送</Button>
    </div>
  )
};
ChatBox.ChatMessage=ChatMessage;
export default ChatBox;

