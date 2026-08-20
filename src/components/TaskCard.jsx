import React, { useEffect, useState } from 'react';
import { MapPin, Paperclip, CloudSun, Calendar, CheckCircle2, Trash2, Edit } from 'lucide-react';
import API from '../services/api';

export const TaskCard = ({ task, onStatusToggle, onDelete, onEdit }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (task.location) {
      API.get(`/tasks/weather?city=${encodeURIComponent(task.location)}`)
        .then((res) => {
          if (isMounted) setWeather(res.data.data);
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [task.location]);

  const priorityColor = {
    HIGH: 'bg-rose-50 text-rose-700 border-rose-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }[task.priority] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`font-semibold text-slate-800 text-base ${task.status === 'DONE' ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h3>
          <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${priorityColor}`}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-slate-600 mb-4">
          {task.dueDate && (
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {task.location && (
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{task.location}</span>
            </div>
          )}

          {weather && (
            <div className="flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-200 px-2 py-1 rounded font-medium">
              <CloudSun className="w-3.5 h-3.5 text-sky-500" />
              <span>{weather.temp}°C, {weather.description}</span>
            </div>
          )}

          {task.fileUrl && (
            <a
              href={task.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-1 rounded hover:bg-indigo-100 transition"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attachment</span>
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
        <button
          onClick={() => onStatusToggle(task)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition ${
            task.status === 'DONE'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{task.status === 'DONE' ? 'Completed' : 'Mark Done'}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
            title="Edit Task"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};