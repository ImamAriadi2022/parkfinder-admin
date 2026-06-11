import { Car, ChevronRight, Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { parkingService, slotService } from '../services/apiService'

export default function ParkingsPage() {
  const { user, isSuperAdmin, toast } = useApp()
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedArea, setSelectedArea] = useState(null)
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  // Modals
  const [showAddArea, setShowAddArea] = useState(false)
  const [showEditArea, setShowEditArea] = useState(null)
  const [showAddSlot, setShowAddSlot] = useState(false)
  const [showEditSlot, setShowEditSlot] = useState(null)

  // Forms
  const [areaForm, setAreaForm] = useState({ name: '', address: '', totalFloors: '', contactEmail: '', isActive: true })
  const [slotForm, setSlotForm] = useState({ floor: '', slotName: '', status: 'available' })
  const [editSlotForm, setEditSlotForm] = useState({ floor: '', slotName: '', status: 'available' })
  const [saving, setSaving] = useState(false)

  const generateSensorId = (area, floor, slotName) => {
    const areaToken = String(area?.id ?? area?.name ?? 'AREA')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 8)
      .toUpperCase() || 'AREA'
    const floorToken = String(floor || '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase() || 'F'
    const slotToken = String(slotName || '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase() || 'SLOT'
    return `SENSOR-${areaToken}-${floorToken}-${slotToken}`
  }

  const generatedSensorId = generateSensorId(selectedArea, slotForm.floor, slotForm.slotName)

  const assignedAreaId =
    user?.areaId ||
    user?.parkingId ||
    user?.assignedAreaId ||
    user?.adminAreaId ||
    user?.managedAreaId ||
    ''

  const isAssignedArea = (area) => {
    if (isSuperAdmin) return true
    const byId = assignedAreaId && String(area?.id) === String(assignedAreaId)
    const byName = user?.parkingName && area?.name === user?.parkingName
    return !!(byId || byName)
  }

  const fetchAreas = async () => {
    setLoading(true)
    try {
      const res = await parkingService.getAll()
      const data = res.data || res || []
      const mappedAreas = data.map(area => ({
        ...area,
        location: area.location || area.address || '',
        address: area.address || area.location || '',
        totalFloors: area.totalFloors ?? area.totalSlots ?? 0,
        contactEmail: area.contactEmail || '',
        isActive: area.isActive ?? true,
      }))

      const visibleAreas = isSuperAdmin ? mappedAreas : mappedAreas.filter(isAssignedArea)
      setAreas(visibleAreas)

      setSelectedArea((prev) => {
        if (!visibleAreas.length) return null
        if (!prev) return visibleAreas[0]
        return visibleAreas.find((area) => String(area.id) === String(prev.id)) || visibleAreas[0]
      })
    } catch (err) {
      console.error('Gagal fetch areas:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSlots = async (areaId) => {
    setLoadingSlots(true)
    try {
      const res = await slotService.getByArea(areaId)
      setSlots(res.data || res || [])
    } catch (err) {
      console.error('Gagal fetch slots:', err)
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(() => { fetchAreas() }, [isSuperAdmin, user?.areaId, user?.parkingId, user?.managedAreaId, user?.parkingName])

  useEffect(() => {
    if (selectedArea?.id) fetchSlots(selectedArea.id)
    else setSlots([])
  }, [selectedArea])

  // Area CRUD
  const handleAddArea = async (e) => {
    e.preventDefault()
    if (!isSuperAdmin) {
      toast.error('Hanya Super Admin yang dapat menambahkan area parkir.')
      return
    }
    if (!areaForm.name.trim()) {
      toast.warning('Nama area wajib diisi.')
      return
    }
    if (!areaForm.address.trim()) {
      toast.warning('Alamat wajib diisi.')
      return
    }
    if (!areaForm.totalFloors || Number(areaForm.totalFloors) < 1) {
      toast.warning('Jumlah lantai wajib diisi.')
      return
    }
    if (!areaForm.contactEmail.trim()) {
      toast.warning('Email kontak wajib diisi.')
      return
    }
    setSaving(true)
    try {
      await parkingService.create(
        areaForm.name.trim(),
        areaForm.address.trim(),
        parseInt(areaForm.totalFloors) || 0,
        areaForm.contactEmail.trim(),
        areaForm.isActive,
      )
      setShowAddArea(false)
      setAreaForm({ name: '', address: '', totalFloors: '', contactEmail: '', isActive: true })
      toast.success('Area parkir baru berhasil ditambahkan!')
      fetchAreas()
    } catch (err) { toast.error(err.message || 'Gagal menambahkan area parkir') }
    finally { setSaving(false) }
  }

  const handleEditArea = async (e) => {
    e.preventDefault()
    if (!isSuperAdmin) {
      toast.error('Hanya Super Admin yang dapat mengedit area parkir.')
      return
    }
    setSaving(true)
    try {
      await parkingService.update(showEditArea.id, areaForm.name, areaForm.address)
      setShowEditArea(null)
      setAreaForm({ name: '', address: '', totalFloors: '', contactEmail: '', isActive: true })
      toast.success('Informasi area parkir berhasil diperbarui!')
      fetchAreas()
      if (selectedArea?.id === showEditArea.id) {
        setSelectedArea(prev => ({
          ...prev,
          name: areaForm.name,
          location: areaForm.address,
          address: areaForm.address,
        }))
      }
    } catch (err) { toast.error(err.message || 'Gagal memperbarui area parkir') }
    finally { setSaving(false) }
  }

  const handleDeleteArea = async (areaId) => {
    if (!isSuperAdmin) {
      toast.error('Hanya Super Admin yang dapat menghapus area parkir.')
      return
    }
    if (!confirm('Yakin hapus area ini? Semua slot di dalamnya akan ikut terhapus.')) return
    try {
      await parkingService.delete(areaId)
      if (selectedArea?.id === areaId) { setSelectedArea(null); setSlots([]) }
      toast.success('Area parkir berhasil dihapus!')
      fetchAreas()
    } catch (err) { toast.error(err.message || 'Gagal menghapus area parkir') }
  }

  // Slot CRUD
  const handleAddSlot = async (e) => {
    e.preventDefault()
    if (!slotForm.floor) {
      toast.warning('Lantai (floor) wajib diisi.')
      return
    }
    if (!slotForm.slotName.trim()) {
      toast.warning('Nama slot wajib diisi.')
      return
    }
    setSaving(true)
    try {
      await slotService.add(selectedArea.id, Number(slotForm.floor), slotForm.slotName.trim(), generatedSensorId)
      setShowAddSlot(false)
      setSlotForm({ floor: '', slotName: '', status: 'available' })
      toast.success('Slot parkir baru berhasil ditambahkan!')
      fetchSlots(selectedArea.id)
      fetchAreas() // refresh count
    } catch (err) { toast.error(err.message || 'Gagal menambahkan slot') }
    finally { setSaving(false) }
  }

  const handleEditSlot = async (e) => {
    e.preventDefault()
    if (!editSlotForm.floor) {
      toast.warning('Lantai (floor) wajib diisi.')
      return
    }
    if (!editSlotForm.slotName.trim()) {
      toast.warning('Nama slot wajib diisi.')
      return
    }
    setSaving(true)
    try {
      await slotService.update(showEditSlot.id, {
        floor: Number(editSlotForm.floor),
        slotName: editSlotForm.slotName.trim(),
        appStatus: editSlotForm.status,
      })
      setShowEditSlot(null)
      setEditSlotForm({ floor: '', slotName: '', status: 'available' })
      toast.success('Slot parkir berhasil diperbarui!')
      fetchSlots(selectedArea.id)
      fetchAreas()
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui slot')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSlot = async (slotId) => {
    if (!confirm('Yakin hapus slot ini?')) return
    try {
      await slotService.delete(slotId)
      toast.success('Slot parkir berhasil dihapus!')
      fetchSlots(selectedArea.id)
      fetchAreas()
    } catch (err) { toast.error(err.message || 'Gagal menghapus slot') }
  }

  const handleUpdateSlotStatus = async (slot, newAppStatus) => {
    try {
      await slotService.update(slot.id, newAppStatus)
      toast.success('Status slot parkir berhasil diubah!')
      fetchSlots(selectedArea.id)
      fetchAreas()
    } catch (err) { toast.error(err.message || 'Gagal mengubah status slot') }
  }

  const getStatusBadge = (status) => {
    const map = {
      available: { cls: 'badge-green', label: 'Tersedia' },
      occupied: { cls: 'badge-orange', label: 'Terisi' },
      reserved: { cls: 'badge-blue', label: 'Dipesan' },
      maintenance: { cls: 'badge-gray', label: 'Maintenance' },
    }
    const s = map[status] || { cls: 'badge-gray', label: status || 'Unknown' }
    return <span className={`badge ${s.cls}`}>{s.label}</span>
  }

  return (
    <>
      <div className="animate-fade-up">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Gedung Parkir</h1>
          <p className="page-sub">{isSuperAdmin ? 'Kelola area parkir dan slot' : 'Lihat area tugas dan kelola slot parkir'}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={fetchAreas}><RefreshCw size={14} /> Refresh</button>
          {isSuperAdmin && (
            <button className="btn btn-primary" onClick={() => { setAreaForm({ name: '', address: '', totalFloors: '', contactEmail: '', isActive: true }); setShowAddArea(true) }}>
              <Plus size={14} /> Tambah Area
            </button>
          )}
        </div>
      </div>

      <div className="section-grid section-grid-1-2">
        {/* Area list */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Daftar Area</span>
            <span className="badge badge-accent">{areas.length}</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="empty-state"><div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>
            ) : areas.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🏗️</div><p>{isSuperAdmin ? 'Belum ada area parkir' : 'Area tugas belum tersedia'}</p></div>
            ) : (
              areas.map(area => (
                <div
                  key={area.id}
                  onClick={() => setSelectedArea(area)}
                  style={{
                    padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    borderBottom: '1px solid var(--border)', transition: 'background 0.15s',
                    background: selectedArea?.id === area.id ? 'var(--accent-glow)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (selectedArea?.id !== area.id) e.currentTarget.style.background = 'var(--bg-hover)' }}
                  onMouseLeave={e => { if (selectedArea?.id !== area.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                    <Car size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{area.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{area.address || area.location || '—'} · {area.totalFloors || area.totalSlots || 0} lantai</div>
                  </div>
                  {isSuperAdmin && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); setAreaForm({ name: area.name, address: area.address || area.location || '', totalFloors: String(area.totalFloors || area.totalSlots || ''), contactEmail: area.contactEmail || '', isActive: area.isActive ?? true }); setShowEditArea(area) }}>
                        <Pencil size={12} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDeleteArea(area.id) }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                  <ChevronRight size={14} style={{ color: 'var(--text3)' }} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Slot panel */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">
              {selectedArea ? `Slot — ${selectedArea.name}` : 'Pilih Area'}
            </span>
            {selectedArea && (
              <button className="btn btn-primary btn-sm" onClick={() => { setSlotForm({ floor: '', slotName: '' }); setShowAddSlot(true) }}>
                <Plus size={12} /> Tambah Slot
              </button>
            )}
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {!selectedArea ? (
              <div className="empty-state"><div className="empty-icon">👈</div><p>Pilih area di kiri untuk melihat slot</p></div>
            ) : loadingSlots ? (
              <div className="empty-state"><div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /></div>
            ) : slots.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📦</div><p>Belum ada slot di area ini</p></div>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Slot</th>
                      <th>Tipe</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.map(slot => (
                      <tr key={slot.id}>
                        <td style={{ fontWeight: 600, color: 'var(--text)' }}>{slot.slotNumber || slot.slotName || slot.id}</td>
                        <td>{slot.vehicleType || '—'}</td>
                        <td>{getStatusBadge(slot.status || slot.appStatus)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {(slot.status === 'available' || slot.appStatus === 'available') && (
                              <button className="btn btn-ghost btn-sm" onClick={() => handleUpdateSlotStatus(slot, 'maintenance')}>
                                Maintenance
                              </button>
                            )}
                            {(slot.status === 'maintenance' || slot.appStatus === 'maintenance') && (
                              <button className="btn btn-ghost btn-sm" onClick={() => handleUpdateSlotStatus(slot, 'available')}>
                                Aktifkan
                              </button>
                            )}
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => {
                                setEditSlotForm({
                                  floor: slot.floor || '',
                                  slotName: slot.slotNumber || slot.slotName || '',
                                  status: slot.status || slot.appStatus || 'available'
                                })
                                setShowEditSlot(slot)
                              }}
                            >
                              <Pencil size={12} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSlot(slot.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* ── Add Area Modal ── */}
      {showAddArea && (
        <Modal title="Tambah Area Parkir" onClose={() => setShowAddArea(false)}>
          <form onSubmit={handleAddArea}>
            <FormField label="Nama Area" value={areaForm.name} onChange={v => setAreaForm(f => ({ ...f, name: v }))} placeholder="Gedung A" required />
            <FormField label="Alamat" value={areaForm.address} onChange={v => setAreaForm(f => ({ ...f, address: v }))} placeholder="Jl. Contoh No. 1" required />
            <FormField label="Jumlah Lantai" value={areaForm.totalFloors} onChange={v => setAreaForm(f => ({ ...f, totalFloors: v }))} placeholder="3" type="number" required />
            <FormField label="Email Kontak" value={areaForm.contactEmail} onChange={v => setAreaForm(f => ({ ...f, contactEmail: v }))} placeholder="admin.area@parkfinder.id" type="email" required />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>Status Aktif</label>
              <select className="input" value={areaForm.isActive ? 'true' : 'false'} onChange={e => setAreaForm(f => ({ ...f, isActive: e.target.value === 'true' }))}>
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAddArea(false)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit Area Modal ── */}
      {showEditArea && (
        <Modal title="Edit Area Parkir" onClose={() => setShowEditArea(null)}>
          <form onSubmit={handleEditArea}>
            <FormField label="Nama Area" value={areaForm.name} onChange={v => setAreaForm(f => ({ ...f, name: v }))} required />
            <FormField label="Lokasi" value={areaForm.address} onChange={v => setAreaForm(f => ({ ...f, address: v }))} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowEditArea(null)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Add Slot Modal ── */}
      {showAddSlot && (
        <Modal title={`Tambah Slot — ${selectedArea?.name}`} onClose={() => setShowAddSlot(false)}>
          <form onSubmit={handleAddSlot}>
            <FormField label="Floor" value={slotForm.floor} onChange={v => setSlotForm(f => ({ ...f, floor: v }))} placeholder="1" type="number" required />
            <FormField label="Nama Slot" value={slotForm.slotName} onChange={v => setSlotForm(f => ({ ...f, slotName: v }))} placeholder="A-02" required />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>Sensor ID</label>
              <input className="input" value={generatedSensorId} readOnly />
              <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text3)' }}>
                Akan digenerate otomatis saat disimpan.
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>Status Awal</label>
              <select className="input" value={slotForm.status} onChange={e => setSlotForm(f => ({ ...f, status: e.target.value }))}>
                <option value="available">Tersedia</option>
                <option value="occupied">Terisi</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAddSlot(false)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit Slot Modal ── */}
      {showEditSlot && (
        <Modal title={`Edit Slot — ${selectedArea?.name}`} onClose={() => setShowEditSlot(null)}>
          <form onSubmit={handleEditSlot}>
            <FormField label="Floor" value={editSlotForm.floor} onChange={v => setEditSlotForm(f => ({ ...f, floor: v }))} placeholder="1" type="number" required />
            <FormField label="Nama Slot" value={editSlotForm.slotName} onChange={v => setEditSlotForm(f => ({ ...f, slotName: v }))} placeholder="A-02" required />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>Status</label>
              <select className="input" value={editSlotForm.status} onChange={e => setEditSlotForm(f => ({ ...f, status: e.target.value }))}>
                <option value="available">Tersedia</option>
                <option value="occupied">Terisi</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowEditSlot(null)}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  )
}

/* ── Reusable Components ─────────────────────────────────── */
function Modal({ title, children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      padding: '0 10px', overflowY: 'auto',
      background: 'rgba(0,0,0,0.6)'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative', width: '100%', maxWidth: 440,
        margin: '40px auto',
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16,
        padding: 24, animation: 'fadeUp 0.25s ease both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', display: 'flex' }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>{label}</label>
      <input className="input" type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} />
    </div>
  )
}