import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import { FiPlus, FiX } from 'react-icons/fi';
import styles from '@/styles/Tasks.module.css';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', status: 'Pending', due_date: '' });

  const load = () => apiClient.get('/api/tasks').then(r => setTasks(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    await apiClient.post('/api/tasks', { ...form, due_date: form.due_date || null });
    setShowModal(false); load();
    setForm({ title: '', description: '', priority: 'Medium', status: 'Pending', due_date: '' });
  };

  const toggle = async (t: any) => {
    const newStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
    await apiClient.put(`/api/tasks/${t.id}`, { ...t, status: newStatus });
    load();
  };

  const remove = async (id: number) => { await apiClient.delete(`/api/tasks/${id}`); load(); };

  const priorityColor: Record<string, { bg: string; color: string }> = {
    High: { bg: '#fee2e2', color: '#b91c1c' }, Medium: { bg: '#fef3c7', color: '#b45309' }, Low: { bg: '#d1fae5', color: '#065f46' },
  };

  return (
    <AppLayout>
      <div className={styles.header}>
        <div><h1 className={styles.title}>Tasks</h1><p className={styles.sub}>{tasks.length} tasks</p></div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}><FiPlus size={16}/> Add Task</button>
      </div>
      <div className={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead><tr><th></th><th>Task</th><th>Priority</th><th>Status</th><th>Due Date</th><th></th></tr></thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.id}>
                  <td><input type="checkbox" checked={t.status === 'Completed'} onChange={() => toggle(t)}/></td>
                  <td style={{ textDecoration: t.status === 'Completed' ? 'line-through' : 'none' }}>{t.title}</td>
                  <td><span style={{ padding: '2px 10px', borderRadius: 999, fontSize: 12, background: priorityColor[t.priority]?.bg || '#f3f4f6', color: priorityColor[t.priority]?.color || '#4b5563' }}>{t.priority}</span></td>
                  <td>{t.status}</td>
                  <td>{t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'}</td>
                  <td><button className={styles.delBtn} onClick={() => remove(t.id)}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.backdrop} onClick={() => setShowModal(false)}/>
          <div className={styles.modal}>
            <div className={styles.modalHead}><h3>Add Task</h3><button onClick={() => setShowModal(false)}><FiX size={16}/></button></div>
            <div className={styles.modalBody}>
              <label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})}/>
              <label>Description</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
              <div className={styles.formRow}>
                <div style={{flex:1}}><label>Priority</label><select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}><option>High</option><option>Medium</option><option>Low</option></select></div>
                <div style={{flex:1}}><label>Due Date</label><input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})}/></div>
              </div>
            </div>
            <div className={styles.modalFoot}><button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button><button className={styles.saveBtn} onClick={save}>Create</button></div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}