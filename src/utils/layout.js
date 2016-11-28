import layout from 'layout'
import sortBy from 'lodash.sortby'

const TopDown = {
  sort(items) {
    return sortBy(items, item => item.height)
  },
  placeItems(items) {
    let y = 0

    return items.map(item => {
      const ret = { ...item, x: 0, y }
      y += item.height
      return ret
    })
  }
}

const LeftRight = {
  sort(items) {
    return sortBy(items, item => item.width)
  },
  placeItems(items) {
    let x = 0

    return items.map(item => {
      const ret = { ...item, x, y: 0 }
      x += item.width
      return ret
    })
  }
}

layout.addAlgorithm('top-down', TopDown)
layout.addAlgorithm('left-right', LeftRight)

export default layout
