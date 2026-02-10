const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const { requireValidSession } = require("../middlewares/session.middleware");
const user = require("../controllers/user.controller");

router.get("/me", requireAuth, user.getMyRoles);
router.post("/add-role", requireAuth, user.createRole);
router.put("/me/:role", requireAuth, user.updateMyRoleProfile);
router.post("/validate-login", requireAuth, user.validateLogin);
router.post("/logout/:role", requireAuth, user.logoutRole);

/* Example protected */
router.get(
  "/restaurant/dashboard",
  requireAuth,
  requireValidSession("restaurant"),
  (req, res) => res.json({ message: "Restaurant dashboard" }),
);

module.exports = router;
