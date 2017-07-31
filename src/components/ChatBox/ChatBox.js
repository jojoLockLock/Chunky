/**
 * Created by jojo on 2017/5/10.
 */
import React from 'react';
import styles from './ChatBox.css';
import classnames from 'classnames';
import {Input,Button,Spin,Icon} from 'antd';
import QueueAnim from 'rc-queue-anim';
import ReactDOM from 'react-dom';
import $ from 'jquery';
//解决鼠标滚轮事件兼容问题
import 'jquery-mousewheel';

//进行属性校验
const {PropTypes} =React;

const chatBoxList={};
/*
*  重构
*
* */
/*
*  ChatBox
* 参数
* canPull 能否拉取
* chatBoxKey 唯一key
* scrollToTopCallBack
* loading
* isAnimate
* */

/*
*  ChatInput
*  参数
*  onChange
*  onPressEnter
*  onConfirm
*  value
* */

/*
* ChatMessage
*
* type ：left / right / center
*
* */
class ChatBox extends React.Component{
  constructor(props) {
    super(props);
    this.preScrollHeight=0;
  }

  componentDidMount() {
    let chatPanel=this._chatPanel;

    $(chatPanel).on('mousewheel', this.panelOnMouseWheel);
    this.addTouchEvent();
    this.addMouseDragEvent();

    this.scrollPanelTo(100000);
    this.addEmpty();
    chatBoxList[this.props.configKey]=this.scrollPanelTo


    this.props.scrollToTopCallBack&&this.props.scrollToTopCallBack();

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
        let chatPanelScrollTop=null;
        if(targetTop>0){
          chatPanelScrollTop=this.scrollPanelTo(targetTop/chatPanel.clientHeight*chatPanel.scrollHeight)
        }else{
          chatPanelScrollTop=this.scrollPanelTo(0);
        }
        if(chatPanelScrollTop===0){
          if(this.props.scrollToTopCallBack){
            this.props.scrollToTopCallBack();
          }

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
        //按照比例滚动..
        let chatPanelScrollTop=null;
        if(targetTop>0){
          chatPanelScrollTop=this.scrollPanelTo(targetTop/chatPanel.clientHeight*chatPanel.scrollHeight)
        }else{
          chatPanelScrollTop=this.scrollPanelTo(0);
        }

        if(chatPanelScrollTop===0){
          if(this.props.scrollToTopCallBack){
            this.props.scrollToTopCallBack();
          }

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
    let chatPanelScrollTop=null;
    if(Object.is(e.deltaY,1)){
      chatPanelScrollTop=this.scrollPanelTo(this._chatPanelScrollTop-30);
    }else{
      chatPanelScrollTop=this.scrollPanelTo(this._chatPanelScrollTop+30);
    }

    if(chatPanelScrollTop===0){
      if(this.props.scrollToTopCallBack){
        this.props.scrollToTopCallBack();
      }

    }


  };
  //移动chatPanel到指定的高度
  scrollPanelTo=(top)=>{
    if(!this._chatPanel){
      return;
    }
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

    return chatPanelScrollTop;
  };
  setScrollBlockTop=()=>{

    if(!this._chatPanel){
      return;
    }

    let scrollBlock=this._scrollBlock,
        chatPanel=this._chatPanel,
        scrollHeight=chatPanel.scrollHeight;
        scrollBlock.style.top=this._chatPanelScrollTop/scrollHeight*100+"%";

  };
  setScrollBlockHeight=()=>{
    if(!this._chatPanel){
      return;
    }
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
    chatPanel.style.paddingTop=0;
    childList.forEach(child=>{
      totalHeight+=child.clientHeight;
    });
    paddingTop=chatPanel.offsetHeight-totalHeight;
    if(paddingTop>0){
      chatPanel.style.paddingTop=paddingTop+"px";
    }else{
      chatPanel.style.paddingTop=0;
    }
    chatPanel.style.paddingTop=paddingTop>0?`${paddingTop}px`:0;
    chatPanel.style.paddingBottom=canPull?"30px":"0";
  };
  static defaultProps = {
    children:[],
    isAnimate:true,
    shouldScrollToBottom:false,
    loading:false,
  };
  render() {
    let {children,isAnimate,style}=this.props;
    children=children.constructor!==[].constructor
      ?
      [<ChatMessage {...children.props} key={children.key} isAnimate={isAnimate}/>]
      :
      children

    return (
      <div className={styles["chat-box"]} style={style}>
        <div className={styles["chat-panel"]} ref={(target)=>{ this._chatPanel=target  }}>
          {children.map((child,index)=>{
            let reverseChild=children[children.length-1-index];
            return <ChatMessage {...reverseChild.props}
                                showIcon={this.props.showIcon}
                                key={reverseChild.key}
                                isAnimate={isAnimate}/>
          })}
        </div>
        <div className={styles["chat-scroll-block"]} ref={(target)=>{ this._scrollBlock=target  }}/>
        {this.props.loading?<span className={styles["chat-panel-loading"]}><Icon type="loading" /></span>:null}
      </div>)
  }
}

const ChatMessage=({showIcon,content,type,children,isAnimate,className,icon="http://127.0.0.1:8080/icon.jpg"})=>{


  const contentClasses=classnames({
    [styles["chat-message-content-center"]]:type==="center"||false,
    [styles["chat-message-content-right"]]:type==="right"||false,
    [styles["chat-message-content-left"]]:type==="left"||false,
    [styles["chat-message-content"]]:true,
    [styles["chat-message-animate-left"]]:isAnimate&&(type==="left"||false),
    [styles["chat-message-animate-right"]]:isAnimate&&(type==="right"||false),
    [className]:true,
  });

  const iconClasses=classnames({
    [styles["chat-message-icon-left"]]:type==="left",
    [styles["chat-message-icon-right"]]:type==="right",
    [styles["chat-message-icon"]]:true,
    [styles["chat-message-animate-left"]]:isAnimate&&(type==="left"||false),
    [styles["chat-message-animate-right"]]:isAnimate&&(type==="right"||false),
  })
  return (
    <div className={styles["chat-message"]}>
      {type!=="center"&&showIcon
        ?
        <span className={iconClasses}>
          <img src={icon} draggable={false}/>
        </span>
        :
        null}
      <div className={contentClasses}>
        {content||children}
      </div>
    </div>
  )
};

ChatBox.defaultProps={
  showIcon:true,
  isAnimate:true,

}

ChatBox.propTypes={
    className:PropTypes.string,
    canPull:PropTypes.bool,
    shouldScrollToBottom:PropTypes.bool,
    scrollToTopCallBack:PropTypes.func,
    configKey:PropTypes.string.isRequired,
    showIcon:PropTypes.bool,
};

ChatBox.scrollToBottom=function (configKey) {
  setTimeout(()=>{
    chatBoxList[configKey]&&chatBoxList[configKey](1000000);
  })
}

const chatInputs={};

class ChatInput extends React.Component{
  constructor(props) {
    super(props);
  }
  componentDidMount=()=>{
    chatInputs[this.props.configKey]=this.input;
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
                   ref={target=>this.input=target}
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
                onClick={this.props.onConfirm}>Ctrl+Enter</Button>
      </div>
    )
  }
}
ChatInput.getFocus=(configKey)=>{
  setTimeout(()=>{
    chatInputs[configKey]&&chatInputs[configKey].focus();
  })
}
ChatInput.propTypes={
  onFocus:PropTypes.func,
  onKeyDown:PropTypes.func,
  onConfirm:PropTypes.func,
  value:PropTypes.string,
};
ChatBox.ChatMessage=ChatMessage;
ChatBox.ChatInput=ChatInput;
export default ChatBox;
