import { BrowserRouter, Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Activity, ArrowRight, ArrowUpRight, Baby, CalendarDays, ChevronDown, Clock3, Droplets, FlaskConical, HeartHandshake, HeartPulse, MapPin, Menu, MessageCircle, Phone, Shield, ShieldCheck, Sparkles, Stethoscope, Trash2, UsersRound, X } from 'lucide-react'
import { useAuth } from './auth/useAuth.js'
import { appointmentService } from './services/appointmentService.js'
import { ApiError } from './services/api.js'
import UserManagement from './pages/UserManagement.jsx'
import { Button, Field, Notice, Spinner, StatusBadge } from './components/ui.jsx'

const clinic = {
  name: 'Al Shifa Homeo Clinic',
  address: 'Azizul Complex, Kolasi, Katihar, Bihar',
  hours: '10:00 AM – 7:00 PM',
  whatsapp: (import.meta.env.VITE_CLINIC_WHATSAPP_NUMBER || '917547899822').replace(/\D/g, ''),
  doctors: [
    { name: 'Dr. Sharif', image: '/dr-sharif.jpeg', title: 'Homoeopathic Doctor', qualification: 'B.H.M.S. (BU)', registration: '33121', experience: '5+ Years Experience', languages: 'Hindi · English · Bengali · Urdu' },
    { name: 'Dr. Farha Nishat', image: '/dr-farha-nishat.jpeg', title: 'Medical Officer · Government of Bihar', qualification: 'B.H.M.S. (BU)', registration: '33105', experience: '5+ Years Experience', languages: 'Hindi · English · Bengali · Urdu', focus: 'Chronic disease and child specialist' },
  ],
}

const mapUrl = 'https://www.google.com/maps/place/Ajijul+Sho+Centre/@25.5784028,87.51263,20z/data=!4m10!1m2!2m1!1sazizul+complex+kolasi+katihar!3m6!1s0x39f001ae17d4fc71:0x2f02ff3f267ad115!8m2!3d25.5784028!4d87.5129539!15sCh1heml6dWwgY29tcGxleCBrb2xhc2kga2F0aWhhcpIBCnNob2Vfc3RvcmXgAQA!16s%2Fg%2F11vq__l63t?entry=ttu&g_ep=EgoyMDI2MTExNi4wIKXMDSoASAFQAw%3D%3D'
const mapEmbedUrl = 'https://maps.google.com/maps?output=embed&q=25.5784028,87.5129539&z=18'

function formatWhatsAppNumber() {
  const digits = clinic.whatsapp
  return digits.length === 12 && digits.startsWith('91')
    ? '+91 ' + digits.slice(2, 7) + ' ' + digits.slice(7)
    : '+' + digits
}
function formatIndianDateTime(value) {
  if (!value) return 'Not available'
  const timestamp = typeof value === 'string' && !/(Z|[+-]\d{2}:?\d{2})$/i.test(value) ? value + '+05:30' : value
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return 'Not available'
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(date)
}

function formatAppointmentDateTime(date, time) {
  if (!date) return 'Not available'
  return formatIndianDateTime(date + 'T' + (time || '10:00:00'))
}

function formatAppointmentDate(date) {
  if (!date) return 'Not available'
  const parsed = new Date(date + 'T12:00:00')
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(parsed)
}

function buildPatientWhatsAppUrl(appointment) {
  const phone = String(appointment.phone || '').replace(/\D/g, '')
  const internationalPhone = phone.length === 10 ? '91' + phone : phone
  const status = titleCase(appointment.status || 'PENDING')
  const message = [
    'Hello ' + (appointment.patientName || 'there') + ',',
    '',
    'This is Al Shifa Homeo Clinic with an update on your appointment request.',
    '',
    'Status: ' + status,
    'Appointment date: ' + formatAppointmentDate(appointment.appointmentDate),
    'Reference: ' + (appointment.id || 'Not available'),
    '',
    appointment.status === 'CONFIRMED'
      ? 'Your appointment is confirmed. Please contact us if you need any help.'
      : 'Please contact the clinic if you have any questions.',
    '',
    'Al Shifa Homeo Clinic',
  ].join('\n')
  return 'https://wa.me/' + internationalPhone + '?text=' + encodeURIComponent(message)
}

