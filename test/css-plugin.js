import fs from 'fs-extra'
import Chai from 'chai'

Chai.use(cssPlugin)

function cssPlugin(chai, utils) {
  let { Assertion } = chai

  Assertion.addProperty('exist', function () {
    let path = utils.flag(this, 'object')

    this.assert(
      fs.fileExistsSync(path),
      'expect #{this} to be exist but miss',
      'expect #{this} to be miss but exist'
    )
  })
}
