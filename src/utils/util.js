export default {
  assign(...obj) {
    return Object.assign({}, ...obj)
  },
  map(...fns) {
    return target => fns.reduceRight((ret, fn) => fn(ret), target)
  },
  maps(...fns) {
    return target => fns.reduceRight((ret, fn) => ret.map(fn), target)
  }
}
