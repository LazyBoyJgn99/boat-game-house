import React, { useState, useEffect } from 'react'
import { Layout } from 'antd'
import { withRouter } from 'react-router-dom'

import HeaderMenu from '../HeaderMenu'
import SiderMenu from '../SiderMenu'
import ContentMain from '../ContentMain'

const HeaderMenuRouter = withRouter(HeaderMenu)
export default function Main() {
  return (
    <Layout>
      <HeaderMenuRouter />
      <Layout>
        <SiderMenu />
        <ContentMain />
      </Layout>
    </Layout>
  )
}
