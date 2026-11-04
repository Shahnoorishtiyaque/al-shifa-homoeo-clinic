import { LoaderCircle } from 'lucide-react'

export function Button({ children, className = '', ...props }) { return <button className={`button ${className}`} {...props}>{children}</button> }
export function Spinner() { return <LoaderCircle className="spinner" size={18} aria-label="Loading"/> }
export function Notice({ kind = 'error', children }) { return <div className={`notice notice-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>{children}</div> }
export function Field({ label, error, ...props }) { return <label className="field"><span>{label}</span><input {...props} aria-invalid={Boolean(error)} />{error&&<em>{error}</em>}</label> }
export function StatusBadge({ status }) { return <span className={`status-badge status-${String(status).toLowerCase()}`}><i/>{String(status).toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}</span> }
