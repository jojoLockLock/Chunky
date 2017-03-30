import React from 'react';
import { Router, Route,IndexRedirect ,Redirect} from 'dva/router';
import RootPage from './routes/RootPage/RootPage';
const LoginPage=(location,cb)=>{
  require.ensure([],require=>{
    cb(null,require('./routes/LoginPage/LoginPage.js'))
  },'login')
};

const AppPage=(location,cb)=>{
  require.ensure([],require=>{
    cb(null,require('./routes/AppPage/AppPage.js'))
  },'app')
};

const ErrorPage=(location,cb)=>{
  require.ensure([],require=>{
    cb(null,require('./routes/ErrorPage/ErrorPage.js'))
  },'error')
};
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={RootPage}>
        <IndexRedirect to="/login"/>
        <Route path="/login" getComponent={LoginPage} />
        <Route path="/app" getComponent={AppPage}/>
        <Route path='/404' getComponent={ErrorPage} />
        <Redirect from='*' to='/404' />
      </Route>
    </Router>
  );
}

export default RouterConfig;
