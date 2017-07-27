/**
 * Created by JoJo on 2017/4/29.
 */

class Socket {
  constructor(socketHost) {
    this.socketHost=socketHost;
    this.socket=null;
    this.isConncet=false;
    this.controllers={};
    this.onCloseCallback=null;
  }
  onClose(fn) {
    if(!Object.is(typeof fn,'function')){
      throw new Error('on close must a object');
    }
    this.onCloseCallback=fn;
  }
  init() {
    this.socket.onmessage=(msg)=>{
      try{
        console.info(msg);
        const data=JSON.parse(msg.data);
        const {controllers}=this;
        if(controllers[data.type]){
          controllers[data.type](data);
        }else if(controllers["__redirect__"]){
          controllers["__redirect__"](data);
        }
      }catch (e){
        console.info(e);
      }
    }
  }
  connect() {
    return new Promise((resolve,reject)=>{
      const {socketHost}=this;

      if(this.isConncet){
        return reject(new Error(`socket:${socketHost} has connection`))
      }

      const socket=new WebSocket(socketHost);

      socket.onopen=()=>{
        this.isConncet=true;
        this.socket=socket;
        resolve(this);
      }

      socket.onmessage=(e)=>{
        this.onMessage(e.data);
      }

      socket.onclose=()=>{
        this.isConncet=false;
        this.onCloseCallback&&this.onCloseCallback();
      }

      //
      // window.addEventListener
      //   ?
      //   window.addEventListener('beforeunload', this.disconnect)
      //   :
      //   window.attachEvent('onbeforeunload', this.disconnect);


    })

  }
  disconnect=()=>{
    this.socket.close();
  }
  onMessage=(_data)=>{
    try{
      const data=JSON.parse(_data),
            {type}=data,
            {controllers}=this;
      controllers[type]&&controllers[type](data);

    }catch(e){

      console.error(e.message);

    }
  }
  sendMessage(type,payload) {
    return new Promise((resolve,reject)=>{
      if(!this.isConncet){
        return reject(new Error(`socket have not connect`));
      }
      if(!Object.is(typeof type,'string')){
        return reject(new Error(`type must a string`))
      }
      if(!Object.is(typeof payload,'object')){
        return reject(new Error('payload must a object'))
      }
      this.socket.send(JSON.stringify({type,payload}));
      resolve();
    })
  }
  addController(type,controller) {
    if(!Object.is(typeof type,'string')){
      throw new Error(`type must a string`);
    }
    if(!Object.is(typeof controller,'function')){
      throw new Error('controller must a object');
    }
    this.controllers[type]=controller;
  }
}


export default Socket
