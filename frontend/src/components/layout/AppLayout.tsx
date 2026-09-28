import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiGrid, FiUsers, FiTarget, FiCheckSquare, FiMenu, FiX } from 'react-icons/fi';
import styles from './AppLayout.module.css';

const NAV = [
  { label: 'Dashboard', href: '/', icon: FiGrid },
  { label: 'Contacts', href: '/contacts', icon: FiUsers },
  { label: 'Pipeline', href: '/pipeline', icon: FiTarget },
  { label: 'Tasks', href: '/tasks', icon: FiCheckSquare },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.shell}>
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>B</div>
          <span className={styles.brandName}>Brevvo</span>
          <button className={styles.closeBtn} onClick={() => setOpen(false)}><FiX size={18}/></button>
        </div>
        <nav className={styles.nav}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className={`${styles.navItem} ${router.pathname === n.href ? styles.navActive : ''}`}>
              <n.icon size={16}/> {n.label}
            </Link>
          ))}
        </nav>
        <div className={styles.userBlock}>
          <div className={styles.avatar}>DW</div>
          <div><p className={styles.userName}>Dana Whitmore</p><p className={styles.userRole}>Sales Lead</p></div>
        </div>
      </aside>
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setOpen(true)}><FiMenu size={20}/></button>
          <div/>
          <div/>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}