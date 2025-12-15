import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useProfiles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all profiles
  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform to match existing app structure
      const transformedUsers = data.map((profile) => ({
        id: profile.id,
        name: profile.name || "Unknown",
        email: profile.email,
        role: profile.role || "member",
        avatar: profile.avatar,
      }));

      setUsers(transformedUsers);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a profile
  const updateProfile = async (userId, updates) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
      );
      return { success: true };
    } catch (err) {
      console.error("Error updating profile:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return {
    users,
    loading,
    error,
    updateProfile,
    refetch: fetchProfiles,
  };
}
