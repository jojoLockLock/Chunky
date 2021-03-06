/**
 * Created by jojo on 2017/5/10.
 */
import React from 'react';
import styles from './ChatBox2.css';
import classnames from 'classnames';
import {Input,Button,Spin,Icon} from 'antd';
import QueueAnim from 'rc-queue-anim';
import ReactDOM from 'react-dom';
import TweenOne from 'rc-tween-one';
import $ from 'jquery';
//解决鼠标滚轮事件兼容问题
import 'jquery-mousewheel';

//进行属性校验
const {PropTypes} =React;


class ChatBox2 extends React.Component{
  constructor(props) {
    super(props);
    this.preScrollHeight=0;
  }

  componentDidMount() {
    let chatPanel=this._chatPanel;

    $(chatPanel).on('mousewheel', this.panelOnMouseWheel);
    this.addTouchEvent();
    this.addMouseDragEvent();
    this.addEmpty();
    this.scrollPanelTo(100000);
  }
  addMouseDragEvent=()=>{
    let scrollBlock=this._scrollBlock,
        chatPanel=this._chatPanel;
    scrollBlock.addEventListener('mousedown',(e)=> {
      let preClass=chatPanel.className,
          offsetY=e.offsetY;
      chatPanel.className+=` ${styles["ban-select-text"]}`;
      const move=(e)=> {
        let targetTop=e.clientY-chatPanel.getBoundingClientRect().top-offsetY;
        //按照比例滚动..
        if(targetTop>0){
          this.scrollPanelTo(targetTop/chatPanel.clientHeight*chatPanel.scrollHeight)
        }else{
          this.scrollPanelTo(0);
        }
      };
      window.addEventListener('mousemove',move);
      window.addEventListener('mouseup',()=>{
        chatPanel.className=preClass;
        window.removeEventListener('mousemove',move);
      })
    });
  };
  addTouchEvent=()=>{
    let chatPanel=this._chatPanel,
        scrollBlock=this._scrollBlock;
    chatPanel.addEventListener('touchstart',(e)=> {
      let preClass=chatPanel.className,
          offsetY=scrollBlock.offsetTop,
          startY=e.touches[0].clientY;
      chatPanel.className+=` ${styles["ban-select-text"]}`;
      const move=(e)=> {
        let targetTop=offsetY+e.touches[0].clientY-startY;
        console.info(targetTop);
        //按照比例滚动..
        if(targetTop>0){
          this.scrollPanelTo(targetTop/chatPanel.clientHeight*chatPanel.scrollHeight)
        }else{
          this.scrollPanelTo(0);
        }
      };
      window.addEventListener('touchmove',move);
      window.addEventListener('touchend',()=>{
        chatPanel.className=preClass;
        window.removeEventListener('touchmove',move);
      })
    });
  };
  componentDidUpdate() {
    this.addEmpty();
    this.updateChatPanelScrollTop();
    if(this.props.shouldScrollToBottom){
      this.scrollPanelTo(100000);
    }
    this._scrollBlock.style.opacity=0;
    //设置滑块的top和height
    setTimeout(()=>{
      this.setScrollBlockTop();
      this.setScrollBlockHeight();
    },500);
  }
  //添加信息后，chatPanelScrollTop调整
  updateChatPanelScrollTop() {
    let chatPanel=this._chatPanel;
    this._chatPanelScrollTop+=(chatPanel.scrollHeight-this.preScrollHeight);
    this.preScrollHeight=chatPanel.scrollHeight;

  }
  panelOnMouseWheel=(e)=>{
    if(Object.is(e.deltaY,1)){
      this.scrollPanelTo(this._chatPanelScrollTop-30);
    }else{
      this.scrollPanelTo(this._chatPanelScrollTop+30);
    }
  };
  //移动chatPanel到指定的高度
  scrollPanelTo=(top)=>{
    let chatPanel=this._chatPanel,
        scrollBlock=this._scrollBlock,
        maxScrollTop=chatPanel.scrollHeight-chatPanel.clientHeight,
        chatPanelScrollTop;
    //设置rotate180deg对应的scrollTop
    chatPanelScrollTop=top<=maxScrollTop?top:maxScrollTop;
    chatPanelScrollTop=chatPanelScrollTop<=0?0:chatPanelScrollTop;
    this._chatPanelScrollTop=chatPanelScrollTop;
    //设置真实的scrollTop
    chatPanel.scrollTop=maxScrollTop-top;


    if(chatPanelScrollTop===0){
      if(this.props.scrollToTopCallBack){
        this.props.scrollToTopCallBack();
      }

    }
    if(chatPanelScrollTop===maxScrollTop){

    }
    //显示和隐藏滑块
    clearTimeout(this.scrollBlockTimer);
    scrollBlock.style.opacity=1;
    this.scrollBlockTimer=setTimeout(()=>{
      scrollBlock.style.opacity=0;
    },1000);
    //设置滑块的top和height
    this.setScrollBlockTop();
    this.setScrollBlockHeight();
  };
  setScrollBlockTop=()=>{
    let scrollBlock=this._scrollBlock,
        chatPanel=this._chatPanel,
        scrollHeight=chatPanel.scrollHeight;
        scrollBlock.style.top=this._chatPanelScrollTop/scrollHeight*100+"%";

  };
  setScrollBlockHeight=()=>{
    let scrollBlock=this._scrollBlock,
        chatPanel=this._chatPanel,
        clientHeight=chatPanel.clientHeight,
        scrollHeight=chatPanel.scrollHeight;
    scrollBlock.style.height=clientHeight*clientHeight/scrollHeight+'px';

    if(parseInt(scrollBlock.style.height)===clientHeight){
      scrollBlock.style.opacity=0;
    }
  };
  //添加空白..
  addEmpty=()=>{
    let chatPanel=this._chatPanel,
        childList=Array.from(chatPanel.children),
        totalHeight=0,
        paddingTop,
        {canPull}=this.props;
    childList.forEach(child=>{
      totalHeight+=child.clientHeight;
    });
    paddingTop=chatPanel.clientHeight-totalHeight;
    if(paddingTop>0){
      chatPanel.style.paddingTop=paddingTop+"px";
    }else{
      chatPanel.style.paddingTop=0;
    }
    if(canPull){
      chatPanel.style.paddingBottom="30px";
    }
  };
  static defaultProps = {
    children:[],
    isAnimate:true,
    shouldScrollToBottom:true,
    loading:false,
  };
  render() {
    const {children,isAnimate,style}=this.props;
    return (
    <div className={styles["chat-box"]} style={style}>
      <div className={styles["chat-panel"]} ref={(target)=>{ this._chatPanel=target  }}>
        {children.map((child,index)=>{
          let reverseChild=children[children.length-1-index];
          return <ChatMessage {...reverseChild.props}  key={reverseChild.key} isAnimate={isAnimate}/>
        })}
      </div>
      <div className={styles["chat-scroll-block"]} ref={(target)=>{ this._scrollBlock=target  }}/>
      {this.props.loading?<span className={styles["chat-panel-loading"]}><Icon type="loading" /></span>:null}
    </div>)
  }
}

