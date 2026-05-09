import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Btn, Input } from '../components/UI';
import { fmt } from '../utils/helpers';
import { api } from '../utils/api';
import { AVATAR_OPTIONS, getAvatar } from '../utils/avatarUtils';
import {
  User, Mail, Calendar, Shield,
  Edit2, Save, X, LogOut, Lock, CheckCircle, Smile
} from 'lucide-react';



export default function Profile() {
  const { currentUser, setCurrentUser, logout, transactions, stats } = useApp();

  // ── Avatar picker state ──────────────────────────────────────────────────
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarLoading, setAvatarLoading]       = useState(false);

  // ── Edit name state ──────────────────────────────────────────────────────
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName]         = useState(currentUser?.name || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg]         = useState('');

  // ── Change password state ────────────────────────────────────────────────
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [oldPwd, setOldPwd]           = useState('');
  const [newPwd, setNewPwd]           = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');
  const [pwdLoading, setPwdLoading]   = useState(false);
  const [pwdMsg, setPwdMsg]           = useState('');
  const [pwdError, setPwdError]       = useState('');

  // ── Derived data ─────────────────────────────────────────────────────────
  const memberSince = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'N/A';

  const totalTxCount  = transactions.length;
  const incomeCount   = transactions.filter(t => t.type === 'income').length;
  const expenseCount  = transactions.filter(t => t.type === 'expense').length;
  const savingsRate   = stats.totalIncome > 0
    ? Math.round((stats.balance / stats.totalIncome) * 100)
    : 0;

  // ── Current avatar ───────────────────────────────────────────────────────
  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === currentUser?.avatar);
  const initials = (currentUser?.name || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

// ── Select avatar ────────────────────────────────────────────────────────
async function handleSelectAvatar(avatarId) {
  setAvatarLoading(true);
  try {
    
    const updated = { ...currentUser, avatar: avatarId };
    localStorage.setItem('ff_user', JSON.stringify(updated));
    setCurrentUser(updated);
    setShowAvatarPicker(false);

    await api.updateProfile({ avatar: avatarId });

  } catch {
    console.error('Failed to save avatar to server');
  } finally {
    setAvatarLoading(false);
  }
}

  // ── Save name ────────────────────────────────────────────────────────────
  async function handleSaveName() {
    if (!newName.trim()) return;
    setNameLoading(true);
    setNameMsg('');
    try {
      const data = await api.updateProfile({ name: newName.trim() });
      if (data.user) {
        const updated = { ...currentUser, name: data.user.name };
        localStorage.setItem('ff_user', JSON.stringify(updated));
        setCurrentUser(updated);
        setNameMsg('Name updated!');
        setEditingName(false);
      } else {
        setNameMsg(data.message || 'Failed to update.');
      }
    } catch {
      setNameMsg('Something went wrong.');
    } finally {
      setNameLoading(false);
      setTimeout(() => setNameMsg(''), 3000);
    }
  }

  // ── Change password ──────────────────────────────────────────────────────
  async function handleChangePassword(e) {
    e.preventDefault();
    setPwdError(''); setPwdMsg('');
    if (newPwd.length < 6)     return setPwdError('New password must be at least 6 characters.');
    if (newPwd !== confirmPwd)  return setPwdError('Passwords do not match.');
    if (oldPwd === newPwd)      return setPwdError('New password must be different from current password.');

    setPwdLoading(true);
    try {
      const data = await api.changePassword({ oldPassword: oldPwd, newPassword: newPwd });
      if (data.message === 'Password updated successfully') {
        setPwdMsg('Password changed successfully!');
        setOldPwd(''); setNewPwd(''); setConfirmPwd('');
        setShowPwdForm(false);
      } else {
        setPwdError(data.message || 'Failed to change password.');
      }
    } catch {
      setPwdError('Something went wrong.');
    } finally {
      setPwdLoading(false);
      setTimeout(() => setPwdMsg(''), 4000);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ animation: 'slideUp 0.3s ease', maxWidth: 720, margin: '0 auto' }}>

      {/* ── Profile Header ──────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>

          {/* Avatar display */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: currentAvatar ? currentAvatar.bg : 'linear-gradient(135deg, var(--green), var(--blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: currentAvatar ? 40 : 28, fontWeight: 700, color: '#fff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              cursor: 'pointer', transition: 'transform 0.2s',
              userSelect: 'none',
            }}
              onClick={() => setShowAvatarPicker(true)}
              title="Change avatar"
            >
              {currentAvatar ? currentAvatar.emoji : initials}
            </div>

            {/* Edit badge */}
            <div
              onClick={() => setShowAvatarPicker(true)}
              style={{
                position: 'absolute', bottom: 2, right: 2,
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--blue)', border: '2px solid var(--surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              title="Change avatar"
            >
              <Smile size={14} color="#fff" />
            </div>
          </div>

          {/* Name + info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingName ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  style={{
                    fontSize: 20, fontWeight: 700, border: '2px solid var(--blue)',
                    borderRadius: 8, padding: '4px 10px', background: 'var(--surface)',
                    color: 'var(--text)', fontFamily: 'var(--font)', outline: 'none', boxShadow: '0 0 0 3px var(--blue-light)'
                  }}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') { setEditingName(false); setNewName(currentUser?.name); }
                  }}
                />
                <button onClick={handleSaveName} disabled={nameLoading}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)' }}>
                  <Save size={18} />
                </button>
                <button onClick={() => { setEditingName(false); setNewName(currentUser?.name); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }}>
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {currentUser?.name}
                </h2>
                <button onClick={() => setEditingName(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 4 }}
                  title="Edit name">
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            {nameMsg && <div style={{ fontSize: 13, color: 'var(--blue)', marginBottom: 4, fontWeight: 500 }}>✓ {nameMsg}</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text2)' }}>
              <Mail size={13} style={{ color: 'var(--text3)' }} />
              {currentUser?.email}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>
              <Calendar size={12} />
              Member since {memberSince}
            </div>
          </div>

          {/* Verified badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 20,
            background: 'var(--blue-light)', color: 'var(--blue)',
            fontSize: 13, fontWeight: 600, flexShrink: 0, border: '1px solid var(--blue)'
          }}>
            <CheckCircle size={14} />
            Verified
          </div>
        </div>
      </Card>

      {/* ── Avatar Picker ────────────────────────────────────────────────── */}
      {showAvatarPicker && (
        <Card style={{ marginBottom: 16, animation: 'fadeIn 0.2s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Choose Your Avatar</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Pick one that represents you</div>
            </div>
            <button onClick={() => setShowAvatarPicker(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 20, lineHeight: 1 }}>
              ×
            </button>
          </div>

          {/* Avatar grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
            gap: 10,
          }}>
            {AVATAR_OPTIONS.map(av => {
              const isSelected = currentUser?.avatar === av.id;
              return (
                <div
                  key={av.id}
                  onClick={() => !avatarLoading && handleSelectAvatar(av.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    padding: '10px 6px', borderRadius: 12, cursor: avatarLoading ? 'not-allowed' : 'pointer',
                    border: isSelected ? '2px solid var(--green)' : '2px solid transparent',
                    background: isSelected ? 'var(--green-light)' : 'var(--surface2)',
                    transition: 'all 0.18s', position: 'relative',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--border)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'var(--surface2)'; }}
                  title={av.id}
                >
                  {/* Colored circle with emoji */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: av.bg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 22,
                    boxShadow: isSelected ? `0 0 0 4px var(--surface), 0 0 0 6px var(--blue)` : 'none',
                    transition: 'box-shadow 0.2s',
                  }}>
                    {av.emoji}
                  </div>

                  {/* Avatar name */}
                  <span style={{
                    fontSize: 11, color: isSelected ? 'var(--blue)' : 'var(--text3)',
                    fontWeight: isSelected ? 600 : 500, textTransform: 'capitalize',
                    textAlign: 'center', marginTop: 4
                  }}>
                    {av.id}
                  </span>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute', top: 4, right: 4,
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'var(--blue)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)'
                    }}>
                      <CheckCircle size={10} color="#fff" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Remove avatar option */}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => handleSelectAvatar('')}
              style={{
                background: 'none', border: '1px solid var(--border2)', borderRadius: 8,
                padding: '6px 14px', fontSize: 13, color: 'var(--text3)',
                cursor: 'pointer', fontFamily: 'var(--font)',
              }}
            >
              Remove avatar — use initials instead
            </button>
          </div>
        </Card>
      )}

      {/* ── Stats Cards ─────────────────────────────────────────────────── */}
      <div className="grid-4-to-2" style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Balance',  value: fmt(stats.balance),       color: 'var(--blue)' },
          { label: 'Total Income',   value: fmt(stats.totalIncome),   color: 'var(--green)' },
          { label: 'Total Expenses', value: fmt(stats.totalExpense),  color: 'var(--red)' },
          { label: 'Savings Rate',   value: `${savingsRate}%`,
            color: savingsRate >= 20 ? 'var(--green)' : savingsRate >= 10 ? 'var(--amber)' : 'var(--red)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '14px 16px', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Activity Stats ──────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Account Activity</div>
        <div className="grid-3-to-1" style={{ display: 'grid', gap: 16 }}>
          {[
            { label: 'Total Transactions', value: totalTxCount,  icon: '⇄' },
            { label: 'Income Entries',     value: incomeCount,   icon: '↑' },
            { label: 'Expense Entries',    value: expenseCount,  icon: '↓' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--surface2)', borderRadius: 10,
              padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Security ────────────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showPwdForm ? 20 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={16} style={{ color: 'var(--blue)' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Password & Security</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>Change your account password</div>
            </div>
          </div>
          <Btn
            size="sm"
            variant={showPwdForm ? 'danger' : 'ghost'}
            onClick={() => { setShowPwdForm(!showPwdForm); setPwdError(''); setPwdMsg(''); }}
          >
            <Lock size={13} />
            {showPwdForm ? 'Cancel' : 'Change Password'}
          </Btn>
        </div>

        {pwdMsg && (
          <div style={{ background: 'var(--green-light)', border: '1px solid rgba(76,175,80,0.25)', color: 'var(--green)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
            ✓ {pwdMsg}
          </div>
        )}

        {showPwdForm && (
          <form onSubmit={handleChangePassword} style={{ animation: 'fadeIn 0.2s ease' }}>
            {pwdError && (
              <div style={{ background: 'var(--red-light)', border: '1px solid rgba(255,112,67,0.25)', color: 'var(--red)', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 14 }}>
                ⚠ {pwdError}
              </div>
            )}
            <div style={{ display: 'grid', gap: 14 }}>
              <Input label="Current Password" type="password" placeholder="Enter current password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} required />
              <div className="grid-2-to-1" style={{ display: 'grid', gap: 14 }}>
                <Input label="New Password" type="password" placeholder="Min. 6 characters" value={newPwd} onChange={e => setNewPwd(e.target.value)} required minLength={6} />
                <Input label="Confirm Password" type="password" placeholder="Repeat new password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <Btn type="submit" variant="primary" disabled={pwdLoading}>
                <Save size={14} />
                {pwdLoading ? 'Saving...' : 'Save New Password'}
              </Btn>
            </div>
          </form>
        )}
      </Card>

      {/* ── Logout ──────────────────────────────────────────────────────── */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Log Out</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Sign out of your FinFlow account</div>
          </div>
          <Btn variant="danger" onClick={logout}>
            <LogOut size={14} />
            Log Out
          </Btn>
        </div>
      </Card>

    </div>
  );
}
