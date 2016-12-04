export default {
  map(...fns) {
    return target => fns.reduceRight((ret, fn) => fn(ret), target)
  },
  Map(...fns) {
    return target => fns.reduceRight((ret, fn) => ret.map(fn), target)
  }
}
