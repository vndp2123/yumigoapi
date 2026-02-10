const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const { requireValidSession } = require("../middlewares/session.middleware");
const address = require("../controllers/address.controller");

/**
 * ROLE-BASED ADDRESS APIs
 * role = customer | restaurant | delivery
 */

router.get(
  "/:role",
  requireAuth,
  requireValidSession("customer"), // role validated inside controller
  address.getMyAddresses,
);

router.post(
  "/:role",
  requireAuth,
  requireValidSession("customer"),
  address.addAddress,
);

router.put(
  "/:role/:address_id",
  requireAuth,
  requireValidSession("customer"),
  address.updateAddress,
);

router.delete(
  "/:role/:address_id",
  requireAuth,
  requireValidSession("customer"),
  address.deleteAddress,
);

module.exports = router;
