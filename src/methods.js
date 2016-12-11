import fs from 'fs'
import postcss from 'postcss'

export function resolveUrl(url) {
  return url
}

export function detectUrl(raw) {
  const seperator = '?__'
  const [url, tag] = raw.split(seperator)
  return tag ? { url, tag, seperator, raw } : null
}

export function getUrls(content) {
  const root = postcss.parse(content)
  let urls = []

  root.walkDecls(/background(-image)?$/, decl => {
    const { value } = decl
    const start = value.indexOf('url(')
    const end = value.indexOf(')')
    const url = value.substring(start + 4, end).replace(/^[\s"']|[\s"']$/g, '')
    urls.push({ url, decl })
  })

  return { root, urls }
}

export function getBuffer(url) {
  return fs.readFileSync(url)
}

export function getID(all, item) {
  return all.indexOf(item)
}

export function getGroup(all, tag) {
  return all
    .map((item, index) => (item.tag === tag ? index : -1))
    .filter(item => item > -1)
}

export function getSprite(processor, all, group) {
  return processor(group.map(index => all[index].buffer))
}

export function getContent({ publicPath }, root, result) {
  const exe = '.png'
  result.forEach(item => {
    const { decl, tag, sprite, id } = item
    const url = publicPath + tag + exe
    const coor = sprite.coordinates[id]
    const size = sprite.width + 'px ' + sprite.height + 'px'
    const position = (0 - coor.x) + 'px ' + (0 - coor.y) + 'px'

    const parent = decl.parent
    decl.value = decl.value.replace(/url\(.*?\)/, `url('${url}')`)

    parent.walkDecls(/background-(size|position)/, d => d.remove())
    parent.insertAfter(decl, {
      prop: 'background-position',
      value: position
    })
    parent.insertAfter(decl, {
      prop: 'background-size',
      value: size
    })
  })

  return root.toString()
}

export function wrap(fn) {
  return function (...args) {
    if (args[0] == null) {
      return null
    }
    return fn.call(null, ...args)
  }
}
