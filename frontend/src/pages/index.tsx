import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import Link from 'next/link';
import { FiTrendingUp, FiAward, FiUserPlus, FiTarget, FiPhone, FiMail, FiCalendar, FiFileText, FiPlus, FiX } from 'react-icons/fi';
import styles from '@/styles/Dashboard.module.css';

interface DashboardStats {
  total_contacts: number;
  total_deals: number;
  total_tasks_pending: number;
  pipeline_value: number;
  recent_contacts: any[];
  upcoming_tasks: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', contact_id: '', value: '', stage: 'Prospecting' });

  useEffect(() => {
    apiClient.get('/api/dashboard/stats').then(r => setStats(r.data)).catch(() => {});
    apiClient.get('/api/deals').then(r => setDeals(r.data)).catch(() => {});
    apiClient.get('/api/contacts').then(r => setContacts(r.data)).catch(() => {});
  }, []);

  const createDeal = async () => {
    try {
      await apiClient.post('/api/deals', {
        title: form.title,
        contact_id: parseInt(form.contact_id) || (contacts[0]?.id || 1),
        value: parseFloat(form.value) || 0,
        stage: form.stage,
      });
      setShowModal(false);
      apiClient.get('/api/deals').then(r => setDeals(r.data));
      apiClient.get('/api/dashboard/stats').then(r => setStats(r.data));
    } catch {}
  };

  const stageColor: Record<string, string> = {
    Prospecting: '#a5b4fc', Qualified: '#818cf8', Proposal: '#6366f1', Negotiation: '#4f46e5', Closing: '#059669',
  };
  const stageBadge: Record<string, { bg: string; color: string }> = {
    Prospecting: { bg: '#e0e7ff', color: '#4338ca' },
    Qualified: { bg: '#f3f4f6', color: '#4b5563' },
    Proposal: { bg: '#fef3c7', color: '#b45309' },
    Negotiation: { bg: '#e0e7ff', color: '#4338ca' },
    Closing: { bg: '#d1fae5', color: '#065f46' },
  };

  const pipelineStages = ['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Closing'];
  const stageData = pipelineStages.map(s => {
    const d = deals.filter(x => x.stage === s);
    return { name: s, count: d.length, value: d.reduce((a: number, x: any) => a + (x.value || 0), 0) };
  });
  const maxVal = Math.max(...stageData.map(s => s.value), 1);

  const taskIcons = [FiPhone, FiMail, FiCalendar, FiFileText];
  const taskColors = ['#6366f1', '#d97706', '#059669', '#e11d48'];

  return (
    <AppLayout>
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>Good morning, Dana 👋</h1>
          <p className={styles.subtitle}>Your CRM overview</p>
        </div>
        <button className={styles.newBtn} onClick={() => setShowModal(true)}>
          <FiPlus size={16}/> New Deal
        </button>
      </div>

      <div className={styles.kpiGrid}>
        {[
          { label: 'Open Pipeline', value: `$${((stats?.pipeline_value || 0) / 1000).toFixed(0)}k`, icon: FiTrendingUp, iconColor: '#059669' },
          { label: 'Total Deals', value: stats?.total_deals ?? 0, icon: FiAward, iconColor: '#d97706' },
          { label: 'Total Contacts', value: stats?.total_contacts ?? 0, icon: FiUserPlus, iconColor: '#6366f1' },
          { label: 'Pending Tasks', value: stats?.total_tasks_pending ?? 0, icon: FiTarget, iconColor: '#e11d48' },
        ].map((k, i) => (
          <div key={i} className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiLabel}>{k.label}</span>
              <k.icon size={16} color={k.iconColor}/>
            </div>
            <p className={styles.kpiValue}>{k.value}</p>
          </div>
        ))}
      </div>

      <div className={styles.midGrid}>
        <div className={styles.pipelineCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Pipeline by Stage</h2>
            <Link href="/pipeline" className={styles.viewAll}>View all deals →</Link>
          </div>
          <div className={styles.stageList}>
            {stageData.map(s => (
              <div key={s.name}>
                <div className={styles.stageRow}>
                  <span>{s.name}</span>
                  <span className={styles.stageMeta}>${(s.value / 1000).toFixed(0)}k · {s.count} deals</span>
                </div>
                <div className={styles.barBg}><div className={styles.barFill} style={{ width: `${(s.value / maxVal) * 100}%`, background: stageColor[s.name] || '#6366f1' }}/></div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.taskCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Upcoming Tasks</h2>
            <Link href="/tasks" className={styles.viewAll}>All →</Link>
          </div>
          <ul className={styles.taskList}>
            {(stats?.upcoming_tasks || []).slice(0, 4).map((t: any, i: number) => {
              const Icon = taskIcons[i % taskIcons.length];
              return (
                <li key={t.id} className={styles.taskItem}>
                  <Icon size={16} color={taskColors[i % taskColors.length]} style={{ marginTop: 2, flexShrink: 0 }}/>
                  <div>
                    <p className={styles.taskTitle}>{t.title}</p>
                    <p className={styles.taskMeta}>{t.due_date ? new Date(t.due_date).toLocaleDateString() : ''} · {t.priority}</p>
                  </div>
                </li>
              );
            })}
            {(!stats?.upcoming_tasks || stats.upcoming_tasks.length === 0) && <li className={styles.taskMeta}>No upcoming tasks</li>}
          </ul>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.cardTitle}>Recent Deals</h2>
          <Link href="/pipeline" className={styles.viewAll}>View all →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Deal</th><th>Contact</th><th>Stage</th><th>Value</th>
              </tr>
            </thead>
            <tbody>
              {deals.slice(0, 5).map(d => (
                <tr key={d.id}>
                  <td className={styles.dealName}>{d.title}</td>
                  <td>{d.contact_name || '—'}</td>
                  <td><span className={styles.badge} style={{ background: stageBadge[d.stage]?.bg || '#f3f4f6', color: stageBadge[d.stage]?.color || '#4b5563' }}>{d.stage}</span></td>
                  <td className={styles.valueCol}>${(d.value || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}/>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Create New Deal</h3>
              <button onClick={() => setShowModal(false)} className={styles.modalClose}><FiX size={16}/></button>
            </div>
            <div className={styles.modalBody}>
              <label className={styles.fieldLabel}>Deal name</label>
              <input className={styles.input} placeholder="e.g. Q3 Expansion" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/>
              <label className={styles.fieldLabel}>Contact</label>
              <select className={styles.input} value={form.contact_id} onChange={e => setForm({ ...form, contact_id: e.target.value })}>
                <option value="">Select contact</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
              </select>
              <div className={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label className={styles.fieldLabel}>Value</label>
                  <input className={styles.input} placeholder="$0" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}/>
                </div>
                <div style={{ flex: 1 }}>
                  <label className={styles.fieldLabel}>Stage</label>
                  <select className={styles.input} value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>
                    {pipelineStages.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.createBtn} onClick={createDeal}>Create Deal</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}