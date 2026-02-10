const { supabase } = require("../config/supabase");

const requireValidSession = (role) => async (req, res, next) => {
  const sessionId = req.headers["x-session-id"];
  if (!sessionId) return res.status(401).json({ message: "Session missing" });

  const { data } = await supabase
    .from("profiles")
    .select("current_session_id")
    .eq("user_id", req.user.id)
    .eq("role", role)
    .single();

  if (!data || data.current_session_id !== sessionId) {
    return res.status(401).json({ message: "Logged out from this device" });
  }

  next();
};

module.exports = { requireValidSession };
