import fs from 'fs'
import proof from 'proof'
import emilia from './index'

const lints = {
  src: {
    required: true,
    typeOf: 'string',
    satisfy: p => fs.existsSync(p)
  },
  dest: {
    required: true,
    typeOf: 'string'
  },
  output: {
    required: true,
    typeOf: 'string'
  }
}

export default function candy(opts) {
  const { src, dest, output, ...options } = proof(opts, lints)
  const { content, items } = emilia(options, fs.readFileSync(src, 'utf8'))

  console.log(content)
}
