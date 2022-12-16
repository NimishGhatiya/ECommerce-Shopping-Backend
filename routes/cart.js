const {
  createcart,
  updatecart,
  deleteCart,
  FindUserCart,
  FindAllUserCart,
} = require("../controller/cartcontroller");
const { verifyToken, verifyTokenAndAdmin } = require("../middleware/auth");
const Express = require("express");
const router = Express.Router();

//CRETAE CART
router.post("/createcart", verifyToken, createcart);

//UPDATE
router.put("/updatecart/:userId", verifyToken, updatecart);
router.delete("/deletecart/:userId", verifyToken, deleteCart);

router.get("/find/:userId", verifyToken, FindUserCart);
router.get("/findallUserCart", verifyTokenAndAdmin, FindAllUserCart);

module.exports = router;
