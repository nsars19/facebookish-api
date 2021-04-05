module.exports = () => {
  let store = {};
  return {
    set: (item = {}) => (store = item),
    get: () => store,
  };
};
