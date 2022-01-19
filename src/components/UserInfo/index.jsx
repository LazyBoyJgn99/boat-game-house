import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Form, Input, Button, Avatar, Upload, Modal, message } from 'antd'
import localStorage from 'localStorage'
import { editUser, upload } from '../../tools/api'
import './index.css'

const { TextArea, Password } = Input

export default function UserInfo(comp) {
  const userInput = useRef()
  const userInputAgain = useRef()
  const pwdInput = useRef()
  const pwdInputAgain = useRef()
  const form = useRef()

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [isUserModalVisible, setUserModalVisible] = useState(false)
  const [isPwdModalVisible, setPwdModalVisible] = useState(false)

  const showModal = () => {
    setUserModalVisible(true)
  }

  const showPwdModal = () => {
    setPwdModalVisible(true)
  }

  const handlePwdCancel = () => {
    setPwdModalVisible(false)
    pwdInput.current.state.value = ''
    pwdInputAgain.current.state.value = ''
  }

  const handlePwdOk = () => {
    const password = pwdInput.current.state.value
    const passwordAgain = pwdInputAgain.current.state.value

    if (password === passwordAgain && password) {
      const data = { ...user, password }
      editUser(data).then(() => {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
        form.current.setFieldsValue(data)
        setPwdModalVisible(false)
      })
    } else {
      message.warning('两次输入的值不一致或输入值为空')
    }
  }

  const handleOk = () => {
    const userName = userInput.current.state.value
    const userNameAgain = userInputAgain.current.state.value

    if (userName === userNameAgain && userName) {
      const data = { ...user, name: userName }
      editUser(data).then(() => {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
        setUserModalVisible(false)
        form.current.setFieldsValue(data)
      })
    } else {
      message.warning('两次输入的值不一致或输入值为空')
    }
  }

  const handleCancel = () => {
    setUserModalVisible(false)
    userInput.current.state.value = ''
    userInputAgain.current.state.value = ''
  }

  const onFinish = data => {
    editUser(data).then(() => {
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
    })
  }

  const handleChange = info => {
    if (info?.file?.status === 'done') {
      const data = { ...user, avatar: info?.file?.response?.data }
      setUser(data)
      localStorage.setItem('user', JSON.stringify(data))
      form.current.setFieldsValue(data)
    }
  }

  const pageHeaderClick = () => {
    comp.history.replace('/main')
  }

  const changeUser = () => {
    showModal()
  }

  const changePwd = () => {
    showPwdModal()
  }

  return (
    <div className="wrap">
      <PageHeader className="page-header" onBack={pageHeaderClick} subTitle="返回个人主页" />
      <div className="con">
        <div className="side-left" />
        <div className="side-right">
          <div className="form-warp">
            <div className="form-title">个人资料</div>
            <Form
              ref={form}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 20, offset: 1 }}
              size="large"
              className="form"
              name="basic"
              autoComplete="off"
              onFinish={onFinish}
              initialValues={user}
            >
              <Form.Item hidden name="avatar">
                <Input />
              </Form.Item>
              <Form.Item hidden name="id">
                <Input />
              </Form.Item>
              <Form.Item label="昵称" name="nickname">
                <Input />
              </Form.Item>
              <Form.Item
                label="手机"
                name="phone"
                rules={[
                  {
                    pattern: /^1[3456789]\d{9}$/,
                    message: 'The input is not valid phone!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="邮箱"
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="用户名" name="name">
                <Input disabled addonAfter={<Button onClick={changeUser}>修改</Button>} />
              </Form.Item>
              <Form.Item label="密码" name="password">
                <Password visibilityToggle={false} addonAfter={<Button onClick={changePwd}>修改</Button>} disabled />
              </Form.Item>
              <Form.Item label="签名" name="sign">
                <TextArea />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="upload-warp">
            <div className="uploader">
              {/* <div class="mask">上传头像</div> */}
              <Upload
                accept=".png,.img,.gif"
                name="avatar"
                listType="picture"
                showUploadList={false}
                action={upload}
                data={{ id: user.id }}
                onChange={handleChange}
              >
                <Avatar src={user.avatar} size="large" className="avatar-uploader" />
              </Upload>
            </div>

            <div className="avatar-info">我的头像</div>
            <div className="avatar-info-description">支持 jpg、png、jpeg 格式大小 5M 以内的图片</div>
          </div>
        </div>
      </div>
      <Modal title="修改用户" visible={isUserModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div className="modal-con">
          <div>用户名</div>
          <Input ref={userInput} />
        </div>
        <div>
          <div>再次确认</div>
          <Input ref={userInputAgain} />
        </div>
      </Modal>

      <Modal title="修改密码" visible={isPwdModalVisible} onOk={handlePwdOk} onCancel={handlePwdCancel}>
        <div className="modal-con">
          <div>密码</div>
          <Input ref={pwdInput} />
        </div>
        <div>
          <div>再次确认</div>
          <Input ref={pwdInputAgain} />
        </div>
      </Modal>
    </div>
  )
}
