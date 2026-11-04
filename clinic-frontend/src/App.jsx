import { BrowserRouter, Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Activity, ArrowDown, ArrowRight, CalendarDays, ChevronDown, Clock3, HeartHandshake, Leaf, MapPin, Menu, ShieldCheck, Stethoscope, Trash2, X } from 'lucide-react'
import { useAuth } from './auth/useAuth.js'
import { appointmentService } from './services/appointmentService.js'
import { ApiError } from './services/api.js'
import UserManagement from './pages/UserManagement.jsx'
import { Button, Field, Notice, Spinner, StatusBadge } from './components/ui.jsx'

const clinic = { name: 'Al Shifa', address: 'Azizul Complex, Kolasi, Katihar, Bihar', hours: '10:00 AM – 7:00 PM', doctors: [{ name: 'Dr. M Sharif', image: '/MdSharif.png' }, { name: 'Dr. Farha Nishat', image: '/Farha.webp' }] }

function formatIndianDateTime(value) {
  if (!value) return 'Not available'
  const timestamp = typeof value === 'string' && !/(Z|[+-]\d{2}:?\d{2})$/i.test(value) ? `${value}+05:30` : value
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return 'Not available'
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(date)
}

function formatAppointmentDateTime(date, time) {
  if (!date) return 'Not available'
  const value = `${date}T${time || '10:00:00'}`
  return formatIndianDateTime(value)
}

