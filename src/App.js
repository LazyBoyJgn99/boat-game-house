/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import Tools from './pages/Tools'
import About from './pages/About'

import './resource/imageResource'

import './App.css'

function App() {
  return (
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/tools" component={Tools} />
      <Route path="/about" component={About} />
      <Redirect to="/home" />
    </Switch>
  )
}

export default App
