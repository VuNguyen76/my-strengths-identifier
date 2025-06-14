
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUsers = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      // Since we can't use admin API, we'll get users from user_profiles table instead
      // First, ensure we have the user_profiles table by creating it if it doesn't exist
      let { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*');

      if (error) {
        // If user_profiles doesn't exist or we get an error, return empty array
        console.error('Error fetching user profiles:', error);
        return [];
      }

      // Filter profiles based on search query if provided
      let filteredProfiles = profiles || [];
      
      if (searchQuery) {
        filteredProfiles = filteredProfiles.filter(profile => 
          profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          profile.id?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return filteredProfiles.map(profile => ({
        id: profile.id,
        name: profile.name || 'Chưa có tên',
        email: 'Chưa có email', // We can't get email from user_profiles
        phone: profile.phone || 'Chưa có SĐT',
        role: profile.role || 'user',
        status: 'active' as const,
        createdAt: profile.created_at
      }));
    }
  });
};
