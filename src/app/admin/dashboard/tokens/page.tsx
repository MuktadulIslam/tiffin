export default function TokensPage() {
  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Tokens</h1>
          <p className="text-slate-400 text-sm mt-0.5">Coming soon</p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 opacity-50 cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Generate Token
        </button>
      </div>

      <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
        <p className="text-slate-400 text-lg font-semibold">Token management coming soon</p>
      </div>
    </div>
  );
}
