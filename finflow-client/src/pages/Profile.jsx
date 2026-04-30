import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Btn, Input } from '../components/UI';
import { fmt } from '../utils/helpers';
import { api } from '../utils/api';
import {
  User, Mail, Calendar, Shield, Camera,
  Edit2, Save, X, LogOut, Lock, CheckCircle
} from 'lucide-react';

export default function Profile() {
  const { currentUser, setCurrentUser, logout, transactions, stats } = useApp();

  // ── Edit name state ──────────────────────────────────────────────────────
  const [editingName, setEditingName]   = useState(false);
  const [newName, setNewName]           = useState(currentUser?.name || '');
  const [nameLoading, setNameLoading]   = useState(false);
  const [nameMsg, setNameMsg]           = useState('');

  // ── Change password state ────────────────────────────────────────────────
  const [showPwdForm, setShowPwdForm]   = useState(false);
  const [oldPwd, setOldPwd]             = useState('');
  const [newPwd, setNewPwd]             = useState('');
  const [confirmPwd, setConfirmPwd]     = useState('');
  const [pwdLoading, setPwdLoading]     = useState(false);
  const [pwdMsg, setPwdMsg]             = useState('');
  const [pwdError, setPwdError]         = useState('');

  // ── Avatar state ─────────────────────────────────────────────────────────
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileRef = useRef();

  // ── Derived stats ────────────────────────────────────────────────────────
  const memberSince = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'N/A';

  const totalTxCount   = transactions.length;
  const incomeCount    = transactions.filter(t => t.type === 'income').length;
  const expenseCount   = transactions.filter(t => t.type === 'expense').length;
  const savingsRate    = stats.totalIncome > 0
    ? Math.round((stats.balance / stats.totalIncome) * 100)
    : 0;

  // ── Avatar initials (fallback) ───────────────────────────────────────────
  const initials = (currentUser?.name || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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
        setNameMsg(data.message || 'Failed to update name.');
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
    setPwdError('');
    setPwdMsg('');
    if (newPwd.length < 6)        return setPwdError('New password must be at least 6 characters.');
    if (newPwd !== confirmPwd)    return setPwdError('Passwords do not match.');
    if (oldPwd === newPwd)        return setPwdError('New password must be different from old password.');

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

  // ── Avatar upload ────────────────────────────────────────────────────────
  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert('Image must be under 2MB');

    setAvatarLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = await api.updateProfile({ avatar: reader.result });
        if (data.user) {
          const updated = { ...currentUser, avatar: data.user.avatar };
          localStorage.setItem('ff_user', JSON.stringify(updated));
          setCurrentUser(updated);
        }
      } catch {
        alert('Failed to upload avatar.');
      } finally {
        setAvatarLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ animation: 'slideUp 0.3s ease', maxWidth: 720, margin: '0 auto' }}>

      {/* ── Profile Header Card ─────────────────────────────────────────── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>

          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: currentUser?.avatar ? 'transparent' : 'linear-gradient(135deg, var(--green), var(--blue))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: '#fff', overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(76,175,80,0.3)',
            }}>
              {currentUser?.avatar
                ? <img src={currentUser.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials
              }
            </div>
            {/* Camera button */}
            <button
              onClick={() => fileRef.current.click()}
              disabled={avatarLoading}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: '50%',
                background: 'var(--green)', border: '2px solid var(--surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff', transition: 'transform 0.2s',
              }}
              title="Change photo"
            >
              <Camera size={13} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>

          {/* Name + email */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingName ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  style={{
                    fontSize: 20, fontWeight: 600, border: '1px solid var(--green)',
                    borderRadius: 8, padding: '4px 10px', background: 'var(--surface2)',
                    color: 'var(--text)', fontFamily: 'var(--font)', outline: 'none',
                  }}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
                />
                <button onClick={handleSaveName} disabled={nameLoading} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--green)' }}>
                  <Save size={18} />
                </button>
                <button onClick={() => { setEditingName(false); setNewName(currentUser?.name); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }}>
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{currentUser?.name}</h2>
                <button onClick={() => setEditingName(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 4 }} title="Edit name">
                  <Edit2 size={14} />
                </button>
              </div>
            )}
            {nameMsg && <div style={{ fontSize: 12, color: 'var(--green)', marginBottom: 4 }}>✓ {nameMsg}</div>}
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
            padding: '6px 12px', borderRadius: 20,
            background: 'var(--green-light)', color: 'var(--green)',
            fontSize: 12, fontWeight: 600, flexShrink: 0,
          }}>
            <CheckCircle size={13} />
            Verified
          </div>
        </div>
      </Card>

      {/* ── Stats Cards ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Balance', value: fmt(stats.balance), color: 'var(--blue)' },
          { label: 'Total Income', value: fmt(stats.totalIncome), color: 'var(--green)' },
          { label: 'Total Expenses', value: fmt(stats.totalExpense), color: 'var(--red)' },
          { label: 'Savings Rate', value: `${savingsRate}%`, color: savingsRate >= 20 ? 'var(--green)' : savingsRate >= 10 ? 'var(--amber)' : 'var(--red)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '14px 16px', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Activity Stats ──────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Account Activity</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Transactions', value: totalTxCount, icon: '⇄' },
            { label: 'Income Entries', value: incomeCount, icon: '↑' },
            { label: 'Expense Entries', value: expenseCount, icon: '↓' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--surface2)', borderRadius: 10,
              padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Security Section ────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showPwdForm ? 20 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--blue-light)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
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

        {/* Success message */}
        {pwdMsg && (
          <div style={{ background: 'var(--green-light)', border: '1px solid rgba(76,175,80,0.25)', color: 'var(--green)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
            ✓ {pwdMsg}
          </div>
        )}

        {/* Password form */}
        {showPwdForm && (
          <form onSubmit={handleChangePassword} style={{ animation: 'fadeIn 0.2s ease' }}>
            {pwdError && (
              <div style={{ background: 'var(--red-light)', border: '1px solid rgba(255,112,67,0.25)', color: 'var(--red)', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 14 }}>
                ⚠ {pwdError}
              </div>
            )}
            <div style={{ display: 'grid', gap: 14 }}>
              <Input label="Current Password" type="password" placeholder="Enter current password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="New Password" type="password" placeholder="Min. 6 characters" value={newPwd} onChange={e => setNewPwd(e.target.value)} required minLength={6} />
                <Input label="Confirm New Password" type="password" placeholder="Repeat new password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} required />
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

      {/* ── Danger Zone ─────────────────────────────────────────────────── */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--red)', marginBottom: 16 }}>Account</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Log Out</div>
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
