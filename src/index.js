import dva from 'dva';
import './index.html';
import './index.css';
import { browserHistory } from 'dva/router';
import createLoading from 'dva-loading';
import {message} from 'antd'
import {GLOBAL_MSG_DURATION} from './config/componentConfig';
import {setTemp,getTemp} from './utils/tools';
// 1. Initialize
const app = dva({
  // history:browserHistory,
  //统计处理所有异常
  onError(e) {
    message.error(e.message, GLOBAL_MSG_DURATION);
  }
});

app.model(require("./models/login"));
app.model(require("./models/chat"));

// 2. Plugins
app.use(createLoading());
app.use({
  onStateChange() {
    let store=app._store.getState(),
        log=store.log,
        chat=store.chat;

    if(log.isLogin){
      setTemp('loginData',log.loginData);
    }
    if(chat.activeChat){
      setTemp("activeChat",chat.activeChat);
    }
  }
});
// 3. Model
// app.model(require('./models/login'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
