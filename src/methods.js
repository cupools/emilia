import fs from 'fs'
import postcss from 'postcss'

export function resolveUrl(url) {
  return url
}

export function getBuffer(url) {
  return fs.readFileSync(url)
}

export function getUrls(content) {
  let ret = []

  const root = postcss.parse(content)
  root.walkDecls(/background(-image)?$/, decl => {
    const { value } = decl
    const start = value.indexOf('url(')
    const end = value.indexOf(')')
    const url = value.substring(start + 4, end - 1).replace(/^[\s"']|[\s"']$/, '')
    ret.push(url)
  })

  return ret
}

export function urlDetect(raw) {
  const seperator = '?__'
  const [url, tag] = raw.split(seperator)
  return tag ? { url, tag, seperator, raw } : null
}
