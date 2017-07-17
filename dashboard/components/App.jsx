import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import Layout from './Layout'
import Dashboard from './Dashboard'
import Page404 from './Page404'

export default class App extends React.Component {
  render() {
    return (
      <Router onUpdate={ () => window.scrollTo(0, 0) }>
        <Layout>
          <Switch>
            <Route path="/" exact component={ Dashboard }/>
            <Route component={ Page404 }/>
          </Switch>
        </Layout>
      </Router>
    );
  }
}