function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const links = [['/', 'Home'], ['/about', 'About'], ['/services', 'Treatments'], ['/clinic', 'Clinic'], ['/appointment', 'Appointment'], ['/reviews', 'Reviews'], ['/gallery', 'Gallery'], ['/faq', 'FAQ'], ['/contact', 'Contact']]
  return <>
    <div className="ref-topline"><span><MapPin size={14}/> Kolasi, Katihar</span><span><Clock3 size={14}/> {clinic.hours}</span></div>
    <header className="ref-header">
      <div className="ref-nav-wrap">
        <Link to="/" className="ref-brand" aria-label={clinic.name}>
          <img src="/clinic-logo.jpeg" alt=""/>
          <span><strong>AL SHIFA</strong><small>HOMEO CLINIC</small></span>
        </Link>
        <nav className={open ? 'ref-nav is-open' : 'ref-nav'} aria-label="Main navigation">
          {links.map(([to, label]) => <Link key={to} className={to === '/' && location.pathname === '/' ? 'active' : ''} to={to} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link className="ref-nav-book" to="/appointment" onClick={() => setOpen(false)}><CalendarDays size={16}/> Book appointment</Link>
          <Link className="ref-nav-whatsapp" to="/appointment?mode=whatsapp" onClick={() => setOpen(false)}><MessageCircle size={16}/> WhatsApp</Link>
        </nav>
        <button className="ref-menu" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>
    </header>
  </>
}

function Footer() {
  return <footer className="ref-footer">
    <div className="ref-footer-grid">
      <div className="ref-footer-about">
        <Link to="/" className="ref-brand ref-footer-brand"><img src="/clinic-logo.jpeg" alt=""/><span><strong>AL SHIFA</strong><small>HOMEO CLINIC</small></span></Link>
        <p>Thoughtful, respectful care for individuals and families at our Kolasi clinic.</p>
      </div>
      <div><h3>Explore</h3><Link to="/about">About the clinic</Link><Link to="/services">Treatments & services</Link><Link to="/clinic">Clinic location</Link><Link to="/appointment">Book an appointment</Link><Link to="/reviews">Patient reviews</Link><Link to="/gallery">Gallery</Link><Link to="/faq">FAQs</Link><Link to="/contact">Contact</Link></div>
      <div><h3>Visit our clinic</h3><p><MapPin size={16}/>{clinic.address}</p><p><Clock3 size={16}/>{clinic.hours}</p><p><MessageCircle size={16}/>{formatWhatsAppNumber()}</p><a href={mapUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={15}/></a></div>
    </div>
    <div className="ref-footer-bottom"><span>© {new Date().getFullYear()} Al Shifa Homeo Clinic</span><Link to="/staff/login">Staff access</Link></div>
  </footer>
}

function PublicLayout() {
  return <div className="ref-site"><Header/><Outlet/><Footer/><FloatingActions/></div>
}

function FloatingActions() {
  return <div className="ref-floating-actions" aria-label="Quick booking options"><Link to="/appointment?mode=whatsapp" aria-label="Book an appointment through WhatsApp" title="Book through WhatsApp"><MessageCircle size={20}/></Link><Link to="/appointment" aria-label="Book an appointment online" title="Book appointment online"><CalendarDays size={19}/></Link></div>
}

function AppointmentButtons({ compact = false }) {
  return <div className={compact ? 'ref-cta-buttons is-compact' : 'ref-cta-buttons'}>
    <Link className="ref-button ref-button-gold" to="/appointment"><CalendarDays size={17}/> Book appointment online <ArrowRight size={16}/></Link>
    <Link className="ref-button ref-button-whatsapp" to="/appointment?mode=whatsapp"><MessageCircle size={17}/> Book via WhatsApp <ArrowUpRight size={16}/></Link>
  </div>
}

function Home() {
  return <main>
    <section className="ref-hero">
      <div className="ref-hero-inner">
        <div className="ref-hero-copy">
          <span className="ref-kicker"><i/> WELCOME TO HOMOEOPATHIC CARE</span>
          <h1>Al Shifa <em>Homeo Clinic</em></h1>
          <p>Patient-focused homoeopathic care at our clinic in Kolasi, Katihar, with two doctors welcoming you for in-person visits.</p>
          <AppointmentButtons/>
          <div className="ref-hero-languages"><HeartHandshake size={17}/><span>Respectful, family-focused clinic visits</span></div>
        </div>
        <div className="ref-hero-portrait ref-hero-doctor-pair" aria-label="Meet the Al Shifa doctors">
          <div className="ref-portrait-backdrop"/>
          {clinic.doctors.map((doctor, index) => <figure className={'ref-hero-doctor ref-hero-doctor-' + index} key={doctor.name}>
            <img src={doctor.image} alt={doctor.name}/>
            <figcaption><small>{doctor.title}</small><strong>{doctor.name}</strong></figcaption>
          </figure>)}
          <div className="ref-portrait-caption"><span><small>ONE CLINIC · TWO DOCTORS</small><strong>Kolasi, Katihar</strong></span><MapPin size={18}/></div>
          <div className="ref-roundel"><img src="/clinic-logo.jpeg" alt=""/></div>
        </div>
      </div>
      <div className="ref-hero-bottom"><span><MapPin size={16}/>{clinic.address}</span><span><Clock3 size={16}/>{clinic.hours}</span><Link to="/contact">Plan your visit <ArrowRight size={15}/></Link></div>
    </section>

    <section className="ref-facts" aria-label="Clinic information">
      <div><strong>02</strong><span>DOCTORS</span></div><div><strong>01</strong><span>CLINIC LOCATION</span></div><div><strong>02</strong><span>WAYS TO BOOK</span></div><div><strong>10–7</strong><span>CLINIC HOURS</span></div>
    </section>

    <section className="ref-doctors ref-section" id="about">
      <div className="ref-container">
        <div className="ref-section-heading"><span className="ref-eyebrow">ABOUT THE DOCTORS</span><h2>Meet your Al Shifa doctors.</h2><p>Two homoeopathic doctors at one welcoming clinic in Kolasi, Katihar.</p></div>
        <div className="ref-about-doctor-grid">{clinic.doctors.map((doctor) => <article className="ref-about-doctor" key={doctor.name}>
          <div className="ref-about-doctor-image"><img src={doctor.image} alt={doctor.name}/></div>
          <span className="ref-eyebrow">AL SHIFA HOMEO CLINIC</span><h2>{doctor.name}</h2><p className="ref-about-doctor-role">{doctor.title}</p>
          <p>Welcoming patients for in-person appointments at our Kolasi clinic.</p>
          <div className="ref-credential-grid"><div><Stethoscope size={19}/><span>{doctor.qualification}</span></div><div><ShieldCheck size={19}/><span>Reg. No. {doctor.registration}</span></div><div><Activity size={19}/><span>{doctor.experience}</span></div><div><MessageCircle size={19}/><span>{doctor.languages}</span></div>{doctor.focus && <div className="ref-doctor-focus"><HeartHandshake size={19}/><span>{doctor.focus}</span></div>}{doctor.title.includes('Government') && <div><MapPin size={19}/><span>{doctor.title}</span></div>}</div>
        </article>)}</div>
        <Link className="ref-text-link ref-section-link" to="/about">About our clinic and doctors <ArrowRight size={16}/></Link>
      </div>
    </section>

    <section className="ref-location ref-section" id="chambers">
      <div className="ref-container ref-location-grid">
        <div className="ref-location-copy"><span className="ref-eyebrow">OUR CLINIC</span><h2>One welcoming place to visit.</h2><p>Find Al Shifa Homeo Clinic at Azizul Complex in Kolasi, Katihar. Send an appointment request to plan your visit.</p><AppointmentButtons compact/></div>
        <article className="ref-address-card"><iframe className="ref-contact-map" title="Map to Al Shifa Homeo Clinic, Kolasi" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><div className="ref-address-details"><span className="ref-eyebrow">VISIT OUR CLINIC</span><h3>{clinic.address}</h3><p><Clock3 size={16}/>{clinic.hours}</p><a href={mapUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16}/></a></div></article>
      </div>
    </section>

    <section className="ref-services ref-section" id="services">
      <div className="ref-container"><div className="ref-section-heading"><span className="ref-eyebrow">TREATMENTS & CLINIC SERVICES</span><h2>Care begins with an in-person visit.</h2><p>For specific treatment or condition questions, please contact the clinic directly. Our team can discuss your concern and appointment availability.</p></div>
        <div className="ref-service-grid">
          <article><span className="ref-service-number">01</span><HeartHandshake/><h3>In-clinic consultations</h3><p>Meet with one of the clinic’s doctors in person. The team can answer questions about arranging a visit.</p><Link to="/about">Meet the doctors <ArrowRight size={15}/></Link></article>
          <article><span className="ref-service-number">02</span><CalendarDays/><h3>Online appointment requests</h3><p>Send your preferred date and patient details through the website form. The request remains pending until clinic staff confirms it.</p><Link to="/appointment">Request an appointment <ArrowRight size={15}/></Link></article>
          <article><span className="ref-service-number">03</span><MessageCircle/><h3>WhatsApp booking</h3><p>Submit the same appointment request, then continue to WhatsApp with the details ready to send.</p><Link to="/appointment?mode=whatsapp">Book via WhatsApp <ArrowRight size={15}/></Link></article>
        </div>
      </div>
    </section>

    <section className="ref-feedback" id="reviews">
      <div className="ref-feedback-mark">“</div><span className="ref-eyebrow">PATIENT FEEDBACK</span><h2>Your experience matters to us.</h2><p>We don’t publish patient testimonials on this site yet. If you’ve visited Al Shifa, you can share feedback with the clinic.</p><a className="ref-text-link" href={mapUrl} target="_blank" rel="noreferrer">Find us on Google Maps <ArrowUpRight size={16}/></a>
    </section>

    <section className="ref-home-map ref-section"><div className="ref-container"><div className="ref-section-heading"><span className="ref-eyebrow">FIND OUR CLINIC</span><h2>One address, here in Kolasi.</h2><p>Visit Al Shifa Homeo Clinic at Azizul Complex, Kolasi, Katihar, Bihar.</p></div><a className="ref-map-link-card" href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={23}/><span><strong>{clinic.address}</strong><small>Open the location in Google Maps</small></span><ArrowUpRight size={18}/></a></div></section>
    <section className="ref-final-cta"><div className="ref-container"><span className="ref-eyebrow">YOUR VISIT TO AL SHIFA</span><h2>We look forward to welcoming you.</h2><p>Choose how you would like to request a clinic appointment.</p><AppointmentButtons/></div></section>
  </main>
}

function PageIntro({ eyebrow, title, copy, variant = '' }) {
  return <section className={'ref-page-intro ' + (variant ? 'ref-page-intro-' + variant : '')}><div className="ref-container"><div className="ref-breadcrumb"><Link to="/">Home</Link><span>›</span><span>{eyebrow}</span></div><span className="ref-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div></section>
}

function About() {
  return <main className="ref-inner-page">
    <PageIntro eyebrow="ABOUT THE DOCTORS" title="The doctors at Al Shifa." copy="Meet the two homoeopathic doctors at our Kolasi clinic."/>
    <section className="ref-section ref-about-doctors-section"><div className="ref-container"><div className="ref-about-doctor-grid">{clinic.doctors.map((doctor)=><article className="ref-about-doctor" key={doctor.name}><div className="ref-about-doctor-image"><img src={doctor.image} alt={doctor.name}/></div><span className="ref-eyebrow">ABOUT THE DOCTOR</span><h2>{doctor.name}</h2><p className="ref-about-doctor-role">{doctor.title}</p><p>Part of the Al Shifa Homeo Clinic team, welcoming patients for in-person appointments in Kolasi, Katihar.</p><div className="ref-credential-grid"><div><Stethoscope size={19}/><span>{doctor.qualification}</span></div><div><ShieldCheck size={19}/><span>Reg. No. {doctor.registration}</span></div><div><Activity size={19}/><span>{doctor.experience}</span></div><div><MessageCircle size={19}/><span>{doctor.languages}</span></div>{doctor.focus && <div className="ref-doctor-focus"><HeartHandshake size={19}/><span>{doctor.focus}</span></div>}{doctor.title.includes('Government') && <div><MapPin size={19}/><span>{doctor.title}</span></div>}</div></article>)}</div><div className="ref-about-cta"><span className="ref-eyebrow">ONE CLINIC · TWO DOCTORS</span><h2>A warm welcome, and time to be heard.</h2><p>Contact Al Shifa to ask about your concern and current appointment availability.</p><AppointmentButtons compact/></div></div></section>
  </main>
}

const offerings = [
  { icon: Sparkles, title: 'Skin Diseases', details: ['Psoriasis', 'Eczema', 'Acne', 'Fungal Infection', 'Hair Fall'] },
  { icon: Droplets, title: 'Kidney & Urinary Diseases', details: ['Kidney Stones', 'UTI', 'Frequent Urination', 'Urinary Problems'] },
  { icon: FlaskConical, title: 'Hormonal Diseases', details: ['PCOS', 'Hormonal Imbalance'] },
  { icon: UsersRound, title: 'Female Diseases', details: ['Menstrual Problems', 'White Discharge', 'PCOS Support', 'General Female Wellness'] },
  { icon: Baby, title: 'Pediatric Care', details: ['Childhood Allergies', 'Digestive Issues', 'Recurrent Infections'] },
  { icon: HeartPulse, title: 'Chronic Diseases', details: ['Arthritis', 'Migraine', 'Asthma', 'Allergy', 'Gastric Diseases', 'Joint Pain'] },
  { icon: Shield, title: 'Hemorrhoids (Piles)', details: ['Internal Piles', 'External Piles', 'Bleeding Piles', 'Pain Relief'] },
  { icon: Stethoscope, title: 'Fistula', details: ['Anal Fistula', 'Pain Management', 'Non-surgical Care', 'Long-term Relief'] },
]

function Services() {
  return <main className="ref-inner-page">
    <PageIntro eyebrow="TREATMENTS" title="Specialised homoeopathic treatments" copy="Speak with our clinic team about your concerns and the in-person appointments available at Al Shifa." variant="green"/>
    <section className="ref-section ref-treatment-section"><div className="ref-container"><div className="ref-treatment-grid">{offerings.map(({icon:Icon,title,details})=><article className="ref-treatment-card" key={title}><div className="ref-treatment-icon"><Icon size={19}/></div><span className="ref-treatment-pulse">⌁</span><h2>{title}</h2><ul>{details.map((detail)=><li key={detail}>{detail}</li>)}</ul><Link to="/appointment">Learn more <ArrowRight size={14}/></Link></article>)}</div><div className="ref-services-note"><ShieldCheck size={20}/><p><strong>In-person appointments only</strong><br/>The clinic does not offer remote, video, or online doctor consultations. The online form is for requesting an in-clinic appointment.</p></div><AppointmentButtons compact/></div></section>
  </main>
}

function ClinicPage() {
  return <main className="ref-inner-page">
    <PageIntro eyebrow="OUR CLINIC" title="Visit Al Shifa in Kolasi." copy="One clinic location for in-person appointments, with two doctors to welcome you."/>
    <section className="ref-section"><div className="ref-container ref-contact-grid"><div><span className="ref-eyebrow">ONE CLINIC LOCATION</span><h2>Plan your visit to Kolasi.</h2><p>Al Shifa Homeo Clinic is at {clinic.address}. Current clinic hours are {clinic.hours}. Appointment requests remain pending until clinic staff confirms the details.</p><AppointmentButtons compact/></div><article className="ref-address-card"><iframe className="ref-contact-map" title="Map to Al Shifa Homeo Clinic, Kolasi" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><div className="ref-address-details"><span className="ref-eyebrow">ADDRESS & HOURS</span><h3>{clinic.address}</h3><p><Clock3 size={16}/>{clinic.hours}</p><a href={mapUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={16}/></a></div></article></div></section>
  </main>
}

function ReviewsPage() {
  return <main className="ref-inner-page"><PageIntro eyebrow="PATIENT REVIEWS" title="Your experience matters." copy="We want every patient to feel welcome and heard at Al Shifa Homeo Clinic."/><section className="ref-section ref-review-page"><div className="ref-container"><div className="ref-review-card"><div className="ref-feedback-mark">“</div><span className="ref-eyebrow">PATIENT FEEDBACK</span><h2>Reviews will appear here when available.</h2><p>We don’t display testimonials or ratings until verified patient feedback is available. If you’ve visited the clinic, you can find Al Shifa on Google Maps and share your experience.</p><a className="ref-button ref-button-gold" href={mapUrl} target="_blank" rel="noreferrer">Find us on Google Maps <ArrowUpRight size={16}/></a></div></div></section></main>
}

function GalleryPage() {
  return <main className="ref-inner-page"><PageIntro eyebrow="GALLERY" title="Meet the Al Shifa team." copy="A look at the doctor photos and clinic identity currently provided for the website."/><section className="ref-section"><div className="ref-container"><div className="ref-gallery-grid">{clinic.doctors.map((doctor,index)=><figure className={'ref-gallery-item ref-gallery-item-' + index} key={doctor.name}><img src={doctor.image} alt={doctor.name}/><figcaption><small>AL SHIFA HOMEO CLINIC</small><strong>{doctor.name}</strong></figcaption></figure>)}<figure className="ref-gallery-item ref-gallery-logo"><div><img src="/clinic-logo.jpeg" alt="Al Shifa Homeo Clinic logo"/></div><figcaption><small>ONE CLINIC · KOLASI, KATIHAR</small><strong>Al Shifa Homeo Clinic</strong></figcaption></figure></div></div></section></main>
}

function FaqPage() {
  return <main className="ref-inner-page"><PageIntro eyebrow="FREQUENTLY ASKED QUESTIONS" title="Answers before your visit." copy="Details about appointment requests, clinic visits, and contacting Al Shifa Homeo Clinic."/><section className="ref-section ref-faq-section"><div className="ref-container"><div className="ref-faq-list"><details><summary>Does the clinic offer online consultations?<ChevronDown size={17}/></summary><p>No. Al Shifa Homeo Clinic provides in-person clinic appointments only.</p></details><details><summary>Is my appointment confirmed when I submit the form?<ChevronDown size={17}/></summary><p>No. Submitting the form sends an appointment request. It remains pending until clinic staff confirms it.</p></details><details><summary>Can I book through WhatsApp?<ChevronDown size={17}/></summary><p>Yes. Submit your appointment request first, then continue to WhatsApp to send the pre-filled message.</p></details><details><summary>Where is the clinic?<ChevronDown size={17}/></summary><p>Al Shifa Homeo Clinic is at {clinic.address}.</p></details><details><summary>What are the clinic hours?<ChevronDown size={17}/></summary><p>The current listed hours are {clinic.hours}. Please wait for staff confirmation of your requested appointment.</p></details><details><summary>Can I walk in without an appointment?<ChevronDown size={17}/></summary><p>Please contact the clinic to check availability before visiting.</p></details></div></div></section></main>
}

function Contact() {
  return <main className="ref-inner-page">
    <PageIntro eyebrow="CONTACT AL SHIFA" title="We’d be glad to welcome you." copy="Find our single clinic location in Kolasi, Katihar, or send an appointment request."/>
    <section className="ref-section"><div className="ref-container ref-contact-grid"><div><span className="ref-eyebrow">VISIT OUR CLINIC</span><h2>One clinic, here in Kolasi.</h2><p>We are located at Azizul Complex, Kolasi, Katihar, Bihar. Use the map link for directions or send an appointment request online or by WhatsApp.</p><AppointmentButtons compact/></div><article className="ref-address-card"><iframe className="ref-contact-map" title="Map to Al Shifa Homeo Clinic, Kolasi" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><div className="ref-address-details"><span className="ref-eyebrow">ADDRESS & HOURS</span><h3>{clinic.address}</h3><p><Clock3 size={16}/>{clinic.hours}</p><p><MessageCircle size={16}/>{formatWhatsAppNumber()} · WhatsApp booking</p><Link className="ref-contact-book" to="/appointment?mode=whatsapp">Request by WhatsApp <ArrowUpRight size={16}/></Link><a href={mapUrl} target="_blank" rel="noreferrer">Open in Google Maps <ArrowUpRight size={16}/></a></div></article></div></section>
  </main>
}

const initialForm = { patientName: '', phone: '', appointmentDate: '', reason: '' }

function localDateValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return year + '-' + month + '-' + day
}

function buildWhatsAppUrl(booking) {
  const message = [
    'Hello Al Shifa Homeo Clinic,',
    '',
    'I would like to request an appointment.',
    '',
    'Patient Name: ' + booking.patientName,
    'Phone: ' + booking.phone,
    'Appointment Date: ' + formatAppointmentDate(booking.appointmentDate),
    'Reason: ' + (booking.reason || 'Not provided'),
    '',
    'Appointment Reference: ' + (booking.id || 'Pending'),
    '',
    'Please confirm my appointment.',
    '',
    'Thank you.',
  ].join('\n')
  return 'https://wa.me/' + clinic.whatsapp + '?text=' + encodeURIComponent(message)
}

function Appointment() {
  const location = useLocation()
  const navigate = useNavigate()
  const mode = new URLSearchParams(location.search).get('mode') === 'whatsapp' ? 'whatsapp' : 'online'
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)


  const update = event => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }))
    setErrors(current => ({ ...current, [event.target.name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.patientName.trim()) next.patientName = 'Please enter your name.'
    else if (form.patientName.trim().length > 100) next.patientName = 'Name must be 100 characters or fewer.'
    if (!/^[0-9]{10,15}$/.test(form.phone)) next.phone = 'Enter 10 to 15 digits, without spaces.'
    if (!form.appointmentDate) next.appointmentDate = 'Choose a date.'
    else if (form.appointmentDate < localDateValue()) next.appointmentDate = 'Date cannot be in the past.'
    if (form.reason.length > 2000) next.reason = 'Keep your note under 2,000 characters.'
    return next
  }

  const submit = async event => {
    event.preventDefault()
    if (busy) return
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return

    // Open a blank tab during the click gesture so the browser allows us to
    // navigate to WhatsApp after the appointment API confirms it was saved.
    const whatsappWindow = mode === 'whatsapp' ? window.open('about:blank', '_blank') : null
    setBusy(true)
    setResult(null)
    try {
      // The existing API requires appointmentTime; the form intentionally asks
      // patients for a date only, so use the clinic's listed opening time.
      const appointmentTime = '10:00:00'
      const patientName = form.patientName.trim()
      const reason = form.reason.trim()
      const data = await appointmentService.create({
        patientName,
        phone: form.phone,
        appointmentDate: form.appointmentDate,
        appointmentTime,
        reason: reason || null,
      })
      const booking = { patientName, phone: form.phone, appointmentDate: form.appointmentDate, appointmentTime, reason, id: data?.id ?? null }
      let whatsappOpened = false
      if (mode === 'whatsapp' && whatsappWindow && !whatsappWindow.closed) {
        try {
          whatsappWindow.location.href = buildWhatsAppUrl(booking)
          whatsappWindow.opener = null
          whatsappOpened = true
        } catch {
          whatsappWindow.close()
        }
      }
      setResult({
        success: true,
        mode,
        whatsappOpened,
        booking,
        bookedOn: data?.createdAt ?? null,
        message: 'Your request was received' + (data?.id ? ' (reference #' + data.id + ')' : '') + '. It remains pending until clinic staff confirms it.' + (mode === 'whatsapp' ? whatsappOpened ? ' WhatsApp is opening in a new tab.' : ' Your browser blocked the new tab; use the button below to continue.' : ''),
      })
      setForm(initialForm)
      setErrors({})
    } catch (error) {
      if (whatsappWindow && !whatsappWindow.closed) whatsappWindow.close()
      setResult({ success: false, message: error instanceof ApiError ? error.message : 'We could not send your request. Check your connection and try again.' })
    } finally {
      setBusy(false)
    }
  }

  return <main className="ref-inner-page ref-appointment-page">
    <PageIntro eyebrow="YOUR VISIT" title="Let’s plan your clinic visit." copy="Choose how you would like to send your appointment request. All requests stay pending until confirmed by clinic staff."/>
    <section className="ref-section ref-appointment-area">
      <div className="ref-container ref-appointment-layout">
        <aside className="ref-appointment-aside"><span className="ref-eyebrow">BOOK A VISIT</span><h2>A few details to get started.</h2><p>Your appointment will be requested at our Kolasi clinic. Choose a date that works for you.</p><div><MapPin size={18}/><span><strong>Al Shifa Homeo Clinic</strong><small>{clinic.address}</small></span></div><div><Clock3 size={18}/><span><strong>Clinic hours</strong><small>{clinic.hours}</small></span></div></aside>
        <form className="ref-form-card" onSubmit={submit} noValidate>
          <span className="ref-eyebrow">APPOINTMENT REQUEST</span><h2>Choose a booking option</h2><p className="ref-form-intro">Your appointment is not confirmed until clinic staff reviews your request.</p>
          <div className="ref-booking-options" role="group" aria-label="Appointment booking method">
            <button type="button" className={mode === 'online' ? 'ref-booking-option is-active' : 'ref-booking-option'} aria-pressed={mode === 'online'} onClick={() => navigate('/appointment', { replace: true })}><CalendarDays size={18}/><span><strong>Book online</strong><small>Send a request to the clinic</small></span></button>
            <button type="button" className={mode === 'whatsapp' ? 'ref-booking-option is-active' : 'ref-booking-option'} aria-pressed={mode === 'whatsapp'} onClick={() => navigate('/appointment?mode=whatsapp', { replace: true })}><MessageCircle size={18}/><span><strong>Continue on WhatsApp</strong><small>Save your request, then message us</small></span></button>
          </div>
          {result && <Notice kind={result.success ? 'success' : 'error'}>{result.message}{result.success && <><small className="booking-created-at">Booked On: {formatIndianDateTime(result.bookedOn)}</small>{result.mode === 'whatsapp' && !result.whatsappOpened && <a className="ref-continue-whatsapp" href={buildWhatsAppUrl(result.booking)} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Continue to WhatsApp <ArrowUpRight size={16}/></a>}</>}</Notice>}
          <div className="ref-form-grid">
            <Field label="Patient name *" name="patientName" autoComplete="name" maxLength={100} value={form.patientName} onChange={update} error={errors.patientName} placeholder="Your full name"/>
            <Field label="Phone number *" name="phone" type="tel" autoComplete="tel" inputMode="numeric" maxLength={15} value={form.phone} onChange={event => { if (/^\d{0,15}$/.test(event.target.value)) update(event) }} error={errors.phone} placeholder="10–15 digits"/>
            <Field label="Preferred date *" name="appointmentDate" type="date" min={localDateValue()} value={form.appointmentDate} onChange={update} error={errors.appointmentDate}/>
            <label className="field ref-reason-field"><span>Reason for visit <small>(optional)</small></span><textarea name="reason" value={form.reason} maxLength={2000} onChange={update} rows="4" placeholder="Anything you would like the clinic to know?"/><small className="field-hint">{form.reason.length}/2000 characters</small>{errors.reason && <em>{errors.reason}</em>}</label>
          </div>
          <Button className="ref-submit-button" disabled={busy}>{busy ? <><Spinner/> Saving appointment request…</> : mode === 'whatsapp' ? <><MessageCircle size={17}/> Save request and continue <ArrowRight size={17}/></> : <>Send appointment request <ArrowRight size={17}/></>}</Button>
          <p className="ref-privacy-note">{mode === 'whatsapp' ? 'We first save your request in the clinic system. After it succeeds, you can continue to WhatsApp. Your status remains pending.' : 'Your request starts as pending. Clinic staff will confirm it with you.'}</p>
        </form>
      </div>
    </section>
  </main>
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
    {loading ? <div className="center-state"><Spinner/> Loading appointments…</div> : items.length === 0 ? <div className="empty-state"><span className="value-icon"><CalendarDays/></span><h2>No appointments found</h2><p>{status === 'ALL' ? 'There are no appointment requests yet.' : 'No appointments currently have this status.'}</p></div> : <div className="appointment-list">{items.map(item => <article className="appointment-card" key={item.id}><div className="appointment-card-top"><div><span className="ref-id">REQUEST #{item.id}</span><h2>{item.patientName}</h2></div><StatusBadge status={item.status}/></div><div className="patient-details"><span><CalendarDays size={16}/>Appointment: {formatAppointmentDateTime(item.appointmentDate, item.appointmentTime)}</span><a href={`tel:${item.phone}`}><Activity size={16}/>{item.phone}</a></div>{item.reason && <p className="patient-reason">{item.reason}</p>}<div className="appointment-card-bottom"><small>Booked On: {formatIndianDateTime(item.createdAt)}</small><div className="appointment-actions">{canUpdate && <label className="status-control">Update status <span className="select-wrap"><select disabled={saving === item.id || deleting === item.id} value={item.status} onChange={e => changeStatus(item.id, e.target.value)}>{statuses.map(s => <option key={s} value={s}>{titleCase(s)}</option>)}</select><ChevronDown size={15}/></span>{saving === item.id && <Spinner/>}</label>}<a className="appointment-call" href={`tel:${String(item.phone || '').replace(/[^\d+]/g, '')}`} aria-label={`Call ${item.patientName}`}><Phone size={14}/> Call patient</a><a className="appointment-whatsapp" href={buildPatientWhatsAppUrl(item)} target="_blank" rel="noreferrer" aria-label={`Prepare WhatsApp status message for ${item.patientName}`}><MessageCircle size={14}/> Message on WhatsApp</a>{canUpdate && <button type="button" className="appointment-delete" disabled={saving === item.id || deleting === item.id} onClick={() => softDelete(item.id)}><Trash2 size={14}/>{deleting === item.id ? 'Removing…' : 'Remove'}</button>}</div></div></article>)}</div>}
  </>
}
function titleCase(s='') { return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()) }
function NotFound() { return <main className="not-found"><span className="eyebrow">PAGE NOT FOUND</span><h1>Let’s get you back on track.</h1><p>This page may have moved or the link may be incorrect.</p><Link className="button button-primary" to="/">Back to home</Link></main> }
function App() { return <BrowserRouter><Routes><Route element={<PublicLayout/>}><Route index element={<Home/>}/><Route path="about" element={<About/>}/><Route path="services" element={<Services/>}/><Route path="clinic" element={<ClinicPage/>}/><Route path="reviews" element={<ReviewsPage/>}/><Route path="gallery" element={<GalleryPage/>}/><Route path="faq" element={<FaqPage/>}/><Route path="contact" element={<Contact/>}/><Route path="appointment" element={<Appointment/>}/></Route><Route path="staff/login" element={<Login/>}/><Route path="staff" element={<Protected><DashboardLayout/></Protected>}><Route index element={<AppointmentsDashboard/>}/><Route path="appointments" element={<AppointmentsDashboard/>}/><Route path="users" element={<UserManagement/>}/></Route><Route path="*" element={<NotFound/>}/></Routes></BrowserRouter> }
export default App
