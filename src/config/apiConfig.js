/**
 * Created by Administrator on 2017/3/29.
 */
export const  mockConfig={
  isMocking:true,
  url:{
    login:'/api/login'
  }
};
//web socket服务器的地址
export const socketServer={
  ip:"192.168.1.5",
  port:8001,
};

export const socketHost=`ws://${socketServer.ip}:${socketServer.port}/`;
