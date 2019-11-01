const LoginMiddleWare = function(req, res, next) {
  const loginRouter = [
    "/api/cart/all",
    "/api/cart/add",
    "/api/cart/delete",
    "/api/cart/update",
    "/api/order/all",
    "/api/order/add",
    "/api/order/delete",
    "/api/order/update",
    "/api/user/logout",
    "/api/user/info",
    "/api/user/update",
    "/api/address/add",
    "/api/address/all"
  ];
  if (loginRouter.includes(req.url)) {
    if (req.session.userName) {
      next();
    } else {
      return res.json({ code: -1, msg: "用户未登陆" });
    }
  } else {
    next();
  }
};

export default LoginMiddleWare;
