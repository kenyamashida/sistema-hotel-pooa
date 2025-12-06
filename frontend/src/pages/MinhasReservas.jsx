import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaTrash, FaCalendarAlt } from 'react-icons/fa'

export default function MinhasReservas({ user }) {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    carregarReservas()
  }, [])

  const carregarReservas = () => {
    setLoading(true)
    axios.get(`http://localhost:3000/minhas-reservas/${user.id}`)
      .then(res => {
        setReservas(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        toast.error("Erro ao carregar reservas")
        setLoading(false)
      })
  }

  const cancelarReserva = async (id) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return
    
    try {
      await axios.delete(`http://localhost:3000/reservas/${id}/${user.id}`)
      toast.success("Reserva cancelada com sucesso!")
      carregarReservas()
    } catch (e) {
      toast.error("Erro ao cancelar reserva")
      console.error(e)
    }
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const formatarDataHora = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container">
      <div className="header-bar">
        <h2>
          <FaCalendarAlt /> Minhas Reservas
        </h2>
        <button onClick={() => navigate('/cliente')} className="btn-back">
          <FaArrowLeft /> Voltar
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Carregando...</p>
      ) : reservas.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#999'
        }}>
          <p style={{ fontSize: '1.1rem' }}>Você ainda não tem reservas</p>
          <button 
            onClick={() => navigate('/cliente')}
            className="btn-primary"
            style={{ marginTop: '20px' }}
          >
            Explorar Quartos
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
          marginTop: '30px'
        }}>
          {reservas.map(reserva => (
            <div 
              key={reserva.id}
              style={{
                background: 'white',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#28a745'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e0e0e0'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div>
                <h3 style={{
                  margin: '0 0 10px 0',
                  color: '#2c3e50',
                  fontSize: '1.3rem'
                }}>
                  {reserva.nome}
                </h3>
                <p style={{
                  margin: '5px 0',
                  color: '#28a745',
                  fontWeight: 'bold',
                  fontSize: '1.4rem'
                }}>
                  R$ {reserva.preco}
                </p>
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '12px',
                borderRadius: '8px',
                borderLeft: '4px solid #17a2b8',
                fontSize: '0.9rem',
                color: '#666'
              }}>
                <strong>Data da reserva:</strong><br />
                {formatarData(reserva.data_reserva)}
              </div>

              <div style={{
                background: '#f8f9fa',
                padding: '12px',
                borderRadius: '8px',
                borderLeft: '4px solid #6c757d',
                fontSize: '0.85rem',
                color: '#888'
              }}>
                <strong>Reservado em:</strong><br />
                {formatarDataHora(reserva.created_at)}
              </div>

              <button 
                onClick={() => cancelarReserva(reserva.id)}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  marginTop: 'auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#c82333'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#dc3545'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <FaTrash /> Cancelar Reserva
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
