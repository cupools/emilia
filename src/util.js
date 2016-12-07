export default {
  map(...fns) {
    return target => fns.reduceRight((ret, fn) => fn(ret), target)
  },
  maps(...fns) {
    return target => fns.reduceRight((ret, fn) => ret.map(fn), target)
  }
}
