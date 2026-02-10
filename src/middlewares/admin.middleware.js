const { supabase } = require("../config/supabase");

const requireAdmin = async (req, res, next) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", req.user.id)
    .eq("role", "admin")
    .eq("status", "approved")
    .single();

  if (!data) return res.status(403).json({ message: "Admin only" });
  next();
};

module.exports = { requireAdmin };
