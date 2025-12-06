import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaBed, FaSignOutAlt, FaUser, FaCalendarAlt } from 'react-icons/fa'

export default function ClienteDashboard({ user, onLogout }) {
  const [quartos, setQuartos] = useState([])
  const [dataSelecionada, setDataSelecionada] = useState(obterAmanha())
  const navigate = useNavigate()

  function obterAmanha() {
    const amanha = new Date()
    amanha.setDate(amanha.getDate() + 1)
    return amanha.toISOString().split('T')[0]
  }

  useEffect(() => {
    carregarQuartos()
  }, [dataSelecionada])

  const carregarQuartos = () => {
    axios.get('http://localhost:3000/quartos', {
      params: { data: dataSelecionada }
    })
      .then(res => setQuartos(res.data))
      .catch(err => console.error(err))
  }

  const reservar = async (id) => {
    if (!confirm(`Deseja reservar este quarto para o dia ${new Date(dataSelecionada).toLocaleDateString('pt-BR')}?`)) return
    try {
      await axios.post('http://localhost:3000/reservar', { 
        usuario_id: user.id, 
        quarto_id: id,
        data_reserva: dataSelecionada
      })
      toast.success("Reserva realizada com sucesso!")
      carregarQuartos()
    } catch (e) {
      toast.error(e.response?.data?.error || "Erro ao reservar")
    }
  }

  return (
    <div className="container">
      <div className="header-bar">
        <h2>Olá, {user?.nome}</h2>
        <div className="header-buttons">
          <button onClick={() => navigate('/minhas-reservas')} className="btn-primary">
            <FaCalendarAlt /> Minhas Reservas
          </button>
          <button onClick={() => navigate('/perfil')} className="btn-primary">
            <FaUser /> Meu Perfil
          </button>
          <button onClick={onLogout} className="btn-cancel" style={{ background: '#dc3545', color: 'white' }}>
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </div>

      <div className="date-panel">
        <label className="date-panel-label">
          <FaCalendarAlt /> Selecione a data da reserva:
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            min={obterAmanha()}
            className="date-input"
          />
        </label>
        <p className="date-selected">
          Data selecionada: <strong>{(() => { const p=dataSelecionada.split('-'); return `${p[2]}/${p[1]}/${p[0]}` })()}</strong>
        </p>
      </div>

      <h3>Escolha seu Quarto</h3>
      <div className="grid-quartos">
        {quartos.map(q => (
          <div 
            key={q.id} 
            className={`card-quarto ${!q.disponivel ? 'indisponivel' : ''}`}
            onClick={() => !q.disponivel ? null : navigate(`/quarto/${q.id}`)}
            style={{ cursor: q.disponivel ? 'pointer' : 'not-allowed', opacity: q.disponivel ? 1 : 0.6 }}
          >

            {/* --- AQUI ESTÁ A MÁGICA DA IMAGEM --- */}
            {q.imagem ? (
              <img src={q.imagem} alt={q.nome} className="foto-quarto" />
            ) : (
              <div className="icon-bed"><FaBed /></div>
            )}
            {/* ----------------------------------- */}

            <div className="info-quarto">
              <h4>{q.nome}</h4>
              <p className="preco">R$ {q.preco}</p>
              <p className="descricao">{q.descricao}</p>

              {q.disponivel ? (
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    reservar(q.id)
                  }} 
                  className="btn-save"
                >
                  Reservar Agora
                </button>
              ) : (
                <div className="badge-ocupado">Indisponível para essa data</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
