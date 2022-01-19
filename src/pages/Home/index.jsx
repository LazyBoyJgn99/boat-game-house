import React, { useState, useEffect } from 'react'

import { resource, RESOURCE_TYPE, Game, GameObject } from '@eva/eva.js'
import { RendererSystem } from '@eva/plugin-renderer'
import { Img, ImgSystem } from '@eva/plugin-renderer-img' // 引入渲染图片所需要的组件和系统
import { Event, EventSystem, HIT_AREA_TYPE } from '@eva/plugin-renderer-event'

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
    const game = new Game({
      frameRate: 60, // 可选，游戏帧率，默认60
      autoStart: true, // 可选，自动开始
      transparent: false,
      resolution: window.devicePixelRatio, // 可选, 如果是2倍图设计 可以除以2
      enableScroll: true, // 允许页面滚动
      renderType: 0, // 0:自动判断，1: WebGL，2:Canvas，建议android6.1 ios9 以下使用Canvas，需业务判断。z
      systems: [
        new RendererSystem({
          canvas: document.querySelector('#canvas'),
          width: 390,
          height: 844,
        }),
        new EventSystem({
          // moveWhenInside: true // 代表只有在元素内部才会执行move事件，默认为false
        }),
        new ImgSystem(),
      ],
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
    const evt = gameObject2.addComponent(
      new Event({
        // 使用这个属性设置交互事件可以触发的区域，骨骼动画有所变差，可以临时在当前游戏对象下添加一个同类型同属性的Graphic查看具体点击位置。
        hitArea: {
          type: HIT_AREA_TYPE.Polygon,
          style: {
            paths: [0, 0, 0, 150, 150, 150, 150, 0],
          },
        },
      }),
    )

    let touched = false
    evt.on('touchstart', e => {
      console.log(e)
      console.log('touchstart')
      touched = true
    })
    evt.on('touchend', e => {
      console.log('touchend')
      touched = false
    })
    evt.on('touchmove', e => {
      if (touched) {
        const { gameObject, data } = e
        const { transform } = gameObject
        console.log('touchmove')
        console.log('e', e)
        console.log('gameObject', gameObject)
        console.log('data', data)

        transform.position = data.position
      }
    })

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
