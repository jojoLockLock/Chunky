/**
 * Created by Administrator on 2017/4/6.
 */
import React from 'react';
import styles from './ChatBox.css';
import classnames from 'classnames';
import {Input,Button,Spin,Icon} from 'antd';
import QueueAnim from 'rc-queue-anim';
import ReactDOM from 'react-dom';
import TweenOne from 'rc-tween-one';
import $ from 'jquery';
//解决鼠标滚轮事件兼容问题
import 'jquery-mousewheel';

class ChatBox extends React.Component{
  constructor(props) {
    super(props);
  }
  chatPanelScrollToBottom=()=>{

  }
  render() {
    const {scrollToTopCallBack,
      className,
      onChangeHandle,
      sendHandle,
      children,
      text,
      title,
      loading,
      pull,
      isAnimate=true}=this.props;
    const classes=classnames({
      [className]:className||false,
      [styles['chat-box']]:true,
    });
    return (
      <div className={classes}>
        <ChatTitle>{title}</ChatTitle>
        <ChatPanel isAnimate={isAnimate}
                   loading={loading}
                   pull={pull}
                   scrollToTopCallBack={scrollToTopCallBack}>
          {children.map((child,index)=>{
            let reverseChild=children[children.length-1-index];
            return <ChatMessage {...reverseChild.props}  key={reverseChild.key}/>
          })}
        </ChatPanel>
        <ChatInput onChangeHandle={onChangeHandle} sendHandle={sendHandle} value={text}/>
      </div>
    )
  }
}
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



//信息内容面板
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
    this.addEmpty();
    $(chatPanel).on('mousewheel', this.panelOnScroll);
  };

  panelOnScroll=(event)=>{
    let chatPanel=this.chatPanel,
        scrollBlock=this.scrollBlock,
        {scrollHeight,scrollTop,clientHeight}=chatPanel,
        //翻转后的高度
        reverseTop=scrollHeight-clientHeight-scrollTop;
    //如果可滚动高度 大于可视区域高度加填充，则显示滚动条
    if(scrollHeight>clientHeight+30){
      scrollBlock.style.opacity=1;
    }
    //清楚隐藏计时器
    clearTimeout(this.hideScrollBlockTimer);
    //开启隐藏计时器
    this.hideScrollBlockTimer=setTimeout(()=>{
      scrollBlock.style.opacity=0;
    },1000);
    //计算滑块位置
    scrollBlock.style.top=reverseTop/scrollHeight*100+"%";
    if(Object.is(event.deltaY,-1)){
      chatPanel.scrollTop-=30;
    }else{
      chatPanel.scrollTop+=30;
    }
    //到达顶部时回调
    if(Object.is(reverseTop,0)&&Object.is(event.deltaY,1)){
      if(this.props.scrollToTopCallBack){
        this.props.scrollToTopCallBack();
        scrollBlock.style.opacity=0;
      }
    }
    //到达底部时的回调
    if(Object.is(chatPanel.scrollTop,0)){

    }
  };
  //当内容高度不足 可视区域高度 充填padding 使信息置顶
  addEmpty=()=>{
    let chatPanel=this.chatPanel,
      {scrollHeight,clientHeight,children}=chatPanel;
    if(scrollHeight<=clientHeight+30){
      let child=children[children.length-1];
      if(child){
        chatPanel.style.paddingTop=clientHeight-children.length*child.clientHeight+'px';

      }
    }
  };
  componentDidUpdate=()=>{
    if(this.shouldScrollToBottom){
      this.scrollToBottom();
    }
    this.setScrollBlockHeight();
    this.addEmpty();
    //如果状态为不可以拉取 则不添加空白填充
    if(!this.props.pull){
      this.chatPanel.style.paddingBottom="0px";
    }
  };
  componentWillReceiveProps=(nextProps)=>{
    this.chatPanel.style.paddingTop=0;
    //判定新信息是否为加入底部且信息type为right. 是则更新后跳转到底部
    if((!Object.is(this.props.children.length,0))&&(!Object.is(nextProps.children.length,0))){
      if(!Object.is(nextProps.children[0].key,this.props.children[0].key)){
        if(Object.is(nextProps.children[0].props.type,'right')){
          this.shouldScrollToBottom=true;
        }
      }
    }

  };
  //设置滑块的高度
  setScrollBlockHeight=()=>{
    let {chatPanel,scrollBlock}=this,
        {scrollHeight,clientHeight}=chatPanel;
        scrollBlock.style.height=clientHeight*clientHeight/scrollHeight+'px';

  };
  //滚动到底部
  scrollToBottom=()=>{
    let chatPanel=this.chatPanel;
    setTimeout(()=>{
        chatPanel.scrollTop=0;
        this.shouldScrollToBottom=false;
    })
  };
  getNextMessageType=()=>{
    const messages =this.props.children;
    return Object.is(messages.length,0)?"right":(messages[messages.length-1].props.type||"left");
  };
  render() {
    const classes=classnames({
      [styles['chat-panel']]:true
    });
      return (
        <div className={styles["chat-panel-wrap"]}>

          {this.props.loading?<span className={styles["chat-panel-loading"]}><Icon type="loading" /></span>:null}
          <div className={styles["chat-panel-scroll-block"]} ref={"scrollBlock"}> </div>
          <div className={classes}
               type={this.getNextMessageType()}
               ref={"chatPanel"}>
            {this.props.children}
          </div>
        </div>
      )


  }
}
//Message组件
class ChatMessage extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    const {type="left",children,isAnimate}=this.props;
    const classes=classnames({
      [styles['chat-message']]:true,
    });
    const contentClasses=classnames({
      [styles['chat-message-content']]:!Object.is(type,"center"),
      [styles['chat-message-content-right']]:Object.is(type,"right"),
      [styles['chat-message-content-left']]:Object.is(type,"left"),
      [styles['chat-message-content-center']]:Object.is(type,"center"),
      [styles['chat-message-animate-left']]:Object.is(type,'left'),
      [styles['chat-message-animate-right']]:Object.is(type,'right'),
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
//输入组件
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
             onFocus={()=>{
               console.info("...");
             }}
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

