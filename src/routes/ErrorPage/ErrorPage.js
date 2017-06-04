
/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim'
import ErrorHolder from '../../components/ErrorHolder/ErrorHolder';
import ChatBox2 from '../../components/ChatBox/ChatBox2';

class ErrorPage extends React.Component{
  constructor(props){
    super(props);
    this.state={
      messages:[],
      value:"",
      shouldScrollToBottom:false
    }
  }
  onChange=(e)=>{
    this.setState({
      value:e.target.value
    })
  };
  sendMessage=()=>{
    // console.info(this.state.value);
    let messages=[
      ...this.state.messages,
      {
        content:this.state.value,
        type:"right",
        key:this.state.messages.length+""
      }
    ];
    this.setState({
      messages,
      value:"",
    })
  };
  onFocus=()=>{
    this.setState({
      shouldScrollToBottom:true
    })
  };
  render() {
    return (
      <QueueAnim duration={800} animConfig={{ opacity: [1, 0], translateY: [0, 100] }}>
        {/*<div  key="error">*/}
          {/*<ErrorHolder>*/}
            {/*{"居然被你找到了 404"}*/}
          {/*</ErrorHolder>*/}
        {/*</div>*/}
        <div style={{border:"1px solid black",height:"400px",width:"600px"}}>
          <ChatBox2 shouldScrollToBottom={this.state.shouldScrollToBottom}>
            {this.state.messages.map(m=>{
              return <ChatBox2.ChatMessage type={m.type} key={m.key}>
                {m.content}
              </ChatBox2.ChatMessage>
            })}
          </ChatBox2>
        </div>
        <div style={{border:"1px solid black",height:"200px",width:"600px"}}>
          <ChatBox2.ChatInput onChange={this.onChange}
                              onFocus={this.onFocus}
                              onConfirm={this.sendMessage}
                              onPressEnter={this.sendMessage}
                              value={this.state.value} />
        </div>
      </QueueAnim>
    )
  }
}
export default connect()(ErrorPage);
