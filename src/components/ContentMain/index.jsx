import React, { useState, useEffect } from 'react'
import { Layout, Breadcrumb } from 'antd'
import { Route, Switch, Redirect } from 'react-router-dom'

import DevManage from '../../pages/DevManage'
import Home from '../../pages/Home'
import MemberManager from '../../pages/MemberManage'
import UserFeedback from '../../pages/UserFeedback'
import VersionManage from '../../pages/VersionManage'
import About from '../../pages/About'
import Tools from '../../pages/Tools'
import GroupChat from '../../pages/GroupChat'
import './index.css'

const { Content } = Layout

export default function ContentMain() {
  return (
    <Layout className="layout-con">
      <Breadcrumb className="breadcrumb-con">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="site-layout-background con">
        <Switch>
          <Route path="/main/home" component={Home} />
          <Route path="/main/version-manage" component={VersionManage} />
          <Route path="/main/member-manage" component={MemberManager} />
          <Route path="/main/userfeedback-manage" component={UserFeedback} />
          <Route path="/main/devmanage-develop" component={DevManage} />
          <Route path="/main/about" component={About} />
          <Route path="/main/tools" component={Tools} />
          <Route path="/main/group-chat" component={GroupChat} />
          <Redirect to="/main/home" />
        </Switch>
      </Content>
    </Layout>
  )
}
