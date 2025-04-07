export const getUTM = (key) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key) || null;
  };
  // function getUTM(key) {
  //   const params = new URLSearchParams(window.location.search);
  //   return params.get(key);
  // }