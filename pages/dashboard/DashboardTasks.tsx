import React, { useEffect, useState } from 'react';
import { Task } from '../../types';
import { DbService } from '../../services/db';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';

const DashboardTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      const data = await DbService.getPartnerTasks();
      setTasks(data);
      setIsLoading(false);
    }
    loadTasks();
  }, []);

  if (isLoading) {
    return <div className="text-white">Loading tasks...</div>;
  }

  const columns = [
    { id: 'todo', label: 'To Do', color: 'border-slate-500' },
    { id: 'in-progress', label: 'In Progress', color: 'border-cyan' },
    { id: 'review', label: 'Review', color: 'border-amber-500' },
    { id: 'done', label: 'Done', color: 'border-green-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Task Board</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors text-sm font-bold">
           <Plus size={16} /> New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col h-full">
            <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${col.color}`}>
               <h3 className="font-bold text-slate-300">{col.label}</h3>
               <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-400">
                 {tasks.filter(t => t.status === col.id).length}
               </span>
            </div>
            
            <div className="space-y-3 flex-1">
              {tasks.filter(t => t.status === col.id).map((task) => (
                <motion.div
                  key={task.id}
                  layoutId={task.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all cursor-grab active:cursor-grabbing"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                       task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                       task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                       'bg-green-500/20 text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{task.title}</h4>
                  <p className="text-xs text-slate-400 mb-3">{task.project}</p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1">
                       <Clock size={12} /> {task.dueDate}
                    </span>
                  </div>
                </motion.div>
              ))}
              {tasks.filter(t => t.status === col.id).length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl text-slate-600 text-xs">
                   No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardTasks;