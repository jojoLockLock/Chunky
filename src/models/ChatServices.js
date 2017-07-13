/**
 * Created by jojo on 2017/7/13.
 */
import ApiConfig from '../config/ApiConfig';
import request from '../utils/request';
import Socket from '../utils/socket';
const {httpApi,socketApi}=ApiConfig;


export async function connectSocket({token,onClose}) {

  const socket = new Socket(`ws://localhost:3000?token=${token}`);

  socket.onClose(onClose);

  return socket.connect();
}
