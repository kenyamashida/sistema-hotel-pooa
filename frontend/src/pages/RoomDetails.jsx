import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaBed, FaArrowLeft, FaCheck, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa'

function obterAmanha() {
  const amanha = new Date()
  amanha.setDate(amanha.getDate() + 1)
  return amanha.toISOString().split('T')[0]
}

export default function RoomDetails({ user, onLogout }) {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [quarto, setQuarto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dataSelecionada, setDataSelecionada] = useState(obterAmanha())
  const [disponivel, setDisponivel] = useState(true)

  const [comodidades, setComodidades] = useState([])

  useEffect(() => {
    carregarQuarto()
  }, [roomId, dataSelecionada])

  const carregarQuarto = async () => {
    try {
      const res = await axios.get('http://localhost:3000/quartos', {
        params: { data: dataSelecionada }
      })
      const room = res.data.find(q => q.id === parseInt(roomId))
      if (room) {
        setQuarto(room)
        setDisponivel(room.disponivel)
        // carregar comodidades do quarto
        carregarComodidades(room.id)
      } else {
        toast.error("Quarto não encontrado")
        navigate('/cliente')
      }
      setLoading(false)
    } catch (e) {
      toast.error("Erro ao carregar detalhes")
      setLoading(false)
    }
  }

  const reservar = async () => {
    if (!confirm(`Deseja reservar este quarto para o dia ${formatDateFromISO(dataSelecionada)}?`)) return
    try {
      await axios.post('http://localhost:3000/reservar', { 
        usuario_id: user.id, 
        quarto_id: quarto.id,
        data_reserva: dataSelecionada
      })
      toast.success("Reserva realizada com sucesso!")
      navigate('/minhas-reservas')
    } catch (e) {
      toast.error(e.response?.data?.error || "Erro ao reservar")
    }
  }

  const carregarComodidades = async (quartoId) => {
    try {
      const res = await axios.get(`http://localhost:3000/quartos/${quartoId}/comodidades`)
      setComodidades(res.data || [])
    } catch (e) {
      console.error("Erro ao carregar comodidades:", e)
      setComodidades([])
    }
  }

  // Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY sem criar Date (evita problemas de fuso)
  function formatDateFromISO(iso) {
    if (!iso || typeof iso !== 'string') return iso
    const parts = iso.split('-')
    if (parts.length !== 3) return iso
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  if (loading) {
    return <div className="container"><h3>Carregando...</h3></div>
  }

  if (!quarto) {
    return <div className="container"><h3>Quarto não encontrado</h3></div>
  }

  return (
    <div className="container room-details-container">
      <div className="room-header">
        <button onClick={() => navigate('/cliente')} className="btn-back">
          <FaArrowLeft /> Voltar
        </button>
        <h2>Detalhes do Quarto</h2>
      </div>

      <div className="date-panel">
        <label className="date-panel-label">
          <FaCalendarAlt /> Data da reserva:
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            min={obterAmanha()}
            className="date-input"
          />
        </label>
      </div>

      <div className="room-card">
        <div className="room-image-section">
          {quarto.imagem ? (
            <img src={quarto.imagem} alt={quarto.nome} className="room-image-large" />
          ) : (
            <div className="room-image-placeholder">
              <FaBed />
            </div>
          )}
        </div>

        <div className="room-info-section">
          <div className="room-title-bar">
            <div>
              <h1>{quarto.nome}</h1>
              <div className="room-status">
                {disponivel ? (
                  <span className="badge-disponivel">✓ Disponível para essa data</span>
                ) : (
                  <span className="badge-indisponivel">✗ Indisponível para essa data</span>
                )}
              </div>
            </div>
            <div className="room-price-section">
              <p className="room-price">R$ {quarto.preco}</p>
              <p className="room-price-label">por noite</p>
            </div>
          </div>

          <div className="room-description-section">
            <h3>Descrição</h3>
            <p className="room-description">{quarto.descricao}</p>
          </div>

          <div className="room-details-grid">
            <div className="detail-item">
              <label>Tipo de Quarto</label>
              <span>{quarto.nome}</span>
            </div>
            <div className="detail-item">
              <label>Data Selecionada</label>
              <span>{formatDateFromISO(dataSelecionada)}</span>
            </div>
          </div>

          <div className="room-amenities">
            <h3>Comodidades</h3>
              <ul className="amenities-list">
                {comodidades.length > 0 ? (
                  comodidades.map(com => (
                    <li key={com.id}>{com.icone ? `${com.icone} ` : ''}{com.nome}</li>
                  ))
                ) : (
                  <li>Nenhuma comodidade cadastrada</li>
                )}
              </ul>
          </div>

          <div className="room-actions">
            {disponivel ? (
              <button onClick={reservar} className="btn-reserve">
                <FaCheck /> Reservar Agora
              </button>
            ) : (
              <button disabled className="btn-reserve-disabled">
                Indisponível nessa data
              </button>
            )}
            <button onClick={() => navigate('/cliente')} className="btn-continue">
              Continuar Navegando
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
