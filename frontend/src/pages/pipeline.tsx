import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import apiClient from '@/lib/api';
import { FiPlus } from 'react-icons/fi';
import styles from '@/styles/Pipeline.module.css';

const STAGES = ['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Closing'];
const STAGE_COLORS: Record<string, string> = { Prospecting: '#a5b4fc', Qualified: '#818cf8', Proposal: '#fbbf24', Negotiation: '#6366f1', Closing: '#34d399' };

export default function PipelinePage() {
  const [deals, setDeals] = useState<any[]>([]);
  const load = () => apiClient.get('/api/deals').then(r => setDeals(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const moveStage = async (id: number, stage: string) => {
    await apiClient.patch(`/api/deals/${id}/stage`, { stage });
    load();
  };

  return (
    <AppLayout>
      <div className={styles.header}>
        <div><h1 className={styles.title}>Pipeline</h1><p className={styles.sub}>{deals.length} deals</p></div>
      </div>
      <div className={styles.board}>
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const total = stageDeals.reduce((a: number, d: any) => a + (d.value || 0), 0);
          return (
            <div key={stage} className={styles.column}>
              <div className={styles.colHeader}>
                <div className={styles.colDot} style={{ background: STAGE_COLORS[stage] }}/>
                <span className={styles.colName}>{stage}</span>
                <span className={styles.colCount}>{stageDeals.length}</span>
              </div>
              <p className={styles.colTotal}>${(total / 1000).toFixed(0)}k</p>
              <div className={styles.cards}>
                {stageDeals.map(d => (
                  <div key={d.id} className={styles.dealCard}>
                    <p className={styles.dealTitle}>{d.title}</p>
                    <p className={styles.dealContact}>{d.contact_name || '—'}</p>
                    <p className={styles.dealValue}>${(d.value || 0).toLocaleString()}</p>
                    <div className={styles.stageActions}>
                      {STAGES.filter(s => s !== stage).map(s => (
                        <button key={s} className={styles.moveBtn} onClick={() => moveStage(d.id, s)}>{s.slice(0, 4)}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}