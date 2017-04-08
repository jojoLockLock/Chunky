/**
 * Created by Administrator on 2017/3/28.
 */
import React from 'react';
import { connect } from 'dva';
import { Link} from 'dva/router';
import {Button,Spin,message,Row,Col} from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './HomePage.css';
import ChatBox from '../../components/ChatBox/ChatBox';
import SideBar from '../../components/Sidebar/SideBar';
import {socketHost} from '../../config/apiConfig';
import {GLOBAL_MSG_DURATION} from '../../config/componentConfig';
//message 与组件名字冲突！！！！！！！！！！！
const ChatMessage =ChatBox.ChatMessage;
const SideBarItem=SideBar.Item;
class HomePage extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      text:"",
      isConnect:false,
      messages:[
      ]
    };

  }
  componentDidMount=()=>{
    this.linkToSocket();
  };
  componentWillUnmount=()=>{
    this.socket.onclose=null;
    this.closeLink();
  };
  componentWillReceiveProps=(nextProps)=>{

  };
  shouldComponentUpdate=(nextProps)=>{
    //由于动画效果产生的延迟，导致promise错误，没登录时不重新render
    return nextProps.log.isLogin;
  };
  messageOnChange=(e)=>{
    this.setState({
      text:e.target.value
    })
  };
  sendMessage=(e)=>{
    const {text,messages,isConnect}=this.state;
    if(text==''){
      return;
    }
    if(isConnect===true){
        messages.push({
            content:text,
            type:'right',
        });
        this.socket.send(JSON.stringify({'operaCode':2,content:text}));
    }else{
      message.error('socket未连接',GLOBAL_MSG_DURATION)
    }
    setTimeout(()=>{
      this.setState({
        text:"",
        messages,
      });
    },0)
  };
  linkToSocket=()=>{
    let socket = new WebSocket( socketHost);
    this.socket=socket;
    try {
      socket.onopen = (msg)=>{
        let userId=this.props.log.loginData.userId;
        socket.send(JSON.stringify({"operaCode":1,"userId":userId}));
        this.setState({
          isConnect:true
        });
        message.info("连接成功",3);
      };

      socket.onmessage = (msg)=>{
        if (typeof msg.data == "string") {
          const {messages} =this.state;
          let res=JSON.parse(msg.data);
          if(res['responseCode']==3){
            messages.push({
              content:res.content,
              type:'left',
            });
            this.setState({
              messages,
            })
          }
        }
        else {
          message.info("非文本消息",GLOBAL_MSG_DURATION);
        }
      };
      socket.onclose = ()=> {
        this.setState({
          isConnect:false,
        });
        message.warn("连接已关闭",GLOBAL_MSG_DURATION);
      };

    }
    catch (ex) {
      message.error(ex,3);
    }

    if (window.addEventListener) {
      window.addEventListener('beforeunload', this.closeLink);

    } else {
      window.attachEvent('onbeforeunload', this.closeLink);
    }
  };
  closeLink=()=>{
    let socket=this.socket;
    try {
      socket.close();
      socket = null;
    }
    catch (ex) {
      new Error(ex);
    }
  };
  render() {
    const {messages,isConnect} = this.state;
    const {addressList}=this.props.log.loginData;
    const {loading=false} =this.props;
    let target=addressList[0];
    return (
      <QueueAnim duration={800} animConfig={{ opacity: [1, 0], translateY: [0, 100] }}>
        <div className={styles["app-home"]} key="home">
          {/*<div>*/}
            {/*<h1>状态{isConnect?"在线":"离线"}*/}
              {/*<Button type="primary"*/}
                      {/*onClick={this.linkToSocket}*/}
                      {/*disabled={isConnect}>*/}
                {/*连接*/}
              {/*</Button>*/}
            {/*</h1>*/}
            {/*<pre style={{float:'right'}}>*/}
              {/*{JSON.stringify(this.props.log.loginData.addressList,null,4)}*/}
            {/*</pre>*/}
          {/*</div>*/}
          <Spin spinning={loading}>
            <Row style={{width:'500px'}} className={styles['vertical-projection']}>
              <Col span={6}  style={{height:'500px'}}>
                <SideBar activeKey={[`address${target.userId}`]}>
                  {addressList.map(item=>{
                    return <SideBarItem key={`address${item.userId}`}>{item.userName}</SideBarItem>
                  })}
                </SideBar>
              </Col>
              <Col span={18} style={{height:'500px'}}>
                <ChatBox onChangeHandle={this.messageOnChange}
                         sendHandle={this.sendMessage}
                         text={this.state.text}
                         title={<p style={{textAlign:'center'}}>{`Chat with ${target?target.userName:"= ="}`}</p>}
                >
                  {messages.map((msg,index)=>
                    <ChatMessage type={msg.type} key={`message${index}`}>{msg.content}</ChatMessage>
                  )}
                </ChatBox>
              </Col>
            </Row>
          </Spin>
          {/*<div style={{width:'300px'}}>*/}


          {/*</div>*/}
          {/*<div>*/}

          {/*</div>*/}
        </div>
      </QueueAnim>
    )


  }
}
const select=(state)=>{
  const {log,message}=state;

  return {
    loading:state.loading.models.log,
    log,
    message,
  }
};

export default connect(select)(HomePage);




