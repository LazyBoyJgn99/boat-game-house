import { Game, GameObject } from '@eva/eva.js'
import { RendererSystem } from '@eva/plugin-renderer'
import { ImgSystem } from '@eva/plugin-renderer-img' // 引入渲染图片所需要的组件和系统
import { PhysicsSystem, Physics, PhysicsType } from '@eva/plugin-matterjs'
import { GraphicsSystem } from '@eva/plugin-renderer-graphics'
import { TextSystem } from '@eva/plugin-renderer-text'
import { EventSystem } from '@eva/plugin-renderer-event'
import { Render, RenderSystem } from '@eva/plugin-renderer-render'

const gameInfo = {
  game: new Game({
    frameRate: 60, // 可选，游戏帧率，默认60
    autoStart: true, // 可选，自动开始
    transparent: false,
    resolution: window.devicePixelRatio, // 可选, 如果是2倍图设计 可以除以2
    enableScroll: true, // 允许页面滚动
    renderType: 0, // 0:自动判断，1: WebGL，2:Canvas，建议android6.1 ios9 以下使用Canvas，需业务判断。z
    systems: [
      new RendererSystem({
        canvas: document.querySelector('#canvas'),
        width: 750,
        height: 1334,
        resolution: 2, // Keep the resolution of the RendererSystem consistent
      }),
      new RenderSystem(),
      new ImgSystem(),
      new PhysicsSystem({
        resolution: 2, // Keep the resolution of the RendererSystem consistent
        isTest: true, // Whether to enable debugging mode
        element: document.querySelector('.debugger'), // Mount point of canvas node in debug mode
        world: {
          gravity: {
            y: 5, // gravity
          },
        },
      }),
      new GraphicsSystem(),
      new TextSystem(),
      new EventSystem(),
      new Render({
        sortableChildren: true,
      }),
    ],
  }),
  container: new GameObject('container', {
    size: {
      width: 750,
      height: 1334,
    },
    position: {
      x: 0,
      y: 0,
    },
    origin: { x: 0, y: 0 },
  }),
  gameObjSpace: new GameObject('gameObjSpace', {
    size: {
      width: 114,
      height: 222,
    },
    position: {
      x: 0,
      y: 0,
    },
    origin: { x: 0, y: 0 },
  }),
  gameObjSpacePhysical: {},
}

gameInfo.container.addComponent(
  new Render({
    sortableChildren: true,
  }),
)
gameInfo.gameObjSpace.addComponent(
  new Render({
    zIndex: 3,
  }),
)

gameInfo.gameObjSpacePhysical = gameInfo.gameObjSpace.addComponent(
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
        category: 0x01000000,
        mask: 0x10000000,
        group: -12,
      },
    },
    stopRotation: true,
  }),
)

export default gameInfo
