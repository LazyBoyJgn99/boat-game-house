import React, { useState, useEffect } from 'react'

import { GameObject, Component } from '@eva/eva.js'
import { Img, ImgSystem } from '@eva/plugin-renderer-img' // 引入渲染图片所需要的组件和系统
import { Physics, PhysicsType } from '@eva/plugin-matterjs'

import { seaBgObj, shipObj, shipLightObj, footH } from '../../constant/objSettings'
import gameInfo from '../../constant/game'

import './index.css'

export default function Tools() {
  let seaBg
  let ship
  let shipLight
  let physics
  let touchX

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
      physics = block.addComponent(
        new Physics({
          type: PhysicsType.RECTANGLE, // PhysicsType.POLYGON,
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
        // console.log('啊，撞到了')
      })
      game.scene.addChild(block)

      // 存在10秒后自动清除
      setTimeout(() => {
        game.scene.removeChild(block)
      }, 10000)
      setTimeout(() => {
        requestAnimationFrame(genBlock)
      }, 1500)
    }
    requestAnimationFrame(genBlock)
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
    components[2].body.position[pos] -= num
    // 物理位置
    // 四边形
    components[2].body.bounds.max[pos] -= num
    components[2].body.bounds.min[pos] -= num
    // 多边形 待验证
    components[2].body.vertices[0][pos] -= num
    components[2].body.vertices[1][pos] -= num
    components[2].body.vertices[2][pos] -= num
    components[2].body.vertices[3][pos] -= num
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
        }}
        onTouchEnd={e => {
          const moveX = e.changedTouches[0].clientX - touchX
          if (moveX < -500) {
            console.log('向左')
            movePhy(ship, 50, 'x')
            moveObj(shipLight, 50, 'x')
          }
          if (moveX > 500) {
            console.log('向右')
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
