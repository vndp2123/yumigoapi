const { supabase } = require("../config/supabase");

/* GET ALL USERS */
exports.getAllProfiles = async (req, res) => {
  const { data } = await supabase.from("profiles").select("*");
  res.json(data);
};

/* UPDATE USER (APPROVAL / BLOCK / DETAILS) */
exports.updateProfile = async (req, res) => {
  const { profile_id } = req.params;

  await supabase.from("profiles").update(req.body).eq("profile_id", profile_id);

  res.json({ message: "Updated" });
};

/* FORCE LOGOUT */
exports.forceLogout = async (req, res) => {
  const { profile_id } = req.params;

  await supabase
    .from("profiles")
    .update({ current_session_id: null })
    .eq("profile_id", profile_id);

  res.json({ message: "User logged out" });
};
