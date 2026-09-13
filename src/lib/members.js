export const storageKey = 'bunyoro_board_members';

export const seedMembers = [
  { id: '1', name: 'Mbabazi Rose', email: 'mbabazi@example.com', role: 'Shareholder', shares: 500, amountPaid: 5000000, status: 'Active' },
  { id: '2', name: 'John Kyaligonza Lugard', email: 'john@example.com', role: 'Board Member', shares: 1000, amountPaid: 10000000, status: 'Active' },
];

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatUGX = formatCurrency;

export const getMembers = () => {
  if (typeof window === 'undefined') return seedMembers;
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    localStorage.setItem(storageKey, JSON.stringify(seedMembers));
    return seedMembers;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return seedMembers;
  }
};

export const saveMembers = (members) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify(members));
  }
};

export const addMember = (newMember) => {
  const members = getMembers();
  const memberToAdd = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    status: 'Pending',
    ...newMember,
  };
  const updatedMembers = [...members, memberToAdd];
  saveMembers(updatedMembers);
  return memberToAdd;
};

export const getMemberById = (id) => {
  const members = getMembers();
  return members.find((m) => m.id === id) || null;
};
