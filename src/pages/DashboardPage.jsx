import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TaskCard } from '../components/TaskCard';
import { TaskFormModal } from '../components/TaskFormModel.jsx';
import { Plus, Search, Filter, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 6, lastPage: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 6,
        ...(search && { search }),
        ...(status && { status }),
        ...(priority && { priority }),
      });
      const res = await API.get(`/tasks?${params.toString()}`);
      setTasks(res.data.data.tasks);
      setMeta(res.data.data.meta);
    } catch (err) {
      console.error('Failed to load tasks', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, priority]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleStatusToggle = async (task) => {
    const nextStatus = task.status === 'DONE' ? 'PENDING' : 'DONE';
    try {
      await API.put(`/tasks/${task._id}`, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">TaskFlow</h1>
            <p className="text-xs text-slate-500">Logged in as {user?.name || user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1 rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search title or description..."
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-xs outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div>
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500 bg-white"
            >
              <option value="">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Filter className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No tasks found</p>
            <p className="text-xs text-slate-400 mt-1">Create a new task or adjust your search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusToggle={handleStatusToggle}
                onDelete={handleDelete}
                onEdit={(t) => {
                  setEditingTask(t);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {meta.lastPage > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4">
            <span className="text-xs text-slate-500">
              Page {meta.page} of {meta.lastPage} ({meta.total} items)
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center p-1.5 rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= meta.lastPage}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center p-1.5 rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <TaskFormModal
        isOpen={isModalOpen}
        initialData={editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSuccess={fetchTasks}
      />
    </div>
  );
};