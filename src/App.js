import { Route, Switch, Redirect } from 'react-router-dom'
import Login from './pages/Login'
import Main from './components/Main'
import UserInfo from './components/UserInfo'

import './App.css'
import 'antd/dist/antd.css'

function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/main" component={Main} />
      <Route path="/user-info" component={UserInfo} />
      <Redirect to="/login" />
    </Switch>
  )
}

export default App
