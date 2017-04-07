import React from 'react';
import { Router, Route,IndexRedirect ,Redirect} from 'dva/router';
import RootPage from './routes/RootPage/RootPage';


const HomePage=(location,cb)=>{
  require.ensure([],require=>{
    cb(null,require('./routes/HomePage/HomePage.js'))
  },'routes/home')
};

const ErrorPage=(location,cb)=>{
  require.ensure([],require=>{
    cb(null,require('./routes/ErrorPage/ErrorPage.js'))
  },'routes/error')
};
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={RootPage}>
        <IndexRedirect to="/home"/>
        <Route path="/home" getComponent={HomePage}/>
        <Route path="/404" getComponent={ErrorPage} />
        <Redirect from='*' to='/404' />
      </Route>
    </Router>
  );
}

export default RouterConfig;