const ChatMessage=({content,type,children,isAnimate,className})=>{
  const contentClasses=classnames({
    [styles["chat-message-content-center"]]:type==="center"||false,
    [styles["chat-message-content-right"]]:type==="right"||false,
    [styles["chat-message-content-left"]]:type==="left"||false,
    [styles["chat-message-content"]]:true,
    [styles["chat-message-animate-left"]]:isAnimate&&(type==="left"||false),
    [styles["chat-message-animate-right"]]:isAnimate&&(type==="right"||false),
    [className]:true,
  });
  return (
    <div className={styles["chat-message"]}>
      <div className={contentClasses}>
        {content||children}
      </div>
    </div>
  )
};
ChatBox2.propTypes={
    className:PropTypes.string,
    canPull:PropTypes.bool,
    shouldScrollToBottom:PropTypes.bool,
    scrollToTopCallBack:PropTypes.func,
};

class ChatInput extends React.Component{
  constructor(props) {
    super(props);
  }
  onKeyDown=(e)=>{
  let keyCode = e.keyCode || e.which || e.charCode,
      ctrlKey = e.ctrlKey || e.metaKey;
    if(ctrlKey && keyCode === 13) {
      e.preventDefault();
      if(this.props.onPressEnter){
        this.props.onPressEnter();
      }
      return false;
    }
  };
  onFocus=()=>{
    this.panel.style.backgroundColor="white";
    if(this.props.onFocus){
      this.props.onFocus();
    }
  };
  onBlur=()=>{
    this.panel.style="";
    if(this.props.onBlur){
      this.props.onBlur();
    }
  };
  render() {
    return (
      <div className={styles["chat-input-panel"]} ref={(target)=>{this.panel=target;}}>
        <textarea  type="textarea"
                   className={styles["chat-input"]}
                   placeholder="your message"
                   onFocus={this.onFocus||null}
                   onBlur={this.onBlur||null}
                   onKeyDown={this.onKeyDown}
                   defaultValue={this.props.defaultValue}
                   value={this.props.value}
                   onChange={this.props.onChange}/>
        <Button className={styles["btn-confirm"]}
                size="small"
                type="primary"
                onClick={this.props.onConfirm}>发送 Ctrl+Enter</Button>
      </div>
    )
  }
}
ChatInput.propTypes={
  onFocus:PropTypes.func,
  onKeyDown:PropTypes.func,
  onConfirm:PropTypes.func,
  value:PropTypes.string,
};
ChatBox2.ChatMessage=ChatMessage;
ChatBox2.ChatInput=ChatInput;
export default ChatBox2;
