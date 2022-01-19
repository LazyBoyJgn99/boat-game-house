import React, { useState, useEffect } from 'react'
import { Avatar } from 'antd'
import './index.css'

export function LeftChatCard(props) {
  const { avatar, nickName, cont } = props
  return (
    <div className="left-warp">
      <div className="chat-card-left">
        <Avatar src={avatar} size="large" className="avatar" />
        <div className="chat-card-warp-left">
          <div className="chat-card-title-left">{nickName}</div>
          <div className="chat-card-cont-left">{cont}</div>
        </div>
      </div>
    </div>
  )
}

export function RightChatCard(props) {
  const { avatar, nickName, cont } = props
  return (
    <div className="right-warp">
      <div className="chat-card-right">
        <Avatar src={avatar} size="large" className="avatar" />
        <div className="chat-card-warp-right">
          <div className="chat-card-title-right">{nickName}</div>
          <div className="chat-card-cont-right">{cont}</div>
        </div>
      </div>
    </div>
  )
}
