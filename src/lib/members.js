export const INITIAL_MEMBERS = [
  {
    id: 'm1',
    fullName: 'Asuman Kusiima',
    email: 'kusiima@bunyoromuhama.com',
    phone: '+971552372079',
    city: 'Hoima / Dubai',
    role: 'Founder & Board Director',
    equityShare: 24.32,
    capitalContributed: 450000000,
    capitalTarget: 500000000,
    status: 'Verified',
    joinedAt: '2026-01-15',
    propertyUnits: 'Subplot A1 - A4'
  },
  {
    id: 'm2',
    fullName: 'John Kyaligonza Lugard',
    email: 'lugard@bunyoromuhama.com',
    phone: '+256770000001',
    city: 'Kahoora, Hoima City',
    role: 'Executive Shareholder',
    equityShare: 15.13,
    capitalContributed: 280000000,
    capitalTarget: 300000000,
    status: 'Verified',
    joinedAt: '2026-02-01',
    propertyUnits: 'Subplot B1 - B3'
  },
  {
    id: 'm3',
    fullName: 'Mbabazi Rose',
    email: 'mbabazi@bunyoromuhama.com',
    phone: '+256770000002',
    city: 'Bujwahya, Hoima',
    role: 'Founding Investor',
    equityShare: 17.30,
    capitalContributed: 320000000,
    capitalTarget: 350000000,
    status: 'Verified',
    joinedAt: '2026-02-10',
    propertyUnits: 'Subplot C1 - C3'
  },
  {
    id: 'm4',
    fullName: 'Bunyoro Investment Trust',
    email: 'trust@bunyoromuhama.com',
    phone: '+256414000000',
    city: 'Kampala',
    role: 'Institutional Partner',
    equityShare: 27.03,
    capitalContributed: 500000000,
    capitalTarget: 500000000,
    status: 'Institutional',
    joinedAt: '2026-03-01',
    propertyUnits: 'Block D (Commercial Subplots)'
  },
  {
    id: 'm5',
    fullName: 'David Musinguzi',
    email: 'musinguzi@bunyoromuhama.com',
    phone: '+256782000003',
    city: 'Masindi',
    role: 'Individual Shareholder',
    equityShare: 16.22,
    capitalContributed: 300000000,
    capitalTarget: 350000000,
    status: 'Verified',
    joinedAt: '2026-04-12',
    propertyUnits: 'Subplot E1 - E2'
  }
];

const STORAGE_KEY = 'bunyoro-board-members';

export function getMembers() {
  if (typeof window === 'undefined') return INITIAL_MEMBERS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
    return INITIAL_MEMBERS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_MEMBERS;
  }
}

export function saveMembers(members) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export function addMember(newMemberData) {
  const currentMembers = getMembers();
  const totalContributed = currentMembers.reduce((sum, m) => sum + (Number(m.capitalContributed) || 0), 0) + Number(newMemberData.capitalContributed || 0);
  
  const member = {
    id: 'm' + (Date.now()),
    fullName: newMemberData.fullName,
    email: newMemberData.email,
    phone: newMemberData.phone,
    city: newMemberData.city || 'Bunyoro Region',
    role: newMemberData.role || 'Shareholder',
    capitalContributed: Number(newMemberData.capitalContributed) || 0,
    capitalTarget: Number(newMemberData.capitalTarget) || Number(newMemberData.capitalContributed) || 100000000,
    equityShare: 0,
    status: 'Pending Audit',
    joinedAt: new Date().toISOString().split('T')[0],
    propertyUnits: newMemberData.propertyUnits || 'Pending Subdivision'
  };

  const updatedMembers = [...currentMembers, member].map(m => {
    const share = totalContributed > 0 ? ((Number(m.capitalContributed) / totalContributed) * 100).toFixed(2) : 0;
    return { ...m, equityShare: Number(share) };
  });

  saveMembers(updatedMembers);
  return member;
}

export function formatUGX(amount) {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    maximumFractionDigits: 0
  }).format(amount || 0);
}
