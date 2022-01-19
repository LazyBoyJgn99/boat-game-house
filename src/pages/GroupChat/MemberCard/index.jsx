import React, { useState, useEffect } from 'react'
import { Avatar } from 'antd'
import './index.css'

export default function MemberCard(props) {
  const { isGray, nickname, avatar } = props
  return (
    <div className="member-card">
      <div className="member-card-avatar">
        <Avatar className={isGray ? 'gray-avatar' : ''} size="small" src={avatar} />
      </div>
      <div className="member-card-name">{nickname}</div>
    </div>
  )
}
