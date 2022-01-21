import React, { useState, useEffect } from 'react'

import { Game, GameObject, Component } from '@eva/eva.js'
import { RendererSystem } from '@eva/plugin-renderer'
import { Img, ImgSystem } from '@eva/plugin-renderer-img' // 引入渲染图片所需要的组件和系统
import { Event, EventSystem, HIT_AREA_TYPE } from '@eva/plugin-renderer-event'

import { seaBgOgj, shipOgj, shipLightObj, footH } from 'constant/objSettings.js'
import './index.css'

export default function Home() {
  let seaBg
  let ship
  let shipLight

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
    seaBg = new GameObject('seaBg', {
      size: {
        width: seaBgOgj.w,
        height: seaBgOgj.h,
      },
    })
    ship = new GameObject('ship', {
      size: {
        width: shipOgj.w,
        height: shipOgj.h,
      },
      position: {
        x: ((seaBgOgj.w - shipOgj.w) / 2).toFixed(0),
        y: seaBgOgj.h - shipOgj.h - footH,
      },
    })
    shipLight = new GameObject('shipLight', {
      size: {
        width: shipLightObj.w,
        height: shipLightObj.h,
      },
      position: {
        x: shipOgj.oW - (shipLightObj.w / 2).toFixed(0),
        y: shipOgj.oH - (shipLightObj.h / 2).toFixed(0),
      },
    })
    seaBg.addComponent(
      new Img({
        resource: 'seaBg',
      }),
    )
    ship.addComponent(
      new Img({
        resource: 'ship',
      }),
    )
    shipLight.addComponent(
      new Img({
        resource: 'shipLight',
      }),
    )
    // const evt = ship.addComponent(
    //   new Event({
    //     // 使用这个属性设置交互事件可以触发的区域，骨骼动画有所变差，可以临时在当前游戏对象下添加一个同类型同属性的Graphic查看具体点击位置。
    //     hitArea: {
    //       type: HIT_AREA_TYPE.Polygon,
    //       style: {
    //         paths: [0, 0, 0, 150, 150, 150, 150, 0],
    //       },
    //     },
    //   }),
    // )

    // let touched = false
    // let prePosition = { x: 0, y: 0 }
    // evt.on('touchstart', e => {
    //   // console.log(e)
    //   // console.log('touchstart')
    //   prePosition = e.data.position
    //   touched = true
    // })
    // evt.on('touchend', e => {
    //   // console.log('touchend')
    //   touched = false
    // })
    // evt.on('touchmove', e => {
    //   if (touched) {
    //     const { gameObject, data } = e
    //     const { transform } = gameObject

    //     const position = {
    //       x: transform.position.x + data.position.x - prePosition.x,
    //       y: transform.position.y + data.position.y - prePosition.y,
    //     }
    //     prePosition = e.data.position

    //     transform.position = position
    //   }
    //   document.addEventListener('visibilitychange', () => {
    //     if (document.hidden) {
    //       game.pause()
    //     } else {
    //       game.resume()
    //     }
    //   })
    // })

    game.scene.addChild(seaBg) // 把游戏对象放入场景，这样画布上就可以显示这张图片了
    game.scene.addChild(shipLight)
    game.scene.addChild(ship)
  }, [])

  return (
    <>
      <div className="home_bg">
        <div className="home_top"></div>
      </div>
    </>
  )
}

class Move extends Component {
  static componentName = 'Move'

  speed = {
    // 移动速度
    x: 100,
    y: 200,
  }

  init(obj) {
    Object.assign(this, obj)
  }

  update(e) {
    // 每秒 N 像素
    // console.log(e)
    const { position } = this.gameObject.transform
    this.gameObject.transform.position.x += this.speed.x * (e.deltaTime / 1000)
    this.gameObject.transform.position.y += this.speed.y * (e.deltaTime / 1000)
    if (position.x >= 390 || position.x <= 0) {
      this.speed.x = -this.speed.x
    }
    if (position.y >= 844 || position.y <= 0) {
      this.speed.y = -this.speed.y
    }
  }

  onPause() {
    this.oldSpeed = this.speed
    this.speed = {
      x: 0,
      y: 0,
    }
  }

  onResume() {
    this.speed = this.oldSpeed
  }
}
