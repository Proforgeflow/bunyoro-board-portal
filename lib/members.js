import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatUGX = formatCurrency;

export const getMembers = async () => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching members from Supabase:', error.message);
    return [];
  }
  return data || [];
};

export const addMember = async (newMember) => {
  const { data, error } = await supabase
    .from('members')
    .insert([
      {
        name: newMember.name,
        email: newMember.email,
        role: newMember.role || 'Member',
        shares: Number(newMember.shares || 0),
        amount_paid: Number(newMember.amountPaid || newMember.amount_paid || 0),
        status: newMember.status || 'Pending',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error inserting member into Supabase:', error.message);
    throw error;
  }
  return data;
};

export const getMemberById = async (id) => {
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching member by ID from Supabase:', error.message);
    return null;
  }
  return data;
};
