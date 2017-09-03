/**
 * Created by jojo on 2017/7/13.
 */
export default {
  httpApi:{
    LOGIN:"/api/login",
    TOKEN:"/api/token",
    USER:"/api/user",
    USER_FRIEND_REQUEST:"/api/user/friend-request",
    USER_CHAT_RECORD:"/api/user/chat-record",

    USER_CHAT_RECORDS:"/api/user/chat-records",

    NOTIFICATION_FRIEND_REQUEST:"/api/notifications/friend-request",

    USER_BASIC:"/api/user/basic",

    UNREAD_MESSAGES:"/api/user/unread-messages"
  },
  socketApi:{
    SOCKET_HOST:"ws://localhost:3000"
  }
}
