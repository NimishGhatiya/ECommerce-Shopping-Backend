const {
  createOrder,
  updateorder,
  deleteOrder,
  getuserorder,
  findallorders,
  Findby2tables,
} = require("../controller/ordercontroller");
const { verifyToken, verifyTokenAndAdmin } = require("../middleware/auth");
const Express = require("express");
const router = Express.Router();

//CRETAE Order
router.post("/createorder", verifyToken, createOrder);

//UPDATE
router.put("/updateorder/:id", verifyTokenAndAdmin, updateorder);
router.delete("/deleteorder/:id", verifyTokenAndAdmin, deleteOrder);

router.get("/finduserorder/:userId", verifyToken, getuserorder);
router.get("/findallorders", verifyTokenAndAdmin, findallorders);

module.exports = router;
