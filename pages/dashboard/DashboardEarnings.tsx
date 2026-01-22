import React, { useEffect, useState } from 'react';
import { Transaction } from '../../types';
import { DbService } from '../../services/db';
import { DollarSign, Download, TrendingUp, CreditCard } from 'lucide-react';

const DashboardEarnings: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await DbService.getPartnerEarnings();
      setTransactions(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const totalEarnings = transactions
    .filter(t => t.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingEarnings = transactions
    .filter(t => t.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Financial Overview</h2>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-20"><CreditCard size={100} /></div>
           <p className="text-indigo-200 text-sm font-medium mb-1">Total Earnings</p>
           <h3 className="text-3xl font-bold text-white mb-6">₦{totalEarnings.toLocaleString()}</h3>
           <div className="flex gap-2">
             <button className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-lg transition-colors">
               Withdraw
             </button>
             <button className="flex-1 bg-black/20 hover:bg-black/30 text-indigo-100 text-xs font-bold py-2 rounded-lg transition-colors">
               Statement
             </button>
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg"><ClockIcon size={20}/></div>
              <p className="text-slate-400 text-sm">Pending Clearance</p>
           </div>
           <h3 className="text-2xl font-bold text-white">₦{pendingEarnings.toLocaleString()}</h3>
        </div>

         <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center">
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-cyan/20 text-cyan rounded-lg"><TrendingUp size={20}/></div>
              <p className="text-slate-400 text-sm">Next Payout Date</p>
           </div>
           <h3 className="text-2xl font-bold text-white">Nov 25, 2025</h3>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-bold text-white">Recent Transactions</h3>
          <button className="text-xs text-cyan hover:text-white flex items-center gap-1">
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-slate-300">{t.date}</td>
                  <td className="px-6 py-4 text-white font-medium">{t.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      t.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-white">₦{t.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ClockIcon = ({size}: {size: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default DashboardEarnings;