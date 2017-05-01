/**
 * Created by Administrator on 2017/4/6.
 */
import React from 'react';
import styles from './ChatBox.css';
import classnames from 'classnames';
import {Input,Button,Spin} from 'antd';
import QueueAnim from 'rc-queue-anim';
import ReactDOM from 'react-dom';
import TweenOne from 'rc-tween-one';
import $ from 'jquery';
import 'jquery-mousewheel';
const ChatBox=({scrollToTopCallBack,
    className,
    onChangeHandle,
    sendHandle,
    children,
    text,
    title,
    keepScrollLocation,
    onScroll,
    isAnimate=true})=>{
  const classes=classnames({
    [className]:className||false,
    [styles['chat-box']]:true,
  });
  return (
    <div className={classes}>
      <ChatTitle>{title}</ChatTitle>
        <ChatPanel isAnimate={isAnimate}
                   onScroll={onScroll}

                   keepScrollLocation={keepScrollLocation}
                   scrollToTopCallBack={scrollToTopCallBack}>
          {children.map((child,index)=>{
            let reverseChild=children[children.length-1-index];
            return <ChatMessage {...reverseChild.props}  key={reverseChild.key}/>
          })}
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
    this.lastLength=0;
    this.scrollToBottom=false;
    this.state={
      isPulling:false
    }
  }
  componentDidMount=()=>{
    this.chatPanel=ReactDOM.findDOMNode(this.refs.chatPanel);
    let chatPanel=this.chatPanel;
    $(chatPanel).on('mousewheel', (event)=> {
      if(event.deltaY==-1){
        chatPanel.scrollTop-=30;
      }else{
        chatPanel.scrollTop+=30;
      }
      this.panelOnScroll();

    });
    // if (window.addEventListener) {
    //   chatPanel.addEventListener('scroll', this.panelOnScroll);
    //
    // } else {
    //   chatPanel.attachEvent('onscroll', this.panelOnScroll);
    // }
    // this.onEnd();
  };
  componentWillUnmount=()=>{
  };
  panelOnScroll=()=>{
    let chatPanel=this.chatPanel;
    if(chatPanel.scrollTop+chatPanel.clientHeight==chatPanel.scrollHeight){
      if(this.props.scrollToTopCallBack){
        this.props.scrollToTopCallBack();
        console.info("loading");
      }
      //弹性
    }
    // if(chatPanel.scrollTop==0&&(!chatPanel.flag)){
    //   chatPanel.flag=true;
    //   chatPanel.style.paddingTop="30px";
    //   setTimeout(()=>{
    //     console.info("..");
    //     chatPanel.style.paddingTop="0";
    //     chatPanel.flag=false;
    //   })
    // }
  };
  componentDidUpdate=()=>{
    this.onEnd();
  };
  componentWillReceiveProps=(nextProps)=>{
    this.preScrollHeight=this.chatPanel.scrollHeight;
    //暂时使用...
    if(this.props.children.length!=0&&nextProps.children.length!=0){
      if(nextProps.children[0].key!=this.props.children[0].key){
        this.scrollToBottom=true;
      }
    }

  };
  onEnd=()=>{
    let chatPanel=this.chatPanel;

    setTimeout(()=>{
      if(this.scrollToBottom){
        chatPanel.scrollTop=0;
        this.scrollToBottom=false;
      }
      // if(this.props.keepScrollLocation){
      //   chatPanel.scrollTop=chatPanel.scrollHeight-this.preScrollHeight;
      // }else{
      //   chatPanel.scrollTop = chatPanel.scrollHeight;
      // }
    })
  };

  shouldComponentUpdate=(nextProps)=>{
    return true;
  };
  getNextMessageType=()=>{
    const messages =this.props.children;
    return messages.length==0?"right":(messages[messages.length-1].props.type||"left");
  };
  render() {
    const classes=classnames({
      [styles['chat-panel']]:true
    });
    const {isAnimate,isPulling}=this.props;
    let duration=isAnimate?500:0;
      return (
        <div className={classes}
                   type={this.getNextMessageType()}

                   ref={"chatPanel"}>

          {this.props.children}
        </div>
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
      <div>
        <div className={classes} >
          <a className={contentClasses} name={`${this.props.name}`} >
            {children}&nbsp;
          </a>
        </div>
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
    <div className={classes} >
      <Input type="textarea"
             value={value}
             onChange={onChangeHandle}
             className={styles['chat-input']}
             onPressEnter={sendHandle}
             placeholder="your message..."
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

