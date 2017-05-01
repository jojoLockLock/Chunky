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
//解决鼠标滚轮事件兼容问题
import 'jquery-mousewheel';
const ChatBox=({scrollToTopCallBack,
    className,
    onChangeHandle,
    sendHandle,
    children,
    text,
    title,
    isAnimate=true})=>{
  const classes=classnames({
    [className]:className||false,
    [styles['chat-box']]:true,
  });
  return (
    <div className={classes}>
      <ChatTitle>{title}</ChatTitle>
        <ChatPanel isAnimate={isAnimate}
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
    this.shouldScrollToBottom=false;
  }
  componentDidMount=()=>{
    this.chatPanel=ReactDOM.findDOMNode(this.refs.chatPanel);
    this.scrollBlock=ReactDOM.findDOMNode(this.refs.scrollBlock);
    let chatPanel=this.chatPanel;
    //添加滚轮事件
    this.setScrollBlockHeight();
    $(chatPanel).on('mousewheel', this.panelOnScroll);
  };

  panelOnScroll=(event)=>{
    let chatPanel=this.chatPanel,
        scrollBlock=this.scrollBlock,
        {scrollHeight,scrollTop,clientHeight}=chatPanel,
      //翻转后的高度
        reverseTop=scrollHeight-clientHeight-scrollTop;
    scrollBlock.style.opacity=1;
    //清楚隐藏计时器
    clearTimeout(this.hideScrollBlockTimer);
    //开启隐藏计时器
    this.hideScrollBlockTimer=setTimeout(()=>{
      scrollBlock.style.opacity=0;
    },1000);

    scrollBlock.style.top=reverseTop/scrollHeight*100+"%";
    if(event.deltaY==-1){
      chatPanel.scrollTop-=30;
    }else{
      chatPanel.scrollTop+=30;
    }
    //到达顶部时回调
    if(reverseTop==0){
      if(this.props.scrollToTopCallBack){
        this.props.scrollToTopCallBack();
        scrollBlock.style.opacity=0;
      }
    }
    //到达底部时的回调
    if(chatPanel.scrollTop==0){

    }
  };
  componentDidUpdate=()=>{
    if(this.shouldScrollToBottom){
      this.scrollToBottom();
    }
    this.setScrollBlockHeight();
  };
  componentWillReceiveProps=(nextProps)=>{

    //判定新信息是否为加入底部. 是则更新后跳转到底部
    if(this.props.children.length!=0&&nextProps.children.length!=0){
      if(nextProps.children[0].key!=this.props.children[0].key){
        this.shouldScrollToBottom=true;
      }
    }

  };
  setScrollBlockHeight=()=>{
    let {chatPanel,scrollBlock}=this,
        {scrollHeight,clientHeight}=chatPanel;
        scrollBlock.style.height=clientHeight*clientHeight/scrollHeight+'px';

  };
  scrollToBottom=()=>{
    let chatPanel=this.chatPanel;
    setTimeout(()=>{
        chatPanel.scrollTop=0;
        this.shouldScrollToBottom=false;
    })
  };
  getNextMessageType=()=>{
    const messages =this.props.children;
    return messages.length==0?"right":(messages[messages.length-1].props.type||"left");
  };
  render() {
    const classes=classnames({
      [styles['chat-panel']]:true
    });
      return (
        <div className={styles["chat-panel-wrap"]}>
          <div className={styles["chat-panel-scroll-block"]} ref={"scrollBlock"}></div>
          <div className={classes}
               type={this.getNextMessageType()}
               ref={"chatPanel"}>

            {this.props.children}
          </div>
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
          <a className={contentClasses}>
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

