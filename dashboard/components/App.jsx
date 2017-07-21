import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import io from 'socket.io-client'

import Layout from './Layout'
import Dashboard from './Dashboard'
import Page404 from './Page404'
import firebaseServiceInit from '../services/firebase'

export default class App extends React.Component {
  constructor() {
    super()

    this.socket = io()
  }

  componentWillMount() {
    this.socket.on('config', config => firebaseServiceInit(config))
  }

  componentWillUnmount() {
    this.socket.off('config')
  }

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
