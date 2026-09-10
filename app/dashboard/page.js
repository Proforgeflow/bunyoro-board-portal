'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function MemberDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('directory');
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    id: '',
    full_name: '',
    phone_number: '',
    avatar_url: '',
    id_document_url: '',
    bank_name: '',
    account_number: '',
    location: '',
    capital_contributed: 0,
    status: 'pending_verification'
  });

  const [allMembers, setAllMembers] = useState([]);
  const [news, setNews] = useState([]);
  const [minutes, setMinutes] = useState([]);
  const [roadmap, setRoadmap] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingId, setUploadingId] = useState(false);

  // Financial Summary Metrics
  const totalPooledCapital = allMembers.reduce((sum, m) => sum + (Number(m.capital_contributed) || 0), 0);
  const totalMembersCount = allMembers.length;
  const userSharePercentage = totalPooledCapital > 0 
    ? ((Number(profile.capital_contributed) / totalPooledCapital) * 100).toFixed(2) 
    : '0.00';

  useEffect(() => {
    checkSessionAndFetchData();
  }, []);

  async function checkSessionAndFetchData() {
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) {
      router.push('/');
      return;
    }

    const user = session.user;

    // Load User Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) {
      setProfile({
        id: profileData.id,
        full_name: profileData.full_name || '',
        phone_number: profileData.phone_number || '',
        avatar_url: profileData.avatar_url || '',
        id_document_url: profileData.id_document_url || '',
        bank_name: profileData.bank_account_details?.bank_name || '',
        account_number: profileData.bank_account_details?.account_number || '',
        location: profileData.location || 'Hoima, Uganda',
        capital_contributed: profileData.capital_contributed || 0,
        status: profileData.status || 'pending_verification'
      });
    }

    // Load All Data for Directory and Updates
    const { data: membersData } = await supabase.from('profiles').select('*').order('capital_contributed', { ascending: false });
    const { data: newsData } = await supabase.from('news_updates').select('*').order('created_at', { ascending: false });
    const { data: minutesData } = await supabase.from('meeting_minutes').select('*').order('meeting_date', { ascending: false });
    const { data: roadmapData } = await supabase.from('business_roadmap').select('*').order('display_order', { ascending: true });

    setAllMembers(membersData || []);
    setNews(newsData || []);
    setMinutes(minutesData || []);
    setRoadmap(roadmapData || []);
    setLoading(false);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      router.push('/');
      return;
    }

    const updates = {
      id: session.user.id,
      email: session.user.email,
      full_name: profile.full_name,
      phone_number: profile.phone_number,
      location: profile.location,
      bank_account_details: {
        bank_name: profile.bank_name,
        account_number: profile.account_number
      },
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);
    setSaving(false);

    if (error) {
      alert('Failed to save changes: ' + error.message);
    } else {
      alert('Profile details updated!');
      setIsEditing(false);
      checkSessionAndFetchData();
    }
  }

  async function handleFileUpload(e, bucket, fieldName, setUploadingState) {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingState(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      setUploadingState(false);
      router.push('/');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `${session.user.id}/${fieldName}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploadingState(false);
      return;
    }

    let fileUrl = filePath;
    if (bucket === 'member-photos') {
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      fileUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ [fieldName]: fileUrl, updated_at: new Date().toISOString() })
      .eq('id', session.user.id);

    setUploadingState(false);

    if (updateError) {
      alert('Failed to attach document: ' + updateError.message);
    } else {
      setProfile((prev) => ({ ...prev, [fieldName]: fileUrl }));
      alert('Document uploaded successfully!');
      checkSessionAndFetchData();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3 text-amber-400 font-bold tracking-widest uppercase text-xs">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p>Loading Board Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      <div className="h-1.5 bg-gradient-to-r from-amber-600 via-emerald-500 to-amber-500 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Header */}
        <header className="bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-3xl p-6 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              B
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Bunyoro Omuhama Real Estate
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Executive Board & Shareholder Equity Portal
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950/90 border border-slate-800 p-3 rounded-2xl w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center space-x-3">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500/60 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center font-black text-lg">
                  {profile.full_name ? profile.full_name[0] : 'M'}
                </div>
              )}
              <div>
                <p className="text-xs font-black text-white">{profile.full_name || 'Board Member'}</p>
                <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-0.5 ${
                  profile.status === 'approved' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {profile.status === 'approved' ? 'Active Director' : 'Pending Verification'}
                </span>
              </div>
            </div>

            <button
              onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
              className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold px-3 py-2 rounded-xl transition-all"
            >
              Sign Out 🚪
            </button>
          </div>
        </header>

        {/* FINANCIAL & TRANSPARENCY SUMMARY BAR */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Total Pooled Capital</span>
            <p className="text-lg sm:text-xl font-black text-amber-400 mt-1">UGX {Number(totalPooledCapital).toLocaleString()}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Active Shareholders</span>
            <p className="text-lg sm:text-xl font-black text-emerald-400 mt-1">{totalMembersCount} Members</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Your Contribution</span>
            <p className="text-lg sm:text-xl font-black text-white mt-1">UGX {Number(profile.capital_contributed).toLocaleString()}</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Your Equity Share</span>
            <p className="text-lg sm:text-xl font-black text-amber-400 mt-1">{userSharePercentage}%</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'directory', label: `Shareholder Directory (${totalMembersCount})` },
            { id: 'profile', label: 'My Profile & KYC' },
            { id: 'news', label: 'Executive Bulletins' },
            { id: 'minutes', label: 'Board Minutes Archive' },
            { id: 'roadmap', label: 'Up Next List & Roadmap' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-4 font-bold text-xs uppercase tracking-wider rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* TAB 1: SHAREHOLDER DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-wide">
                  👥 Board Members & Equity Directory
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Full financial transparency across all registered partners in Bunyoro Omuhama Real Estate.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allMembers.map((m) => {
                const memberShare = totalPooledCapital > 0 
                  ? ((Number(m.capital_contributed) / totalPooledCapital) * 100).toFixed(2) 
                  : '0.00';

                return (
                  <div key={m.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                    <div className="flex items-center space-x-4">
                      {m.avatar_url ? (
                        <img src={m.avatar_url} alt={m.full_name} className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center font-black text-xl">
                          {m.full_name ? m.full_name[0] : 'M'}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-black text-white">{m.full_name || 'Anonymous Director'}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          📍 {m.location || 'Hoima, Uganda'}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">Capital Contributed:</span>
                        <span className="font-black text-emerald-400">UGX {Number(m.capital_contributed || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-bold">Equity Ownership:</span>
                        <span className="font-black text-amber-400">{memberShare}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & KYC */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <h2 className="text-base font-black text-white uppercase tracking-wide">
                  Identification & Payout Details
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-bold px-4 py-2 rounded-xl border bg-amber-500/10 text-amber-400 border-amber-500/30"
                >
                  {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Full Legal Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white disabled:opacity-60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">WhatsApp / Phone</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={profile.phone_number}
                      onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white disabled:opacity-60 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Location / Residence</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white disabled:opacity-60 outline-none"
                    placeholder="e.g. Hoima City, Kampala, Dubai"
                  />
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-xs font-black uppercase text-amber-400 mb-4">Payout Account</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2">Bank / Mobile Provider</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={profile.bank_name}
                        onChange={(e) => setProfile({ ...profile, bank_name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white disabled:opacity-60 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2">Account / Phone Number</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={profile.account_number}
                        onChange={(e) => setProfile({ ...profile, account_number: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white disabled:opacity-60 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-amber-500 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider"
                  >
                    {saving ? 'Saving...' : 'Save Profile Details'}
                  </button>
                )}
              </form>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <h2 className="text-base font-black text-white uppercase tracking-wide border-b border-slate-800 pb-4">
                KYC Uploads
              </h2>

              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Board Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'member-photos', 'avatar_url', setUploadingAvatar)}
                  disabled={uploadingAvatar}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-amber-500/10 file:text-amber-400 cursor-pointer"
                />
              </div>

              <div className="border-t border-slate-800 pt-6">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">National ID / Passport</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, 'member-docs', 'id_document_url', setUploadingId)}
                  disabled={uploadingId}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-slate-800 file:text-slate-200 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXECUTIVE BULLETINS */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-lg font-black text-amber-400 uppercase tracking-wide mb-2">
                📢 Executive Board Announcements
              </h2>
              <p className="text-xs text-slate-300">
                Official notices regarding upcoming board meetings, shareholder votes, and operational developments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((item) => (
                <div key={item.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                        {item.category || 'Notice'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-white">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BOARD MINUTES ARCHIVE */}
        {activeTab === 'minutes' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-lg font-black text-white uppercase tracking-wide mb-2">
                📁 Official Board Minutes Archive
              </h2>
              <p className="text-xs text-slate-400">
                Review verified resolutions, meeting summaries, and attendance logs from prior board assemblies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {minutes.map((m) => (
                <div key={m.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-3">
                      <span>🗓️ {m.meeting_date}</span>
                      <span>📍 {m.location}</span>
                    </div>
                    <h3 className="text-sm font-black text-white">{m.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{m.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-lg font-black text-white uppercase tracking-wide mb-2">
                🗺️ Business Stages & Up Next List
              </h2>
              <p className="text-xs text-slate-400">
                Real-time execution phases for land acquisition, municipal regularizations, and shareholder returns in Bunyoro.
              </p>
            </div>

            <div className="space-y-4">
              {roadmap.map((stage, idx) => (
                <div key={stage.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">{stage.stage_name}</h3>
                      <p className="text-xs text-slate-300 mt-1">{stage.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-amber-400">{stage.target_quarter}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}