import React, { useState, useEffect } from 'react'

import { GameObject, Component } from '@eva/eva.js'
import { Img, ImgSystem } from '@eva/plugin-renderer-img' // 引入渲染图片所需要的组件和系统
import { Physics, PhysicsType } from '@eva/plugin-matterjs'
import { Render } from '@eva/plugin-renderer-render'
import { Graphics } from '@eva/plugin-renderer-graphics'

import { seaBgObj, shipObj, shipLightObj, footH } from '../../constant/objSettings'
import gameInfo from '../../constant/game'

import './index.css'

export default function Tools() {
  let seaBg
  let ship
  let shipLight
  let physics
  let touchX
  let touchY

  /**
   * 制造波浪
   */
  const createOceanCurrentPattern = ({
    width = 360,
    height = 720,
    x = -100,
    y = 800,
    speed = 200,
    speedX = 200,
    speedY = 200,
    speedC = 25,
    rotation = 0, // 3.14159 是180度
  }) => {
    const { container } = gameInfo

    const block = new GameObject('oceanCurrent', {
      origin: {
        x: 0.5,
        y: 0.5,
      },
      size: {
        width,
        height,
      },
      position: {
        x,
        y,
      },
      rotation,
    })
    block.addComponent(
      new Img({
        resource: 'oceanCurrentPattern',
      }),
    )
    block.addComponent(
      new Render({
        zIndex: 2,
      }),
    )
    // 存在10秒后自动清除
    setTimeout(() => {
      container.removeChild(block)
    }, 15000)
    const move = (speedX, speedY) => {
      block.transform.position.x += (speedX || speed) / speedC
      block.transform.position.y += (speedY || speed) / speedC

      if (speedX === 0 || speedY === 0) {
        container.removeChild(block)
        return
      }
      requestAnimationFrame(() => {
        move(speedX > 0 ? speedX - 1 : speedX + 1, speedY > 0 ? speedY - 1 : speedY + 1)
      })
    }
    container.addChild(block)
    requestAnimationFrame(() => {
      move(speedX, speedY)
    })
  }

  const genMask = () => {
    const { container } = gameInfo
    const mask = new GameObject('mask', {
      size: {
        width: 395,
        height: 400,
      },
      position: {
        x: 0,
        y: 0,
      },
    })

    const maskGraphics = mask.addComponent(new Graphics())

    for (let i = 0; i < 800; i++) {
      maskGraphics.graphics.beginFill(0x0c5fee, 1 - i / 800)
      maskGraphics.graphics.drawRect(0, i, 800, 1)
      maskGraphics.graphics.endFill()
    }

    mask.addComponent(
      new Render({
        zIndex: 12,
      }),
    )

    container.addChild(mask)
  }

  useEffect(() => {
    const { game, container } = gameInfo

    game.scene.addChild(container)

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
      new Render({
        zIndex: 3,
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
          collisionFilter: {
            category: 0x0001,
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
    shipLight.addComponent(
      new Render({
        zIndex: 2,
      }),
    )

    container.addChild(seaBg) // 把游戏对象放入场景，这样画布上就可以显示这张图片了
    container.addChild(shipLight)
    container.addChild(ship)

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
          y: -80,
        },
      })
      block.addComponent(
        new Img({
          resource: blockImageNames[Math.floor(Math.random() * 3)],
        }),
      )
      block.addComponent(
        new Render({
          zIndex: 3,
        }),
      )
      console.log('block', block)
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
            collisionFilter: {
              category: 0x0002,
              mask: 0x0001,
            },
          },
          stopRotation: false,
        }),
      )

      physics.on('collisionStart', (obj1, obj2) => {
        console.log('啊，撞到了', obj1, obj2)
        container.removeChild(block)
      })
      container.addChild(block)

      setTimeout(() => {
        if (block) {
          container.removeChild(block)
        }
      }, 20000)

      setTimeout(() => {
        requestAnimationFrame(genBlock)
      }, 2500)
    }

    const genCloud = () => {
      const positionX = Math.floor(Math.random() * 390)
      const speedY = 50 + Math.floor(Math.random() * 150)
      const width = 160 * (2 + 2 * Math.random())
      const height = width / 2

      const cloud = new GameObject('cloud', {
        size: {
          width,
          height,
        },
        position: {
          x: positionX,
          y: -height + 1,
        },
      })

      const cloudShadow = new GameObject('cloud-shadow', {
        size: {
          width,
          height,
        },
        position: {
          x: positionX + width / 6,
          y: -height + 1 + width / 6,
        },
      })

      cloud.addComponent(
        new Img({
          resource: 'cloud1',
        }),
      )

      cloud.addComponent(
        new Move({
          game,
          genObject: cloud,
          speed: {
            x: 0,
            y: speedY,
          },
        }),
      )

      cloud.addComponent(
        new Render({
          zIndex: 11,
        }),
      )

      cloudShadow.addComponent(
        new Img({
          resource: 'cloudShadow1',
        }),
      )

      cloudShadow.addComponent(
        new Move({
          game,
          genObject: cloudShadow,
          speed: {
            x: 0,
            y: speedY,
          },
        }),
      )
      cloudShadow.addComponent(
        new Render({
          zIndex: 10,
        }),
      )

      console.log('cloud', cloud)
      container.addChild(cloudShadow)
      container.addChild(cloud)

      setTimeout(() => {
        requestAnimationFrame(genCloud)
      }, 4000 + 8000 * Math.random())
    }

    requestAnimationFrame(genCloud)
    requestAnimationFrame(genBlock)

    genMask(game)
  }, [])

  /**
   * 移动物理单位
   * @param {*} phyObj
   * @param {*} num
   * @param {*} pos
   */
  const movePhy = (phyObj = {}, num = 50, pos = 'y') => {
    const { components } = phyObj

    // 视图位置
    components[3].body.position[pos] -= num
    // 物理位置
    // 四边形
    components[3].body.bounds.max[pos] -= num
    components[3].body.bounds.min[pos] -= num
    // 多边形 待验证
    components[3].body.vertices[0][pos] -= num
    components[3].body.vertices[1][pos] -= num
    components[3].body.vertices[2][pos] -= num
    components[3].body.vertices[3][pos] -= num
  }
  /**
   * 移动单位
   * @param {*} phyObj
   * @param {*} num
   * @param {*} pos
   */
  const moveObj = (phyObj = {}, num = 50, pos = 'y') => {
    const { components } = phyObj
    components[0].position[pos] -= num
  }
  return (
    <>
      <div
        className="home_bg"
        onClick={e => {
          console.log('clk', e)
          console.log(ship)
          movePhy(ship)
          moveObj(shipLight)
        }}
        onTouchStart={e => {
          touchX = e.changedTouches[0].clientX
          touchY = e.changedTouches[0].clientY
        }}
        onTouchEnd={e => {
          const moveX = e.changedTouches[0].clientX - touchX
          const moveY = e.changedTouches[0].clientY - touchY
          const tan = moveX > 0 ? 0 : -3.14

          if (moveX < -300) {
            console.log('向左')
            createOceanCurrentPattern({
              x: 750,
              y: 800,
              speedX: moveX / 2,
              speedY: moveY / 2,
              rotation: Math.atan(moveY / moveX) * 2 + tan,
            })
            movePhy(ship, 50, 'x')
            moveObj(shipLight, 50, 'x')
          }
          if (moveX > 300) {
            console.log('向右')
            createOceanCurrentPattern({
              speedX: moveX / 2,
              speedY: moveY / 2,
              rotation: Math.atan(moveY / moveX) * 2 + tan,
            })
            movePhy(ship, -50, 'x')
            moveObj(shipLight, -50, 'x')
          }
        }}
      >
        {/* <div
          className="home_btn"
          onClick={() => {
            console.log('111')
            console.log(ship)
            console.log(shipLight)

            console.log(ship.components)

            console.log(ship.transform.position)
            // console.log()
            movePhy(ship)
            shipLight.components[0].position.y -= 10
          }}
        /> */}
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
    if (position.x >= 390 * 2 || position.x <= 0) {
      // this.game?.removeChild(this.gameObject)
    }
    if (position.y >= 844 * 2 || position.y <= 0) {
      // this.game?.removeChild(this.gameObject)
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
