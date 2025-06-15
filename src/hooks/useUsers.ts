
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUsers = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["users", searchQuery],
    queryFn: async () => {
      // Get users from user_profiles with proper information
      let { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*');

      if (error) {
        console.error('Error fetching user profiles:', error);
        return [];
      }

      // Get auth users to get email information
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.warn('Cannot fetch auth users (admin access required):', authError);
      }

      // Create a map of auth users by ID for quick lookup
      const authUserMap = new Map<string, any>();
      if (authUsers) {
        authUsers.forEach((user: any) => {
          authUserMap.set(user.id, user);
        });
      }

      // Combine profile and auth data
      let combinedUsers = (profiles || []).map(profile => {
        const authUser = authUserMap.get(profile.id);
        return {
          id: profile.id,
          name: profile.name || authUser?.user_metadata?.name || 'Chưa có tên',
          email: authUser?.email || 'Chưa có email',
          phone: profile.phone || 'Chưa có SĐT',
          role: profile.role || 'user',
          status: 'active' as const,
          createdAt: profile.created_at || authUser?.created_at
        };
      });

      // If we don't have admin access, still show profiles with limited info
      if (!authUsers && profiles) {
        combinedUsers = profiles.map(profile => ({
          id: profile.id,
          name: profile.name || 'Chưa có tên',
          email: `user-${profile.id.slice(0, 8)}@domain.com`, // Show partial ID as email placeholder
          phone: profile.phone || 'Chưa có SĐT',
          role: profile.role || 'user',
          status: 'active' as const,
          createdAt: profile.created_at
        }));
      }

      // Filter users based on search query if provided
      if (searchQuery) {
        combinedUsers = combinedUsers.filter(user => 
          user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return combinedUsers;
    }
  });
};
