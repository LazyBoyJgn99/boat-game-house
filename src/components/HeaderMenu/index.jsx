import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import localStorage from 'localStorage'
import './index.css'

const { Header } = Layout

export default function HeaderMenu(comp) {
  const user = JSON.parse(localStorage.getItem('user'))
  const showInfo = () => {
    comp.history.push('/user-info')
  }
  return (
    <Header className="header">
      <Avatar src={user.avatar} onClick={showInfo} icon={<UserOutlined />} size="large" />
      {/* <div className="logo"/> */}
      <Menu theme="dark" mode="horizontal">
        <Menu.Item key="1">
          <Link to="/main/tools">工具</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/main/about">关于</Link>
        </Menu.Item>
      </Menu>
    </Header>
  )
}
