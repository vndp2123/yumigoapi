const router = require("express").Router();
const { requireAuth } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/admin.middleware");
const admin = require("../controllers/admin.controller");

router.get("/profiles", requireAuth, requireAdmin, admin.getAllProfiles);
router.put(
  "/profiles/:profile_id",
  requireAuth,
  requireAdmin,
  admin.updateProfile,
);
router.post(
  "/force-logout/:profile_id",
  requireAuth,
  requireAdmin,
  admin.forceLogout,
);

module.exports = router;
