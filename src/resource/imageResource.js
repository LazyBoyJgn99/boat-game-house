import { resource, RESOURCE_TYPE } from '@eva/eva.js'

resource.addResource([
  {
    name: 'imageName',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: 'https://gw.alicdn.com/imgextra/i2/O1CN01RXLKdU1NhImlj0VPt_!!6000000001601-2-tps-90-90.png',
      },
    },
    preload: true,
  },
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
  {
    name: 'seaBg',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: 'http://106.15.32.115:8095/api/images/sea-background.png',
      },
    },
    preload: true,
  },
  {
    name: 'ship',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: 'http://106.15.32.115:8095/api/images/ship-body.png',
      },
    },
    preload: true,
  },
  {
    name: 'shipLight',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: 'http://106.15.32.115:8095/api/images/ship-light.png',
      },
    },
    preload: true,
  },
])
