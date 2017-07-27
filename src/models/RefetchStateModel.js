/**
 * Created by jojo on 2017/7/27.
 */
export default {

  namespace: 'refetchState',

  state: {
    friendRequest:false,
    friendList:false,
  },

  subscriptions: {

  },

  effects: {

  },

  reducers: {
    setRefetchState:(preState,{payload})=>{
      const {type,value}=payload;
      return {
        ...preState,
        [type]:!!value
      }
    }
  },

};
