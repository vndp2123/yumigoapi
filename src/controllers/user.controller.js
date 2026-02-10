const { supabase } = require("../config/supabase");

/* GET MY ROLES */
exports.getMyRoles = async (req, res) => {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", req.user.id);

  res.json(data);
};

/* CREATE NEW ROLE */
exports.createRole = async (req, res) => {
  const { role, full_name, gender, date_of_birth, avatar_url } = req.body;

  if (!["restaurant", "delivery"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const { error } = await supabase.from("profiles").insert({
    user_id: req.user.id,
    role,
    full_name,
    gender,
    date_of_birth,
    avatar_url,
    status: "pending",
    is_active: true,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Role request submitted" });
};

/* UPDATE ROLE PROFILE */
exports.updateMyRoleProfile = async (req, res) => {
  const { role } = req.params;

  const updates = {};
  [
    "full_name",
    "gender",
    "date_of_birth",
    "avatar_url",
    "phone",
    "email",
  ].forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", req.user.id)
    .eq("role", role);

  res.json({ message: "Profile updated" });
};

/* VALIDATE LOGIN + AUTO LOGOUT OLD DEVICE */
exports.validateLogin = async (req, res) => {
  const { role, session_id } = req.body;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", req.user.id)
    .eq("role", role)
    .single();

  if (!data) return res.status(403).json({ message: "Role not found" });
  if (!data.is_active) return res.status(403).json({ message: "Blocked" });

  if (["restaurant", "delivery"].includes(role) && data.status !== "approved") {
    return res.status(403).json({ message: `Status: ${data.status}` });
  }

  await supabase
    .from("profiles")
    .update({
      current_session_id: session_id,
      last_login_at: new Date(),
    })
    .eq("profile_id", data.profile_id);

  res.json({ message: "Login allowed" });
};

/* LOGOUT ROLE */
exports.logoutRole = async (req, res) => {
  const { role } = req.params;

  await supabase
    .from("profiles")
    .update({ current_session_id: null })
    .eq("user_id", req.user.id)
    .eq("role", role);

  res.json({ message: "Logged out" });
};
