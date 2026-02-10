const { supabase } = require("../config/supabase");

/**
 * GET ADDRESSES (OWN ROLE ONLY)
 */
exports.getMyAddresses = async (req, res) => {
  const { role } = req.params;

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", req.user.id)
    .eq("role", role)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

/**
 * ADD ADDRESS (OWN ROLE ONLY)
 */
exports.addAddress = async (req, res) => {
  const { role } = req.params;

  const {
    label,
    address_line1,
    address_line2,
    full_address,
    landmark,
    city,
    state,
    pincode,
    latitude,
    longitude,
    is_default,
  } = req.body;

  if (!address_line1 || !full_address || !city || !state || !pincode) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  // unset previous default if new default is set
  if (is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", req.user.id)
      .eq("role", role);
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: req.user.id,
    role,
    label,
    address_line1,
    address_line2,
    full_address,
    landmark,
    city,
    state,
    pincode,
    latitude,
    longitude,
    is_default: !!is_default,
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Address added successfully" });
};

/**
 * UPDATE ADDRESS (OWN ROLE ONLY)
 */
exports.updateAddress = async (req, res) => {
  const { role, address_id } = req.params;
  const updates = req.body;

  if (updates.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", req.user.id)
      .eq("role", role);
  }

  const { error } = await supabase
    .from("addresses")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("address_id", address_id)
    .eq("user_id", req.user.id)
    .eq("role", role);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Address updated successfully" });
};

/**
 * DELETE ADDRESS (OWN ROLE ONLY)
 */
exports.deleteAddress = async (req, res) => {
  const { role, address_id } = req.params;

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("address_id", address_id)
    .eq("user_id", req.user.id)
    .eq("role", role);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Address deleted successfully" });
};
