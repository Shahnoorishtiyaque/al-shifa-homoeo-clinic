import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ChevronDown, UserPlus, Users, Trash2 } from 'lucide-react'
import { useAuth } from '../auth/useAuth.js'
import { Button, Field, Notice, Spinner } from '../components/ui.jsx'
import { userService } from '../services/userService.js'

const emptyForm = { name: '', email: '', password: '', role: 'STAFF' }

export default function UserManagement() {
  const { user } = useAuth()
  const canManageUsers = ['ADMIN', 'DOCTOR'].includes(user?.role)
  const availableRoles = user?.role === 'ADMIN' ? ['ADMIN', 'DOCTOR', 'STAFF'] : ['DOCTOR', 'STAFF']
  const [form, setForm] = useState(emptyForm)
  const [users, setUsers] = useState([])
  const [busy, setBusy] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [message, setMessage] = useState(null)
  const [listError, setListError] = useState('')

  useEffect(() => {
    let active = true
    userService.list()
      .then(data => { if (active) setUsers(data) })
      .catch(error => { if (active) setListError(error.message || 'Could not load clinic accounts.') })
      .finally(() => { if (active) setLoadingUsers(false) })
    return () => { active = false }
  }, [])

  if (!canManageUsers) return <Navigate to="/staff/appointments" replace />

  const update = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
    setMessage(null)
  }

  const submit = async event => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setMessage(null)
    try {
      const created = await userService.create({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
      })
      setUsers(current => [created, ...current])
      setMessage({
        kind: 'success',
        text: `${created.name} (${created.email}) was added as ${created.role}. Share the password securely; it will not be shown again.`,
      })
      setForm(emptyForm)
    } catch (error) {
      setMessage({ kind: 'error', text: error.message || 'Could not create this account.' })
    } finally {
      setBusy(false)
    }
  }

  const removeUser = async account => {
    if (account.email.toLowerCase() === user.email.toLowerCase()) {
      setListError('You cannot delete your own account.')
      return
    }
    if (!window.confirm(`Delete ${account.name} (${account.role})? They will no longer be able to sign in. Their account record will be retained.`)) return
    setDeleting(account.id)
    setListError('')
    try {
      await userService.softDelete(account.id)
      setUsers(current => current.filter(item => item.id !== account.id))
    } catch (error) {
      setListError(error.message || 'Could not delete this account.')
    } finally {
      setDeleting(null)
    }
  }

  const roleName = role => ({ ADMIN: 'Admin', DOCTOR: 'Doctor', STAFF: 'Staff' })[role] || role

  return <div className="user-management">
    <div className="dash-title">
      <div><span className="eyebrow">STAFF WORKSPACE</span><h1>Manage users</h1><p>Create clinic accounts and manage existing access.</p></div>
    </div>
    <div className="user-form-card">
      <div className="user-form-heading"><span className="value-icon"><UserPlus size={20}/></span><div><h2>New clinic account</h2><p>Passwords are stored securely by the clinic backend.</p></div></div>
      {message && <Notice kind={message.kind}>{message.text}</Notice>}
      <form onSubmit={submit}>
        <div className="form-grid user-form-grid">
          <Field label="Full name *" name="name" autoComplete="name" maxLength={100} required value={form.name} onChange={update} placeholder="Full name" />
          <Field label="Email address *" name="email" type="email" autoComplete="email" maxLength={100} required value={form.email} onChange={update} placeholder="name@example.com" />
          <Field label="Temporary password *" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required value={form.password} onChange={update} placeholder="At least 8 characters" />
          <label className="field"><span>Account role *</span><span className="select-wrap user-role-select"><select name="role" value={form.role} onChange={update}>{availableRoles.map(role => <option key={role} value={role}>{roleName(role)}</option>)}</select><ChevronDown size={15}/></span></label>
        </div>
        <p className="user-role-note">{user.role === 'ADMIN' ? 'Admins can create admin, doctor, and staff accounts.' : 'Doctors can create doctor and staff accounts.'}</p>
        <Button className="button-primary user-submit" disabled={busy}>{busy ? <><Spinner/> Creating account…</> : <><UserPlus size={16}/> Create account</>}</Button>
      </form>
    </div>

    <section className="user-list-section">
      <div className="user-list-heading"><div><span className="value-icon"><Users size={20}/></span><div><h2>Clinic accounts</h2><p>{user.role === 'ADMIN' ? 'Admin, doctor, and staff accounts' : 'Doctor and staff accounts'}</p></div></div><span className="user-count">{users.length} {users.length === 1 ? 'account' : 'accounts'}</span></div>
      {listError && <Notice kind="error">{listError}</Notice>}
      {loadingUsers ? <div className="center-state"><Spinner/> Loading accounts…</div> : users.length === 0 ? <div className="empty-state user-empty-state"><h3>No user accounts found</h3></div> : <div className="user-account-list">{users.map(account => {
        const ownAccount = account.email.toLowerCase() === user.email.toLowerCase()
        return <article className="user-account" key={account.id}>
          <div className="user-account-main"><strong>{account.name}</strong><span>{account.email}</span></div>
          <span className={`user-role-badge user-role-${account.role.toLowerCase()}`}>{roleName(account.role)}</span>
          <span className={`user-status ${account.enabled ? 'is-enabled' : 'is-disabled'}`}>{account.enabled ? 'Active' : 'Disabled'}</span>
          <button type="button" className="appointment-delete" disabled={ownAccount || deleting === account.id} title={ownAccount ? 'You cannot delete your own account' : 'Delete this account'} onClick={() => removeUser(account)}><Trash2 size={14}/>{deleting === account.id ? 'Deleting…' : 'Delete'}</button>
        </article>
      })}</div>}
    </section>
  </div>
}
