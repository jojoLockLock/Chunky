/**
 * Created by Administrator on 2017/3/29.
 */
export const  mockConfig={
  isMocking:true,
  url:{
    login:'/api/login'
  }
};
if(mockConfig.isMocking){
  console.warn('mocking pattern');
}
//web socket服务器的地址
export const socketServer={
  ip:"127.0.0.1",
  port:8001,
};

export const socketHost=`ws://${socketServer.ip}:${socketServer.port}/`;
