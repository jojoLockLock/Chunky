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


class ChatBox2 extends React.Component{
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let chatPanel=this._chatPanel,
        scrollBlock=this._scrollBlock;
    $(chatPanel).on('mousewheel', this.panelOnMouseWheel);
    // this._scrollBlock.addEventListener('mousedown',(e)=> {
    //   console.info(e);
    //
    //   window.addEventListener('mousemove',move);
    //   window.addEventListener('mouseup',(e)=>{
    //     console.info("up");
    //     window.removeEventListener('mousemove',move);
    //   })
    // });
    // function move(e) {
    //   console.info(e);
    // }
    this.addEmpty();
    this.scrollPanelTo(100000);

  }
  componentDidUpdate() {
    this.addEmpty();
  }
  panelOnMouseWheel=(e)=>{
    if(Object.is(e.deltaY,1)){
      this.scrollPanelTo(this._chatPanelScrollTop-30);
    }else{
      this.scrollPanelTo(this._chatPanelScrollTop+30);
    }
  };
  //移动到响应的高度
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

    }
    if(chatPanelScrollTop===maxScrollTop){

    }
    //显示和隐藏滑块
    clearTimeout(this.scrollBlockTimer);
    scrollBlock.style.opacity=1;
    this.scrollBlockTimer=setTimeout(()=>{
      scrollBlock.style.opacity=0;
    },3000);
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
  addEmpty=()=>{
    let chatPanel=this._chatPanel,
        childList=Array.from(chatPanel.children),
        totalHeight=0,
        paddingTop,
        {scrollTopCallBack}=this.props;
    childList.forEach(child=>{
      totalHeight+=child.clientHeight;
    });
    paddingTop=chatPanel.clientHeight-totalHeight;
    if(paddingTop>0){
      chatPanel.style.paddingTop=paddingTop+"px";
    }else if(scrollTopCallBack){
      chatPanel.style.paddingBottom="30px";
    }
  };
  render() {
    return (<div className={styles["chat-box"]}>
      <div className={styles["chat-panel"]} ref={(target)=>{ this._chatPanel=target  }}>
        <ChatMessage type="right" content="1111111111111111111111111111===========..................................................."/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
        <ChatMessage type="left" content="222"/>
      </div>
      <div className={styles["chat-scroll-block"]} ref={(target)=>{ this._scrollBlock=target  }}>
      </div>
    </div>)
  }
}

const ChatMessage=({content,type})=>{
  const contentClasses=classnames({
    [styles["chat-message-content-center"]]:type==="center"||false,
    [styles["chat-message-content-right"]]:type==="right"||false,
    [styles["chat-message-content-left"]]:type==="left"||false,
    [styles["chat-message-content"]]:true,
    [styles["chat-message-animate-left"]]:type==="left"||false,
    [styles["chat-message-animate-right"]]:type==="right"||false,
  });
  return (
    <div className={styles["chat-message"]}>
      <div className={contentClasses}>
        {content}
      </div>
    </div>
  )
};


export default ChatBox2;
