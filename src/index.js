import dva from 'dva';
import './index.css';
import ChatModel from './models/ChatModel';
import UserModel from './models/UserModel';
// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(ChatModel);
app.model(UserModel);
// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
