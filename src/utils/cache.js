import crypto from 'crypto'

let cache = {}

function get(options, buffers) {
  const key = sign(options, buffers)
  return cache[key]
}

function set(options, buffers, result) {
  const key = sign(options, buffers)
  cache[key] = result
  return result
}

function sign(options, buffers) {
  const hash = crypto.createHash('sha1')
  const content = Array.isArray(buffers)
    ? buffers.reduce(
      (ret, buffer) => ret + buffer.toString('base64'),
      JSON.stringify(options)
    )
    : JSON.stringify(options) + buffers

  hash.update(content)
  return hash.digest('hex')
}

export default { get, set, sign }
