module.exports = function getTokenFromRequest(req) {
  const auth = req.get("authorization");

  if (auth && auth.toLowerCase().startsWith("bearer")) {
    return auth.substring(7);
  }

  return null;
};
