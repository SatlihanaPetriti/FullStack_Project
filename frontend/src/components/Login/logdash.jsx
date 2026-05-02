import { useState, useEffect } from 'react';
import {
  Person, BoxArrowRight, ClipboardCheck,
  Eye, EyeSlash, CheckLg, X, List, ChevronLeft
} from 'react-bootstrap-icons';
import './logdash.css';

// ─── Mock orders — swap with real API ────────────────────────────────────────
const MOCK_ORDERS = [
  {
    id: 'ORD-2841',
    date: 'Apr 28, 2025',
    status: 'Delivered',
    items: [
      { name: 'Monstera Deliciosa', qty: 1, price: 24.99 },
      { name: 'Ceramic Pot – White', qty: 2, price: 12.50 },
    ],
    total: 49.99,
  },
  {
    id: 'ORD-2763',
    date: 'Mar 14, 2025',
    status: 'Delivered',
    items: [{ name: 'Peace Lily', qty: 1, price: 18.00 }],
    total: 18.00,
  },
  {
    id: 'ORD-2910',
    date: 'May 01, 2025',
    status: 'Processing',
    items: [
      { name: 'Fiddle Leaf Fig', qty: 1, price: 39.99 },
      { name: 'Plant Food Drops', qty: 1, price: 9.99 },
    ],
    total: 49.98,
  },
];

const STATUS_COLOR = {
  Delivered: '#2d6a4f',
  Processing: '#e07b39',
  Cancelled:  '#c0392b',
  Shipped:    '#3a7bbf',
};

