export const getUTM = (key) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key) || null;
  };