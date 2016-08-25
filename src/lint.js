import assert from './utils/assert'

const schemes = [{
    param: 'src',
    typeOf: Array,
    necessary: true
}, {
    param: 'dest',
    typeOf: String
}, {
    param: 'output',
    typeOf: String
}, {
    param: 'cssPath',
    typeOf: String
}, {
    param: 'prefix',
    typeOf: String
}, {
    param: 'algorithm',
    typeOf: String,
    oneOf: ['binary-tree', 'top-down', 'left-right', 'diagonal', 'alt-diagonal']
}, {
    param: 'padding',
    typeOf: Number
}, {
    param: 'unit',
    typeOf: String
}, {
    param: 'convert',
    typeOf: Number
}, {
    param: 'decimalPlaces',
    typeOf: Number
}, {
    param: 'quiet',
    typeOf: Boolean
}]

export default function(opt) {
    return schemes.every(rule => {
        let {param, typeOf, oneOf, necessary} = rule
        let actual = opt[param]
        let ret = true

        /* istanbul ignore next */
        if (typeOf) {
            ret = ret && assert.typeOf(actual, typeOf, `${param} should be ${typeOf.name} but get \`${actual}\``)
        }
        if (oneOf) {
            ret = ret && assert.oneOf(actual, oneOf, `${param} should be one of [${oneOf.join(', ')}] but get \`${actual}\``)
        }
        if (necessary) {
            ret = ret && assert.isNotNull(actual, `${param} should not be null or undefined`)
        }

        return ret
    })
}