// ─── Profile Tab ──────────────────────────────────────────────────────────────
const ProfileTab = ({ user }) => {
  const [form, setForm]       = useState({ name: user?.name || '', email: user?.email || '' });
  const [editing, setEditing] = useState({ name: false, email: false });
  const [saved, setSaved]     = useState({ name: false, email: false });
  const [pwForm, setPwForm]   = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw]   = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  const saveField = (field) => {
    setEditing(e => ({ ...e, [field]: false }));
    setSaved(s => ({ ...s, [field]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [field]: false })), 2000);
    // TODO: persist via API
  };

  const handlePwSave = () => {
    if (!pwForm.current)                  { setPwError('Enter your current password.'); return; }
    if (pwForm.next.length < 6)           { setPwError('New password must be at least 6 characters.'); return; }
    if (pwForm.next !== pwForm.confirm)   { setPwError('Passwords do not match.'); return; }
    setPwError('');
    setPwSaved(true);
    setPwForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwSaved(false), 2500);
    // TODO: call API
  };

  const Field = ({ label, field, type = 'text' }) => (
    <div className="ap-field">
      <label className="ap-label">{label}</label>
      <div className="ap-field-row">
        {editing[field] ? (
          <>
            <input
              className="ap-input"
              type={type}
              value={form[field]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              autoFocus
            />
            <button className="ap-btn-save" onClick={() => saveField(field)}>
              <CheckLg size={13} /> Save
            </button>
            <button className="ap-btn-cancel" onClick={() => setEditing(e => ({ ...e, [field]: false }))}>
              <X size={15} />
            </button>
          </>
        ) : (
          <>
            <span className="ap-value">{form[field]}</span>
            {saved[field] && <span className="ap-saved-badge">✓ Saved</span>}
            <button className="ap-btn-edit" onClick={() => setEditing(e => ({ ...e, [field]: true }))}>
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );

  const PwInput = ({ label, field }) => (
    <div className="ap-field">
      <label className="ap-label">{label}</label>
      <div className="ap-field-row">
        <input
          className="ap-input"
          type={showPw[field] ? 'text' : 'password'}
          value={pwForm[field]}
          onChange={e => setPwForm(f => ({ ...f, [field]: e.target.value }))}
          placeholder="••••••••"
        />
        <button className="ap-btn-eye" onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))}>
          {showPw[field] ? <EyeSlash size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="ap-section">
      <div className="ap-card">
        <div className="ap-card-header">
          <h3 className="ap-card-title">Personal Info</h3>
        </div>
        <Field label="Full Name"     field="name" />
        <Field label="Email Address" field="email" type="email" />
      </div>

      <div className="ap-card">
        <div className="ap-card-header">
          <h3 className="ap-card-title">Change Password</h3>
        </div>
        <PwInput label="Current Password"     field="current" />
        <PwInput label="New Password"         field="next" />
        <PwInput label="Confirm New Password" field="confirm" />
        {pwError && <p className="ap-pw-error">{pwError}</p>}
        {pwSaved && <p className="ap-pw-success">✓ Password updated successfully!</p>}
        <button className="ap-btn-primary" onClick={handlePwSave}>Update Password</button>
      </div>
    </div>
  );
};

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
const DashboardTab = () => {
  const [expanded, setExpanded] = useState(null);
  const total     = MOCK_ORDERS.reduce((s, o) => s + o.total, 0);
  const delivered = MOCK_ORDERS.filter(o => o.status === 'Delivered').length;

  return (
    <div className="ap-section">
      <div className="ap-stats-row">
        <div className="ap-stat">
          <span className="ap-stat-num">{MOCK_ORDERS.length}</span>
          <span className="ap-stat-label">Orders</span>
        </div>
        <div className="ap-stat">
          <span className="ap-stat-num">{delivered}</span>
          <span className="ap-stat-label">Delivered</span>
        </div>
        <div className="ap-stat">
          <span className="ap-stat-num">€{total.toFixed(2)}</span>
          <span className="ap-stat-label">Total Spent</span>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card-header">
          <h3 className="ap-card-title">My Orders</h3>
        </div>

        {MOCK_ORDERS.length === 0 && (
          <p className="ap-empty">No orders yet. Time to grow your collection</p>
        )}

        <div className="ap-order-list">
          {MOCK_ORDERS.map(order => (
            <div key={order.id} className="ap-order-item">
              <div
                className="ap-order-summary"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="ap-order-left">
                  <span className="ap-order-id">{order.id}</span>
                  <span className="ap-order-date">{order.date}</span>
                </div>
                <div className="ap-order-right">
                  <span
                    className="ap-status-badge"
                    style={{ color: STATUS_COLOR[order.status], borderColor: STATUS_COLOR[order.status] }}
                  >
                    {order.status}
                  </span>
                  <span className="ap-order-total">€{order.total.toFixed(2)}</span>
                  <span className={`ap-chevron ${expanded === order.id ? 'open' : ''}`}>›</span>
                </div>
              </div>

              {expanded === order.id && (
                <div className="ap-order-detail">
                  {order.items.map((item, i) => (
                    <div key={i} className="ap-order-line">
                      <span className="ap-item-name">
                        {item.name} <span className="ap-item-qty">×{item.qty}</span>
                      </span>
                      <span className="ap-item-price">€{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="ap-order-line ap-order-total-line">
                    <span>Total</span>
                    <span>€{order.total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── AccountPage — inline full-page section (header + footer stay visible) ───
//
// HOW IT WORKS:
//   • This component renders as a normal div in document flow,
//     BELOW the sticky header and ABOVE the footer.
//   • When `show` is false it renders nothing, so the page underneath shows.
//   • No modal, no new tab, no page refresh.
//
// USAGE in App.jsx (or wherever you compose your layout):
//
//   <Header />
//   <AccountPage
//     show={showAccount}
//     initialTab={accountTab}
//     user={activeUser}
//     onClose={() => setShowAccount(false)}
//     onLogout={() => { logout(); setShowAccount(false); }}
//   />
//   {!showAccount && <YourPageRoutes />}   ← hide other content while account is open
//   <Footer />
//
const AccountPage = ({ show, initialTab = 'profile', user, onClose, onLogout }) => {
  const [tab, setTab]             = useState(initialTab);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Sync active tab when opened from different navbar links
  useEffect(() => { if (show) setTab(initialTab); }, [show, initialTab]);

  // Scroll to top of page whenever account view opens
  useEffect(() => {
    if (show) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [show]);

  if (!show) return null;

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const NAV = [
    { id: 'profile',   label: 'My Profile', icon: <Person size={15} /> },
    { id: 'dashboard', label: 'Dashboard',  icon: <ClipboardCheck size={15} /> },
  ];

  return (
    <div className="ap-page">

      {/* ── Breadcrumb / back bar ── */}
      <div className="ap-topbar">
        <button className="ap-back-btn" onClick={onClose}>
          <ChevronLeft size={14} /> Back to site
        </button>
        <span className="ap-topbar-trail">
          Account <span className="ap-trail-sep">›</span>{' '}
          {tab === 'profile' ? 'My Profile' : 'Dashboard'}
        </span>
      </div>

      <div className="ap-layout">

        {/* ── Sidebar ── */}
        <aside className="ap-sidebar">
          <div className="ap-sidebar-top">
            <div className="ap-avatar">{initials}</div>
            <div className="ap-sidebar-info">
              <p className="ap-user-name">{user?.name || 'Guest'}</p>
              <p className="ap-user-email">{user?.email || ''}</p>
            </div>
          </div>

          <nav className="ap-nav">
            {NAV.map(n => (
              <button
                key={n.id}
                className={`ap-nav-item ${tab === n.id ? 'active' : ''}`}
                onClick={() => setTab(n.id)}
              >
                {n.icon}
                {n.label}
              </button>
            ))}
          </nav>

          <button className="ap-nav-item ap-logout" onClick={onLogout}>
            <BoxArrowRight size={15} />
            Log Out
          </button>
        </aside>

        {/* ── Main content ── */}
        <main className="ap-main">

          {/* Mobile bar */}
          <div className="ap-mobile-bar">
            <button
              className="ap-hamburger"
              onClick={() => setMobileNavOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <List size={20} />
            </button>
            <span className="ap-mobile-title">
              {tab === 'profile' ? 'My Profile' : 'Dashboard'}
            </span>
          </div>

          {/* Mobile dropdown nav */}
          {mobileNavOpen && (
            <div className="ap-mobile-nav">
              {NAV.map(n => (
                <button
                  key={n.id}
                  className={`ap-nav-item ${tab === n.id ? 'active' : ''}`}
                  onClick={() => { setTab(n.id); setMobileNavOpen(false); }}
                >
                  {n.icon} {n.label}
                </button>
              ))}
              <button className="ap-nav-item ap-logout" onClick={() => { onLogout(); setMobileNavOpen(false); }}>
                <BoxArrowRight size={15} /> Log Out
              </button>
            </div>
          )}

          {/* Desktop section heading */}
          <h2 className="ap-section-title">
            {tab === 'profile' ? 'My Profile' : 'Dashboard'}
          </h2>

          {tab === 'profile'   && <ProfileTab user={user} />}
          {tab === 'dashboard' && <DashboardTab />}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;