function Header() {
  const [open, setOpen] = useState(false)
  const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/contact', 'Contact']]
  return <>
    <div className="topline"><Link to="/contact" className="topline-location"><MapPin size={14}/><span>Kolasi, Katihar</span></Link><span className="topline-hours"><Clock3 size={14}/>{clinic.hours}</span></div>
    <header className="site-header"><div className="nav-wrap">
      <Link to="/" className="brand"><img src="/clinic-logo.jpeg" alt="Al Shifa Homeo Clinic"/><span><strong>AL SHIFA</strong><small>HOMEO CLINIC</small></span></Link>
      <button className="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      <nav className={open ? 'main-nav open' : 'main-nav'}>{links.map(([to,label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}<Link className="nav-cta" to="/appointment" onClick={() => setOpen(false)}>Book an appointment <ArrowRight size={16}/></Link></nav>
    </div></header>
  </>
}
function Footer() { return <footer className="site-footer"><div className="footer-grid"><div><Link to="/" className="brand footer-brand"><img src="/clinic-logo.jpeg" alt=""/><span><strong>AL SHIFA</strong><small>HOMEO CLINIC</small></span></Link><p>Attentive, respectful care for individuals and families.</p></div><div><h3>Explore</h3><Link to="/about">About the clinic</Link><Link to="/services">Services</Link><Link to="/appointment">Book appointment</Link></div><div><h3>Visit us</h3><p><MapPin size={16}/>{clinic.address}</p><p><Clock3 size={16}/>{clinic.hours}</p><a target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=Azizul+Complex+Kolasi+Katihar+Bihar">Open map <ArrowRight size={14}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Al Shifa Homeo Clinic</span><Link to="/staff/login">Staff access</Link></div></footer> }
function PublicLayout() { return <><Header/><Outlet/><Footer/></> }
function Home() {
  return <main><section className="hero"><div className="hero-shape shape-one"/><div className="hero-shape shape-two"/><div className="container hero-grid"><div className="hero-copy"><h2 className="eyebrow light hero-brand"><span className="eyebrow-dot"/> AL SHIFA HOMEO CLINIC</h2><h1>Care that starts with <em>listening.</em></h1><p>Personal attention, a welcoming clinic, and time to talk about what matters to you.</p><div className="hero-actions"><Link className="button button-gold" to="/appointment">Book an appointment <ArrowRight size={17}/></Link><Link className="text-link light-link" to="/about">Get to know us <ArrowDown size={16}/></Link></div><div className="hero-note"><span className="mini-icons"><HeartHandshake size={18}/><Leaf size={18}/></span><span>Respectful, family-focused visits</span></div></div><div className="hero-photo-wrap"><div className="hero-logo-frame"><img src="/clinic-logo.jpeg" alt="Al Shifa Homeo Clinic logo" className="hero-logo"/></div><div className="photo-caption"><div className="caption-icon"><MapPin size={18}/></div><span><small>Find us in</small><strong>Kolasi, Katihar</strong></span></div><div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/></div></div></section>
    <section className="intro-section section-pad"><div className="container intro-grid"><div><span className="eyebrow">A WARM WELCOME</span><h2>Care with understanding, at every visit.</h2></div><div><p className="intro-text">At Al Shifa Homeo Clinic, we want every person who walks through our doors to feel heard and respected. We take time to understand your concerns and help you plan your visit.</p><Link className="text-link" to="/about">More about our clinic <ArrowRight size={16}/></Link></div></div></section>
    <section className="values-section section-pad"><div className="container"><div className="section-heading"><span className="eyebrow">YOUR VISIT</span><h2>A comfortable place to begin</h2><p>Get in touch to ask a question or request an appointment with the clinic.</p></div><div className="value-grid"><article className="value-card"><span className="value-icon"><HeartHandshake/></span><h3>Personal attention</h3><p>Share what brings you in and ask the questions on your mind.</p></article><article className="value-card"><span className="value-icon"><Clock3/></span><h3>Plan your visit</h3><p>Choose a date and time that works for your appointment request.</p></article><article className="value-card"><span className="value-icon"><MapPin/></span><h3>Easy to find</h3><p>Visit us at Azizul Complex in Kolasi, Katihar.</p></article></div></div></section>
    <section className="doctors-section section-pad"><div className="container doctors-grid"><div><span className="eyebrow">MEET THE DOCTORS</span><h2>Here to listen and guide your visit.</h2><p>Meet the doctors at Al Shifa Homeo Clinic. Contact us to enquire about an appointment.</p><Link className="text-link" to="/about">About the team <ArrowRight size={16}/></Link></div><div className="doctor-mini-grid">{clinic.doctors.map(d => <article className="doctor-mini" key={d.name}><img src={d.image} alt={d.name}/><strong>{d.name}</strong><small>Homeopathic Doctor</small></article>)}</div></div></section>
    <Callout/></main>
}
function Callout() { return <section className="callout"><div className="container callout-inner"><div><span className="eyebrow light">WE’RE HERE TO HELP</span><h2>Ready to plan your visit?</h2><p>Send an appointment request and the clinic will follow up with you.</p></div><Link className="button button-gold" to="/appointment">Request an appointment <ArrowRight size={17}/></Link></div></section> }
function PageIntro({ eyebrow, title, copy }) { return <section className="page-intro"><div className="container"><span className="eyebrow light">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div></section> }
function About() { return <main><PageIntro eyebrow="ABOUT AL SHIFA" title="A clinic built around listening." copy="We welcome individuals and families seeking a thoughtful, comfortable healthcare experience."/><section className="section-pad"><div className="container about-content"><div className="about-mark"><img src="/clinic-logo.jpeg" alt="Al Shifa Homeo Clinic"/></div><div><span className="eyebrow">OUR APPROACH</span><h2>Time, attention, and respect.</h2><p>Every visit is an opportunity to understand your concerns. Our team aims to provide a welcoming experience where you can talk openly and ask questions.</p><p>For appointment availability and visit details, contact the clinic or send an appointment request online.</p><Link className="text-link" to="/appointment">Plan your visit <ArrowRight size={16}/></Link></div></div></section><section className="doctor-section section-pad"><div className="container"><div className="section-heading"><span className="eyebrow">OUR DOCTORS</span><h2>Meet the team</h2></div><div className="doctor-grid">{clinic.doctors.map((d) => <article className="doctor-card" key={d.name}><img src={d.image} alt={d.name}/><div><span className="eyebrow">AL SHIFA HOMEO CLINIC</span><h3>{d.name}</h3><p>Homeopathic Doctor</p><p className="doctor-bio">Committed to listening to patients and providing attentive care.</p></div></article>)}</div></div></section><Callout/></main> }
const offerings = [{ icon: HeartHandshake, title: 'Patient consultations', text: 'A chance to discuss your concerns and ask questions during a clinic visit.' }, { icon: CalendarDays, title: 'Appointment requests', text: 'Request an appointment date. The clinic can follow up to confirm arrangements.' }, { icon: Stethoscope, title: 'Homeopathy consultations', text: 'Speak with the clinic team about consultation availability and the care they provide.' }]
function Services() { return <main><PageIntro eyebrow="SERVICES" title="Thoughtful consultations." copy="Contact the clinic to learn more about consultation availability and arrange a visit."/><section className="section-pad"><div className="container"><div className="section-heading"><span className="eyebrow">HOW WE CAN HELP</span><h2>Start with a conversation</h2><p>Contact the clinic for details about your visit. No treatment outcomes are promised.</p></div><div className="service-grid">{offerings.map(({icon:Icon,title,text})=><article className="service-card" key={title}><span className="value-icon"><Icon/></span><h3>{title}</h3><p>{text}</p></article>)}</div><div className="service-disclaimer"><ShieldCheck size={20}/><p>Every person’s situation is different. Contact the clinic to discuss your questions and whether an appointment is appropriate.</p></div></div></section><Callout/></main> }
function Contact() { return <main><PageIntro eyebrow="CONTACT" title="We’d be glad to hear from you." copy="Reach out to ask about appointment availability, timings, or directions."/><section className="section-pad"><div className="container contact-grid"><div><span className="eyebrow">VISIT THE CLINIC</span><h2>Find us in Kolasi.</h2><p>We are located at Azizul Complex, Kolasi, Katihar, Bihar. Use the map link for directions or send an appointment request online.</p><Link className="button button-primary" to="/appointment">Book an appointment <ArrowRight size={16}/></Link></div><div className="contact-card"><div className="contact-row"><span className="value-icon"><MapPin/></span><div><small>ADDRESS</small><strong>{clinic.address}</strong></div></div><div className="contact-row"><span className="value-icon"><Clock3/></span><div><small>CLINIC HOURS</small><strong>{clinic.hours}</strong><em>Confirm availability with the clinic before visiting.</em></div></div><div className="map-panel"><MapPin size={24}/><span>Azizul Complex<br/>Kolasi, Katihar, Bihar</span><a target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=Azizul+Complex+Kolasi+Katihar+Bihar">Open in Google Maps <ArrowRight size={14}/></a></div></div></div></section></main> }
const initialForm = { patientName:'', phone:'', appointmentDate:'', reason:'' }
function localDateValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
function Appointment() {
  const [form,setForm] = useState(initialForm), [errors,setErrors] = useState({}), [busy,setBusy] = useState(false), [result,setResult] = useState(null)
  const update = e => { setForm({...form,[e.target.name]:e.target.value}); setErrors({...errors,[e.target.name]:''}); setResult(null) }
  const validate = () => { const next={}; if(!form.patientName.trim()) next.patientName='Please enter your name.'; else if(form.patientName.trim().length>100) next.patientName='Name must be 100 characters or fewer.'; if(!/^[0-9]{10,15}$/.test(form.phone)) next.phone='Enter 10 to 15 digits, without spaces.'; if(!form.appointmentDate) next.appointmentDate='Choose a date.'; else if(form.appointmentDate < localDateValue()) next.appointmentDate='Date cannot be in the past.'; if(form.reason.length>2000) next.reason='Keep your note under 2,000 characters.'; return next }
  const submit = async e => { e.preventDefault(); if(busy) return; const next=validate(); setErrors(next); if(Object.keys(next).length) return; setBusy(true); setResult(null); try { const data = await appointmentService.create({ ...form, patientName:form.patientName.trim(), appointmentTime:'10:00:00', reason:form.reason.trim() || null }); setResult({success:true,bookedOn:data?.createdAt ?? null,message:`Your request was received${data?.id ? ` (reference #${data.id})` : ''}. The clinic will follow up about confirmation.`}); setForm(initialForm) } catch(error) { setResult({success:false,message:error instanceof ApiError ? error.message : 'We could not send your request. Check your connection and try again.'}) } finally {setBusy(false)} }
  return <main><PageIntro eyebrow="APPOINTMENTS" title="Let’s plan your visit." copy="Send an appointment request and the clinic will follow up about availability and confirmation."/><section className="section-pad appointment-area"><div className="container appointment-layout"><aside className="appointment-aside"><span className="eyebrow">YOUR VISIT</span><h2>A few details to get started.</h2><p>Your request will remain pending until the clinic confirms the appointment.</p><div className="aside-detail"><CalendarDays/><span><strong>Choose a preferred date</strong><small>Today or a future date</small></span></div></aside><form className="form-card" onSubmit={submit} noValidate><h2>Appointment request</h2><p className="form-subtitle">Fields marked with * are required.</p>{result&&<Notice kind={result.success?'success':'error'}>{result.message}{result.success&&<small className="booking-created-at">Booked On: {formatIndianDateTime(result.bookedOn)}</small>}</Notice>}<div className="form-grid"><Field label="Patient name *" name="patientName" autoComplete="name" maxLength={100} value={form.patientName} onChange={update} error={errors.patientName} placeholder="Your full name"/><Field label="Phone number *" name="phone" type="tel" autoComplete="tel" inputMode="numeric" maxLength={15} value={form.phone} onChange={e=>{if(/^\d{0,15}$/.test(e.target.value)) update(e)}} error={errors.phone} placeholder="10–15 digits"/><Field label="Preferred date *" name="appointmentDate" type="date" min={localDateValue()} value={form.appointmentDate} onChange={update} error={errors.appointmentDate}/><label className="field full-field"><span>Reason for visit <small>(optional)</small></span><textarea name="reason" value={form.reason} maxLength={2000} onChange={update} rows="4" placeholder="Anything you would like the clinic to know?"/><small className="field-hint">{form.reason.length}/2000 characters</small>{errors.reason&&<em>{errors.reason}</em>}</label></div><Button className="button-primary submit-button" disabled={busy}>{busy?<><Spinner/> Sending request…</>:<>Send appointment request <ArrowRight size={17}/></>}</Button><p className="privacy-note">Your request stays pending until confirmed. This form does not send automatic status updates; please contact the clinic to check.</p></form></div></section></main>
}
function Login() { const { login, user } = useAuth(); const navigate=useNavigate(); const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''); useEffect(()=>{if(user) navigate('/staff/appointments',{replace:true})},[user,navigate]); const submit=async e=>{e.preventDefault();setBusy(true);setError('');try{await login(email.trim(),password);navigate('/staff/appointments',{replace:true})}catch(err){setError(err.message || 'Unable to sign in. Check your credentials and backend connection.')}finally{setBusy(false)}}; return <main className="auth-page"><Link className="auth-back" to="/"><ArrowRight className="back-arrow" size={16}/> Back to clinic</Link><form className="auth-card" onSubmit={submit}><div className="auth-mark"><img src="/clinic-logo.jpeg" alt="Al Shifa logo"/></div><span className="eyebrow">STAFF PORTAL</span><h1>Welcome back</h1><p>Sign in with your clinic account to manage appointment requests.</p>{error&&<Notice kind="error">{error}</Notice>}<Field label="Email address" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/><Field label="Password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/><Button className="button-primary auth-submit" disabled={busy}>{busy?<><Spinner/> Signing in…</>:'Sign in'}</Button></form></main> }
function Protected({children}) { const {user,loading}=useAuth(); const loc=useLocation(); if(loading) return <div className="center-state"><Spinner/> Checking your session…</div>; if(!user) return <Navigate to="/staff/login" state={{from:loc}} replace/>; return children }
function DashboardLayout() { const {user,logout}=useAuth(); return <div className="dashboard"><header className="dash-header"><Link to="/staff/appointments" className="brand"><img src="/clinic-logo.jpeg" alt=""/><span><strong>AL SHIFA</strong><small>STAFF PORTAL</small></span></Link><div className="dash-user"><span>{user?.name}<small>{user?.role}</small></span><button onClick={()=>logout()} className="button button-outline">Sign out</button></div></header><div className="dash-body"><aside className="dash-sidebar"><p>WORKSPACE</p><NavLink to="/staff/appointments"><CalendarDays size={17}/>Appointments</NavLink>{['ADMIN', 'DOCTOR'].includes(user?.role) && <NavLink to="/staff/users"><ShieldCheck size={17}/>Manage users</NavLink>}<div className="dash-identity"><ShieldCheck size={16}/><span>Signed in as<strong>{user?.role}</strong></span></div></aside><section className="dash-main"><Outlet/></section></div></div> }
function AppointmentsDashboard() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('ALL')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [loadedStatus, setLoadedStatus] = useState(null)
  const [refreshCount, setRefreshCount] = useState(0)
  const loading = loadedStatus !== status
  const canUpdate = ['ADMIN', 'DOCTOR'].includes(user?.role)

  useEffect(() => {
    let active = true
    const fetchAppointments = async () => {
      setError('')
      try {
        const data = status === 'ALL'
          ? await appointmentService.list()
          : await appointmentService.listByStatus(status)
        if (active) setItems(data)
      } catch (e) {
        if (active) setError(e.message || 'Unable to load appointments.')
      } finally {
        if (active) setLoadedStatus(status)
      }
    }
    fetchAppointments()
    return () => { active = false }
  }, [status, refreshCount])

  const changeStatus = async (id, next) => {
    setSaving(id)
    setError('')
    try {
      const updated = await appointmentService.updateStatus(id, next)
      setItems(old => status !== 'ALL'
        ? old.filter(item => item.id !== id || item.status === status)
        : old.map(item => item.id === id ? updated : item))
    } catch (e) {
      setError(e.message || 'Could not update appointment status.')
    } finally {
      setSaving(null)
    }
  }

  const softDelete = async id => {
    if (!window.confirm('Remove this appointment from the active list? It will be retained in the database.')) return
    setDeleting(id)
    setError('')
    try {
      await appointmentService.softDelete(id)
      setItems(old => old.filter(item => item.id !== id))
    } catch (e) {
      setError(e.message || 'Could not remove appointment.')
    } finally {
      setDeleting(null)
    }
  }

  const statuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED']
  return <>
    <div className="dash-title"><div><span className="eyebrow">STAFF WORKSPACE</span><h1>Appointments</h1><p>View appointment requests and follow up with patients.</p></div><button onClick={() => setRefreshCount(count => count + 1)} className="button button-outline"><Activity size={16}/> Refresh</button></div>
    {error && <Notice kind="error">{error}{error.toLowerCase().includes('cors') ? ' Check that the backend allows this frontend origin.' : ''}</Notice>}
    <div className="dash-filters"><label>Status <span className="select-wrap"><select value={status} onChange={e => setStatus(e.target.value)}><option value="ALL">All appointments</option>{statuses.map(s => <option key={s} value={s}>{titleCase(s)}</option>)}</select><ChevronDown size={15}/></span></label><span>{loading ? 'Loading…' : `${items.length} ${items.length === 1 ? 'appointment' : 'appointments'}`}</span></div>
    {loading ? <div className="center-state"><Spinner/> Loading appointments…</div> : items.length === 0 ? <div className="empty-state"><span className="value-icon"><CalendarDays/></span><h2>No appointments found</h2><p>{status === 'ALL' ? 'There are no appointment requests yet.' : 'No appointments currently have this status.'}</p></div> : <div className="appointment-list">{items.map(item => <article className="appointment-card" key={item.id}><div className="appointment-card-top"><div><span className="ref-id">REQUEST #{item.id}</span><h2>{item.patientName}</h2></div><StatusBadge status={item.status}/></div><div className="patient-details"><span><CalendarDays size={16}/>Appointment: {formatAppointmentDateTime(item.appointmentDate, item.appointmentTime)}</span><a href={`tel:${item.phone}`}><Activity size={16}/>{item.phone}</a></div>{item.reason && <p className="patient-reason">{item.reason}</p>}<div className="appointment-card-bottom"><small>Booked On: {formatIndianDateTime(item.createdAt)}</small><div className="appointment-actions">{canUpdate && <label className="status-control">Update status <span className="select-wrap"><select disabled={saving === item.id || deleting === item.id} value={item.status} onChange={e => changeStatus(item.id, e.target.value)}>{statuses.map(s => <option key={s} value={s}>{titleCase(s)}</option>)}</select><ChevronDown size={15}/></span>{saving === item.id && <Spinner/>}</label>}{canUpdate && <button type="button" className="appointment-delete" disabled={saving === item.id || deleting === item.id} onClick={() => softDelete(item.id)}><Trash2 size={14}/>{deleting === item.id ? 'Removing…' : 'Remove'}</button>}</div></div></article>)}</div>}
  </>
}
function titleCase(s='') { return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()) }
function NotFound() { return <main className="not-found"><span className="eyebrow">PAGE NOT FOUND</span><h1>Let’s get you back on track.</h1><p>This page may have moved or the link may be incorrect.</p><Link className="button button-primary" to="/">Back to home</Link></main> }
function App() { return <BrowserRouter><Routes><Route element={<PublicLayout/>}><Route index element={<Home/>}/><Route path="about" element={<About/>}/><Route path="services" element={<Services/>}/><Route path="contact" element={<Contact/>}/><Route path="appointment" element={<Appointment/>}/></Route><Route path="staff/login" element={<Login/>}/><Route path="staff" element={<Protected><DashboardLayout/></Protected>}><Route index element={<AppointmentsDashboard/>}/><Route path="appointments" element={<AppointmentsDashboard/>}/><Route path="users" element={<UserManagement/>}/></Route><Route path="*" element={<NotFound/>}/></Routes></BrowserRouter> }
export default App
