import React, { useState, useEffect } from 'react'

import { GameObject, Component } from '@eva/eva.js'
import { Img, ImgSystem } from '@eva/plugin-renderer-img' // 引入渲染图片所需要的组件和系统
import { Physics, PhysicsType } from '@eva/plugin-matterjs'
// import { Transition, TransitionSystem } from '@eva/plugin-transition'

import { seaBgObj, shipObj, shipLightObj, footH } from '../../constant/objSettings'
import gameInfo from '../../constant/game'

import './index.css'

export default function Home() {
  let seaBg
  let ship
  let shipLight

  useEffect(() => {
    const { game } = gameInfo

    game.addSystem(new ImgSystem()) // 给游戏添加渲染图片的能力
    seaBg = new GameObject('seaBg', {
      size: {
        width: seaBgObj.w,
        height: seaBgObj.h,
      },
    })
    ship = new GameObject('ship', {
      size: {
        width: shipObj.w,
        height: shipObj.h,
      },
      position: {
        x: +((seaBgObj.w - shipObj.w) / 2).toFixed(0),
        y: seaBgObj.h - shipObj.h - footH,
      },
    })

    shipLight = new GameObject('shipLight', {
      size: {
        width: shipLightObj.w,
        height: shipLightObj.h,
      },
      position: {
        x: shipObj.oW - (shipLightObj.w / 2).toFixed(0),
        y: shipObj.oH - (shipLightObj.h / 2).toFixed(0),
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

    ship.addComponent(
      new Physics({
        type: PhysicsType.RECTANGLE,
        bodyOptions: {
          isStatic: true,
          // restitution: 0,
          frictionAir: 0,
          friction: 0.06,
          frictionStatic: 0.3,
          force: {
            x: 0,
            y: 0,
          },
        },
        stopRotation: true,
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

    const blockImageNames = ['reef', 'fish1', 'shark']
    const genBlock = () => {
      // console.log('开始添加')
      const block = new GameObject('block', {
        size: {
          width: 80,
          height: 80,
        },
        position: {
          x: Math.floor(Math.random() * 390),
          y: 0,
        },
      })
      block.addComponent(
        new Img({
          resource: blockImageNames[Math.floor(Math.random() * 3)],
        }),
      )
      const physics = block.addComponent(
        new Physics({
          type: PhysicsType.RECTANGLE,
          bodyOptions: {
            isStatic: false,
            // restitution: 0,
            frictionAir: 0.5 + (Math.random() * 4) / 10,
            friction: 0.06,
            frictionStatic: 0.3,
            force: {
              x: 0,
              y: 0,
            },
          },
          stopRotation: false,
        }),
      )

      physics.on('collisionStart', () => {
        console.log('啊，撞到了')
      })
      game.scene.addChild(block)

      setTimeout(() => {
        requestAnimationFrame(genBlock)
      }, 1500)
    }
    requestAnimationFrame(genBlock)

    const getCloud = () => {
      const x = -50 - Math.floor(Math.random() * 150)
      const flor = Math.floor(Math.random() * 2) === 1
      const type = Math.floor(Math.random() * 2) === 2

      const cloud = new GameObject('cloud', {
        size: {
          width: 412,
          height: 238,
        },
        position: {
          x: flor ? x : x + 600,
          y: 0, // -238 - 50
        },
      })
      cloud.addComponent(
        new Img({
          resource: type ? 'cloud1' : 'cloud2',
        }),
      )
      const cloud2 = new GameObject('cloud2', {
        size: {
          width: 412,
          height: 238,
        },
        position: {
          x: (flor ? x : x + 600) + 50,
          y: 50, // -238,
        },
      })
      cloud2.addComponent(
        new Img({
          resource: type ? 'cloudShadow1' : 'cloudShadow2',
        }),
      )
      game.scene.addChild(cloud2)
      game.scene.addChild(cloud)
      // setTimeout(() => {
      //   requestAnimationFrame(getCloud)
      // }, 5000)
    }
    requestAnimationFrame(getCloud)
  }, [])

  return (
    <>
      <div className="home_bg">
        <div className="home_top" />
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
    // if (position.x >= 390 || position.x <= 0) {
    //   this.speed.x = -this.speed.x
    // }
    // if (position.y >= 844 || position.y <= 0) {
    //   this.speed.y = -this.speed.y
    // }
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
