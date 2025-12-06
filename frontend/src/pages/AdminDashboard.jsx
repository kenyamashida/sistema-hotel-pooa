import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaTrash, FaSignOutAlt } from 'react-icons/fa'

export default function AdminDashboard({ user, onLogout }) {
  const [reservas, setReservas] = useState([])

  useEffect(() => { carregar() }, [])

  const carregar = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/reservas')
      setReservas(res.data)
    } catch (e) { }
  }

  const cancelar = async (id) => {
    if (!confirm("Tem certeza que deseja cancelar?")) return
    try {
      await axios.delete(`http://localhost:3000/admin/reservas/${id}`)
      toast.success("Reserva cancelada!")
      carregar()
    } catch (e) {
      toast.error("Erro ao cancelar")
    }
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  return (
    <div className="container">
      <div className="header-bar">
        <h2>Painel Admin</h2>
        <button onClick={onLogout} className="btn-cancel" style={{ background: '#dc3545', color: 'white' }}>
          <FaSignOutAlt /> Sair
        </button>
      </div>

      <h3>Gerenciar Reservas</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Quarto Reservado</th>
            <th>Data da Reserva</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map(r => (
            <tr key={r.id}>
              <td>#{r.id}</td>
              <td>{r.usuario}</td>
              <td>{r.quarto}</td>
              <td>{formatarData(r.data_reserva)}</td>
              <td>
                <button onClick={() => cancelar(r.id)} style={{ background: '#dc3545', color: 'white' }}>
                  <FaTrash /> Cancelar
                </button>
              </td>
            </tr>
          ))}
          {reservas.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>Nenhuma reserva encontrada.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
