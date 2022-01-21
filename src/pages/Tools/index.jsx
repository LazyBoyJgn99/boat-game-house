import React, { useState, useEffect } from 'react'

import { Game, GameObject, Component } from '@eva/eva.js'
import { RendererSystem } from '@eva/plugin-renderer'
import { Img, ImgSystem } from '@eva/plugin-renderer-img' // 引入渲染图片所需要的组件和系统
import { Physics, PhysicsSystem, PhysicsType } from '@eva/plugin-matterjs'
import { Text, TextSystem } from '@eva/plugin-renderer-text'
import { Graphics, GraphicsSystem } from '@eva/plugin-renderer-graphics'
import { Event, EventSystem, HIT_AREA_TYPE } from '@eva/plugin-renderer-event'

import gameInfo from '../../constant/game'

import './index.css'

export default function Tools() {
  let gameObject
  let gameObject2
  let gameObject3

  useEffect(() => {
    const { game } = gameInfo
    const { physics } = createPlayer()
    const { evt } = createButton()
    const walls = [createWall(0, 0, 20, 1000), createWall(750 - 20, 0, 20, 1000), createWall(0, 1000 - 20, 750, 20)]

    physics.on('collisionStart', () => {
      DrawRed()
    })
    physics.on('collisionEnd', () => {
      DrawGreen()
    })

    evt.on('tap', () => {
      physics.body.force.y = -10
    })

    function DrawRed() {
      walls.forEach(wall => {
        wall.drawColor(0xff0000)
      })
    }
    function DrawGreen() {
      walls.forEach(wall => {
        wall.drawColor(0x00ffff)
      })
    }

    function createPlayer() {
      const image = new GameObject('image', {
        size: { width: 240, height: 240 },
        origin: { x: 0.5, y: 0.5 },
        position: {
          x: 375,
          y: 100,
        },
        scale: {
          x: -1,
          y: 1,
        },
      })

      image.addComponent(
        new Img({
          resource: 'imageName',
        }),
      )

      const physics = image.addComponent(
        new Physics({
          type: PhysicsType.RECTANGLE,
          bodyOptions: {
            isStatic: false,
            // restitution: 0,
            frictionAir: 0.1,
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
      game.scene.addChild(image)

      return { physics }
    }

    function createWall(x, y, width, height) {
      const go = new GameObject('graphics', {
        position: { x: x + width / 2, y: y + height / 2 },
        size: { width, height },
        origin: { x: 0.5, y: 0.5 },
      })
      const graphics = go.addComponent(new Graphics())
      graphics.graphics.beginFill(0x00ff00)
      graphics.graphics.drawRect(0, 0, width, height)

      go.addComponent(
        new Physics({
          type: PhysicsType.RECTANGLE,
          bodyOptions: {
            isStatic: true, // Whether the object is still, any force acting on the object in a static state will not produce any effect
            restitution: 0.1,
            frictionAir: 0,
            friction: 0,
            frictionStatic: 0,
            force: {
              x: 0,
              y: 0,
            },
          },
          stopRotation: true, // default false, usually do not need to be set
        }),
      )
      game.scene.addChild(go)

      return {
        drawColor(color) {
          graphics.graphics.beginFill(color)
          graphics.graphics.drawRect(0, 0, width, height)
        },
      }
    }

    function createButton() {
      const textGO = new GameObject('text', {
        origin: {
          x: 0.5,
          y: 0.5,
        },
        anchor: {
          x: 0.5,
          y: 0.5,
        },
      })
      textGO.addComponent(
        new Text({
          text: 'Jump',
          style: {
            fill: 0xffffff,
            fontSize: 50,
          },
        }),
      )
      const go = new GameObject('button', {
        position: {
          x: 750 - 30,
          y: 1334 - 30,
        },
        origin: {
          x: 1,
          y: 1,
        },
      })
      const { graphics } = go.addComponent(new Graphics())
      graphics.beginFill(0x00ffff)
      const w = 240
      const h = 120
      graphics.drawRoundedRect(0, 0, w, h)
      go.transform.size.width = w
      go.transform.size.height = h
      go.addChild(textGO)
      game.scene.addChild(go)

      const evt = go.addComponent(new Event())
      return { evt }
    }
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
