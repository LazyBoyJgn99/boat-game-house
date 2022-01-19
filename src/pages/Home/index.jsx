import React, { useState, useEffect } from 'react'

import { resource, RESOURCE_TYPE, Game, GameObject } from '@eva/eva.js'
import { RendererSystem } from '@eva/plugin-renderer'
import { Img, ImgSystem } from '@eva/plugin-renderer-img' // 引入渲染图片所需要的组件和系统

import './index.css'

resource.addResource([
  {
    name: 'image1',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: 'https://gw.alicdn.com/tfs/TB1DNzoOvb2gK0jSZK9XXaEgFXa-658-1152.webp',
      },
    },
    preload: true,
  },
  {
    name: 'image2',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: 'https://gw.alicdn.com/tfs/TB15Upxqk9l0K4jSZFKXXXFjpXa-750-1624.jpg',
      },
    },
    preload: true,
  },
])

export default function Home() {
  let gameObject
  let gameObject2

  useEffect(() => {
    // 创建渲染系统
    const rendererSystem = new RendererSystem({
      canvas: document.querySelector('#canvas'), // 可选，自动生成 canvas 挂在 game.canvas 上
      width: 750,
      height: 500,
      transparent: false,
      resolution: window.devicePixelRatio / 2, // 可选, 如果是2倍图设计 可以除以2
      enableScroll: true, // 允许页面滚动
      renderType: 0, // 0:自动判断，1: WebGL，2:Canvas，建议android6.1 ios9 以下使用Canvas，需业务判断。
    })

    // 创建游戏对象
    const game = new Game({
      frameRate: 60, // 可选，游戏帧率，默认60
      autoStart: true, // 可选，自动开始
      systems: [rendererSystem],
    })
    game.addSystem(new ImgSystem()) // 给游戏添加渲染图片的能力

    gameObject = new GameObject('gameObj1', {
      size: {
        width: 658,
        height: 1152,
      },
    })
    gameObject2 = new GameObject('gameObj2', {
      size: {
        width: 50,
        height: 50,
      },
    })
    gameObject.addComponent(
      new Img({
        resource: 'image1',
      }),
    )

    gameObject2.addComponent(
      new Img({
        resource: 'image2',
      }),
    )

    game.scene.addChild(gameObject) // 把游戏对象放入场景，这样画布上就可以显示这张图片了
    game.scene.addChild(gameObject2) // 把游戏对象放入场景，这样画布上就可以显示这张图片了
  }, [])

  return (
    <>
      <h1
        onClick={() => {
          gameObject2.transform.position.y = gameObject2.components[0].position.y - 10
        }}
      >
        上
      </h1>
      <h1
        onClick={() => {
          gameObject2.transform.position.y = gameObject2.components[0].position.y + 10
        }}
      >
        下
      </h1>
      <h1
        onClick={() => {
          gameObject2.transform.position.x = gameObject2.components[0].position.x - 10
        }}
      >
        左
      </h1>
      <h1
        onClick={() => {
          gameObject2.transform.position.x = gameObject2.components[0].position.x + 10
        }}
      >
        右
      </h1>
      <canvas id="canvas" />
    </>
  )
}
