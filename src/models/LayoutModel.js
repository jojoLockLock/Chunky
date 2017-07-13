/**
 * Created by jojo on 2017/7/13.
 */

const initState={};

export default {

  namespace: 'layout',

  state: initState,

  reducers: {


  },

  effects: {
    *getChatRecords({payload},{call,put,select}) {


    },
  },

  subscriptions: {
    setup({dispatch,history}) {
      return history.listen(({pathname,query})=>{
        // console.info(pathname,query);
      })
    }
  },
}
