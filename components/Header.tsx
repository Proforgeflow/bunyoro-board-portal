'use client';

interface HeaderProps {
  fullName?: string | null;
  status?: string | null;
  role?: string | null;
  onSignOut?: () => void | Promise<void>;
}

export default function Header({ fullName, status, role, onSignOut }: HeaderProps) {
  return (
    <header className="w-full p-4 bg-gray-900 text-white flex justify-between items-center border-b border-gray-800">
      <div>
        <h1 className="text-xl font-bold">Bunyoro Board Portal</h1>
        {fullName && (
          <p className="text-sm text-gray-400">
            {fullName} {role ? `• ${role}` : ''} {status ? `(${status})` : ''}
          </p>
        )}
      </div>
      {onSignOut && (
        <button
          onClick={() => onSignOut()}
          className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
        >
          Sign Out
        </button>
      )}
    </header>
  );
}
