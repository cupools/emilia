import log from './log'

export default {
    typeOf(actual, expect, info) {
        if (Object.prototype.toString.call(actual).indexOf(expect.name) < 0) {
            log.error(info)
            return false
        }
        return true
    },
    oneOf(actual, expect, info) {
        if (expect.indexOf(actual) < 0) {
            log.error(info)
            return false
        }
        return true
    },
    isNotNull(actual) {
        return actual != null
    }
}
