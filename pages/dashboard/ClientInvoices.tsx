import React, { useEffect, useState } from 'react';
import { DbService } from '../../services/db';
import { Invoice } from '../../types';
import { motion } from 'framer-motion';
import { Download, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

const ClientInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await DbService.getClientInvoices();
      setInvoices(data);
      setLoading(false);
    }
    load();
  }, []);

  const handlePay = (id: string) => {
    alert(`Redirecting to payment gateway for invoice ${id}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Billing & Invoices</h2>
          <p className="text-slate-400 text-sm">Manage payments for services and placements.</p>
        </div>
        <div className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl flex items-center gap-4">
           <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><CreditCard size={20}/></div>
           <div>
             <p className="text-xs text-slate-400 uppercase">Outstanding Balance</p>
             <p className="text-lg font-bold text-white">₦250,000</p>
           </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-slate-400">Loading records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-slate-400 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Invoice #</th>
                  <th className="px-6 py-4 font-medium">Description</th>
                  <th className="px-6 py-4 font-medium">Issued Date</th>
                  <th className="px-6 py-4 font-medium">Due Date</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <motion.tr 
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white font-mono">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 text-slate-300 font-medium">{inv.description}</td>
                    <td className="px-6 py-4 text-slate-400">{inv.issuedDate}</td>
                    <td className="px-6 py-4 text-slate-400">{inv.dueDate}</td>
                    <td className="px-6 py-4 text-white font-bold">₦{inv.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        inv.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                        inv.status === 'overdue' ? 'bg-red-500/20 text-red-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                         {inv.status === 'paid' ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}
                         {inv.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                       <button className="text-slate-400 hover:text-white transition-colors"><Download size={16} /></button>
                       {inv.status !== 'paid' && (
                         <button 
                           onClick={() => handlePay(inv.id)}
                           className="px-3 py-1 bg-cyan text-midnight text-xs font-bold rounded hover:bg-white transition-colors"
                         >
                           Pay Now
                         </button>
                       )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientInvoices;