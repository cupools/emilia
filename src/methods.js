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
  let ret = []

  const root = postcss.parse(content)
  root.walkDecls(/background(-image)?$/, decl => {
    const { value } = decl
    const start = value.indexOf('url(')
    const end = value.indexOf(')')
    const url = value.substring(start + 4, end - 1).replace(/^[\s"']|[\s"']$/, '')
    ret.push({ url, decl })
  })

  return ret
}

export function getBuffer(url) {
  return fs.readFileSync(url)
}

export function getGroup(all, tag) {
  return all
    .filter(item => item.tag === tag)
    .map((_, index) => index)
}

export function getSprite(processor, all, group) {
  return processor(group.map(index => all[index].buffer))
}
