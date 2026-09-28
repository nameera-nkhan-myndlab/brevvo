import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';
import styles from '@/styles/Contacts.module.css';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', company: '', title: '', notes: '' });

  const load = () => apiClient.get('/api/contacts').then(r => setContacts(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const filtered = contacts.filter(c => `${c.first_name} ${c.last_name} ${c.company || ''}`.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditing(null); setForm({ first_name: '', last_name: '', email: '', phone: '', company: '', title: '', notes: '' }); setShowModal(true); };
  const openEdit = (c: any) => { setEditing(c); setForm({ first_name: c.first_name, last_name: c.last_name, email: c.email || '', phone: c.phone || '', company: c.company || '', title: c.title || '', notes: c.notes || '' }); setShowModal(true); };

  const save = async () => {
    try {
      if (editing) await apiClient.put(`/api/contacts/${editing.id}`, form);
      else await apiClient.post('/api/contacts', form);
      setShowModal(false); load();
    } catch {}
  };

  const remove = async (id: number) => {
    if (confirm('Delete this contact?')) { await apiClient.delete(`/api/contacts/${id}`); load(); }
  };

  return (
    <AppLayout>
      <div className={styles.header}>
        <div><h1 className={styles.title}>Contacts</h1><p className={styles.sub}>{contacts.length} total contacts</p></div>
        <button className={styles.addBtn} onClick={openNew}><FiPlus size={16}/> Add Contact</button>
      </div>
      <div className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}><FiSearch size={14} className={styles.searchIcon}/><input className={styles.searchInput} placeholder="Search contacts…" value={search} onChange={e => setSearch(e.target.value)}/></div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Company</th><th></th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} onClick={() => openEdit(c)} style={{ cursor: 'pointer' }}>
                  <td><div className={styles.nameCell}><div className={styles.avatarSm}>{c.first_name[0]}{c.last_name[0]}</div><div><span className={styles.nameMain}>{c.first_name} {c.last_name}</span><br/><span className={styles.titleText}>{c.title || ''}</span></div></div></td>
                  <td>{c.email || '—'}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.company || '—'}</td>
                  <td><button className={styles.delBtn} onClick={e => { e.stopPropagation(); remove(c.id); }}>×</button></td>
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
            <div className={styles.modalHead}><h3>{editing ? 'Edit Contact' : 'Add Contact'}</h3><button onClick={() => setShowModal(false)}><FiX size={16}/></button></div>
            <div className={styles.modalBody}>
              <div className={styles.formRow}><div style={{flex:1}}><label>First Name</label><input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})}/></div><div style={{flex:1}}><label>Last Name</label><input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})}/></div></div>
              <label>Email</label><input value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
              <label>Phone</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
              <label>Company</label><input value={form.company} onChange={e => setForm({...form, company: e.target.value})}/>
              <label>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})}/>
            </div>
            <div className={styles.modalFoot}><button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button><button className={styles.saveBtn} onClick={save}>{editing ? 'Update' : 'Create'}</button></div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}