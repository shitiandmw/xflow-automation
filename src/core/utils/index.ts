export const createPromiseWrapper = () => {
    let resolve:(value: unknown) => void = () => {}, reject :(reason?: any) => void = () => {};
  
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    
    return { promise, resolve, reject };
  };
  