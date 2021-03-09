const promiseCaches = new Map<string | symbol, Promise<any>>();

export default const cachePromise = (
  runFunction: () => Promise<any>,
  option: { cacheKey: string | symbol; timeout?: number } = { cacheKey: undefined },
) => {
  const { cacheKey, timeout } = option;
  if (!cacheKey) {
    return runFunction();
  }
  if (promiseCaches.has(cacheKey)) {
    return promiseCaches.get(cacheKey);
  }
  const promise = runFunction();
  promiseCaches.set(cacheKey, promise);
  promise.catch(() => {
    promiseCaches.delete(cacheKey);
  });
  promise.finally(() => {
    if (timeout !== undefined) {
      window.setTimeout(() => {
        promiseCaches.delete(cacheKey);
      }, timeout);
    } else {
      promiseCaches.delete(cacheKey);
    }
  });
  return promise;
};
