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
  let coast
  let shipPhysical
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

      if (speedX < 1 && speedX > -1) {
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

  /**
   * 顶层遮罩
   */
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

  /**
   * 底部静态
   */
  const genFooter = () => {
    const footers = {
      heads: [],
    }
    const footer = new GameObject('footer', {
      size: {
        width: 750,
        height: 120,
      },
      position: {
        x: 0,
        y: 1254,
      },
    })

    footer.addComponent(
      new Render({
        zIndex: 12,
      }),
    )

    const footerGraphics = footer.addComponent(new Graphics())

    footerGraphics.graphics.beginFill(0x000000, 0.4)
    footerGraphics.graphics.drawRect(0, 0, 750, 80)
    footerGraphics.graphics.endFill()

    const btnNpr1 = new GameObject('left', {
      size: {
        width: 120,
        height: 120,
      },
      position: {
        x: 20,
        y: 1194,
      },
    })

    btnNpr1.addComponent(
      new Img({
        resource: 'btnNpr1',
      }),
    )

    btnNpr1.addComponent(
      new Render({
        zIndex: 13,
      }),
    )

    const btnRanksg1 = new GameObject('right', {
      size: {
        width: 120,
        height: 120,
      },
      position: {
        x: 610,
        y: 1194,
      },
    })

    btnRanksg1.addComponent(
      new Img({
        resource: 'btnRanksg1',
      }),
    )

    btnRanksg1.addComponent(
      new Render({
        zIndex: 13,
      }),
    )

    for (let i = 0; i < 3; i++) {
      const head = new GameObject('head', {
        size: {
          width: 80,
          height: 70,
        },
        position: {
          x: 245 + 90 * i,
          y: 1260,
        },
      })

      head.addComponent(
        new Img({
          resource: 'iconHeart1',
        }),
      )

      head.addComponent(
        new Render({
          zIndex: 13,
        }),
      )

      footers.heads.push(head)
    }

    footers.footer = footer
    footers.btnNpr1 = btnNpr1
    footers.btnRanksg1 = btnRanksg1

    return footers
  }

  /**
   * 准备动画
   */
  const readAnim = () => {
    const { container } = gameInfo
    const renderObj = genFooter()
    const genGoObj = num => {
      const go = new GameObject(`go${num}`, {
        size: {
          width: 160,
          height: 120,
        },
        position: {
          x: 375,
          y: 507,
        },
        origin: {
          x: 0.5,
          y: 0.5,
        },
        scale: {
          x: 1.5,
          y: 1.5,
        },
      })

      go.addComponent(
        new Img({
          resource: `GO${num}`,
        }),
      )

      go.addComponent(
        new Render({
          zIndex: 12,
        }),
      )

      return go
    }

    const go3 = genGoObj(3)
    container.addChild(go3)
    const runAnim = (go, num) => () => {
      const { x, y } = go.components[0].scale
      go.components[0].scale.x = x - 0.015
      go.components[0].scale.y = y - 0.015
      if (x >= 0.9 && y >= 0.9) {
        requestAnimationFrame(runAnim(go, num))
      } else {
        container.removeChild(go)
        if (num > 0) {
          const nextGo = genGoObj(--num)
          container.addChild(nextGo)
          requestAnimationFrame(runAnim(nextGo, num))
        } else {
          Object.keys(renderObj).forEach(key => {
            if (renderObj[key] instanceof Array) {
              renderObj[key].forEach(item => {
                container.addChild(item)
              })
            } else {
              container.addChild(renderObj[key])
            }
          })
        }
      }
    }

    requestAnimationFrame(runAnim(go3, 3))
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
    coast = new GameObject('ship', {
      size: {
        width: seaBgObj.w,
        height: 20,
      },
      position: {
        x: +((seaBgObj.w - shipObj.w) / 2).toFixed(0),
        y: seaBgObj.h - 250,
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

    shipPhysical = ship.addComponent(
      new Physics({
        type: PhysicsType.RECTANGLE,
        bodyOptions: {
          isStatic: false,
          // restitution: 0,
          frictionAir: 0.01,
          friction: 0.06,
          frictionStatic: 0.3,
          force: {
            x: 0,
            y: 0,
          },
          collisionFilter: {
            category: 0x0001,
            mask: 0x0010,
            group: -2,
          },
        },
        stopRotation: true,
      }),
    )
    coast.addComponent(
      new Physics({
        type: PhysicsType.RECTANGLE,
        bodyOptions: {
          isStatic: true,
          collisionFilter: {
            category: 0x0010,
            mask: 0x0001,
            group: -9,
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
    container.addChild(coast)

    shipLightFollow()

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
              category: 0x0010,
              mask: 0x0001,
              group: -3,
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

      const cloudShadow = new GameObject('cloudShadow1', {
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
    readAnim()
  }, [])

  const shipLightFollow = () => {
    setInterval(() => {
      shipLight.transform.position.x = ship.transform.position.x - shipLightObj.w / 2 + shipObj.w / 2
      shipLight.transform.position.y = ship.transform.position.y - shipLightObj.h / 2 + shipObj.h / 2
    }, 10)
  }

  /**
   * 移动物理单位
   * @param {*} phyObj
   * @param {*} num
   * @param {*} pos
   */
  const movePhy = (phyObj = {}, num = 50, pos = 'y') => {
    const { components } = phyObj
    if (pos === 'y') {
      // eslint-disable-next-line no-param-reassign
      phyObj.body.force.y = -2
    } else {
      // eslint-disable-next-line no-param-reassign
      phyObj.body.force.x = num > 0 ? -0.3 : 0.3
    }

    // // 物理位置
    // components[2].body.positionPrev[pos] -= num
    // // 视图位置
    // components[2].body.position[pos] -= num
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
          movePhy(shipPhysical)
          moveObj(shipLight)
        }}
        onTouchStart={e => {
          touchX = e.changedTouches[0].clientX
          touchY = e.changedTouches[0].clientY
        }}
        onTouchEnd={e => {
          const moveX = e.changedTouches[0].clientX - touchX
          const moveY = (e.changedTouches[0].clientY - touchY) / 3
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
            movePhy(shipPhysical, 50, 'x')
            moveObj(shipLight, 50, 'x')
          }
          if (moveX > 300) {
            console.log('向右')
            createOceanCurrentPattern({
              speedX: moveX / 2,
              speedY: moveY / 2,
              rotation: Math.atan(moveY / moveX) * 2 + tan,
            })
            movePhy(shipPhysical, -50, 'x')
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
