import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import localStorage from 'localStorage'
import { login } from '../../tools/api'
import './index.css'

const doLogin = props => {
  return formData => {
    login(formData).then(data => {
      if (data.success) {
        const { history } = props
        new Promise((resolve, reject) => {
          localStorage.setItem('user', JSON.stringify(data.data))
          resolve()
        }).then(() => {
          history.replace('/main')
        })
      }
    })
  }
}

export default function Login(props) {
  return (
    <div className="login-body">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={doLogin(props)}
      >
        <Form.Item
          className="item"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          className="item"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item className="item">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item className="item">
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
