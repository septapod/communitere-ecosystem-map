import { createClient } from '@supabase/supabase-js';
import { Organization } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Organization queries
export const getOrganizations = async (): Promise<Organization[]> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('organization', { ascending: true });

  if (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
  return data || [];
};

export const getOrganizationsByCategory = async (category: string): Promise<Organization[]> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('category', category)
    .order('organization', { ascending: true });

  if (error) {
    console.error('Error fetching organizations by category:', error);
    return [];
  }
  return data || [];
};

export const searchOrganizations = async (query: string): Promise<Organization[]> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .or(`organization.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
    .order('organization', { ascending: true });

  if (error) {
    console.error('Error searching organizations:', error);
    return [];
  }
  return data || [];
};

export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('organizations')
    .select('category')
    .distinct();

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data ? data.map((item) => item.category).filter(Boolean) as string[] : [];
};

export const addOrganization = async (org: Omit<Organization, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('organizations')
    .insert([org])
    .select();

  if (error) {
    console.error('Error adding organization:', error);
    return null;
  }
  return data?.[0];
};

export const updateOrganization = async (id: string, org: Partial<Organization>) => {
  const { data, error } = await supabase
    .from('organizations')
    .update(org)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating organization:', error);
    return null;
  }
  return data?.[0];
};

export const deleteOrganization = async (id: string) => {
  const { error } = await supabase
    .from('organizations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting organization:', error);
    return false;
  }
  return true;
};
