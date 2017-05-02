/**
 * Created by JoJo on 2017/4/29.
 */

class Socket {
  constructor(socketHost) {
    this.socketHost=socketHost;
    this.socket=null;
    this.isConncet=false;
    this.controllers={};
  }
  onClose() {

  }
  init() {
    this.socket.onmessage=(msg)=>{
      try{
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
  link() {
    return new Promise((resolve,reject)=>{
      const {socketHost}=this;
      if(this.isConncet){
        reject(new Error(`socket have link in ${socketHost}`));
      }else{
        const socket=new WebSocket(socketHost);
        this.socket=socket;
        socket.onopen=()=>{
          this.isConncet=true;
          this.init();
          socket.onclose=()=>{
            if(this.onClose){
              this.onClose()
            }
          };
          resolve(this);
          if (window.addEventListener) {
            window.addEventListener('beforeunload', this.close);

          } else {
            window.attachEvent('onbeforeunload', this.close);
          }
        }
      }
    })
  }
  close() {
    return new Promise((resolve,reject)=>{
      if(!this.isConncet){
        resolve(new Error('socket have not linking'));
      }
      let socket=this.socket;
      try {
        socket.close();
        socket = null;
        this.isConncet=false;
        resolve();
      }
      catch (err) {
        reject(err);
      }
    })
  }
  send(type,payload) {
    return new Promise((resolve,reject)=>{
      if(!this.isConncet){
        reject(new Error(`socket have not linking`));
      }
      if(!Object.is(typeof type,'string')){
        reject(new Error(`type must a string`))
      }
      if(!Object.is(typeof payload,'object')){
        reject(new Error('payload must a object'))
      }
      this.socket.send(JSON.stringify({type,...payload}));
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
  addRedirect(controller) {
    if(!Object.is(typeof controller,'function')){
      throw new Error('controller must a object');
    }
    this.controllers['__redirect__']=controller;
  }
}


export default Socket
