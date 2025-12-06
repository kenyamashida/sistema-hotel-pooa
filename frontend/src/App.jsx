import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Vamos usar ícones simples ou texto caso a biblioteca falhe
import { FaUser, FaLock, FaEnvelope, FaBed, FaTrash, FaSignOutAlt } from 'react-icons/fa'
import './App.css'

// === TELA DE LOGIN / CADASTRO ===
function AuthScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isRegister) {
        await axios.post('http://localhost:3000/cadastro', { nome, email, senha })
        toast.success("Conta criada! Faça login.")
        setIsRegister(false)
      } else {
        const res = await axios.post('http://localhost:3000/login', { email, senha })
        if (res.data.auth) {
          onLogin(res.data.user)
          toast.success(`Bem-vindo, ${res.data.user.nome}!`)
          if (res.data.user.isAdmin) navigate('/admin')
          else navigate('/cliente')
        }
      }
    } catch (error) { 
        toast.error("Erro. Verifique seus dados.") 
    }
  }

  return (
    <div className="container auth-container">
      <h1>🏨 Hotel System</h1>
      <div className="form-group">
        <h3>{isRegister ? 'Nova Conta' : 'Acesso'}</h3>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="input-group">
                <FaUser className="icon"/>
                <input placeholder="Seu Nome" value={nome} onChange={e=>setNome(e.target.value)} required />
            </div>
          )}
          
          <div className="input-group">
            <FaEnvelope className="icon"/>
            <input type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <FaLock className="icon"/>
            <input type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} required />
          </div>

          <button type="submit" className="btn-save">
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        <button className="btn-cancel" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Já tenho conta? Login' : 'Criar conta nova'}
        </button>
      </div>
    </div>
  )
}

// ATUALIZE APENAS ESTE COMPONENTE:
function ClienteDashboard({ user, onLogout }) {
  const [quartos, setQuartos] = useState([])

  useEffect(() => { 
      carregarQuartos()
  }, [])

  const carregarQuartos = () => {
      axios.get('http://localhost:3000/quartos')
        .then(res => setQuartos(res.data))
        .catch(err => console.error(err))
  }

  const reservar = async (id) => {
    if(!confirm("Deseja reservar este quarto?")) return;
    try {
        await axios.post('http://localhost:3000/reservar', { usuario_id: user.id, quarto_id: id })
        toast.success("Reserva realizada com sucesso!")
        carregarQuartos()
    } catch (e) { toast.error("Erro ao reservar") }
  }

  return (
    <div className="container">
      <div className="header-bar">
        <h2>Olá, {user?.nome}</h2>
        <button onClick={onLogout} className="btn-cancel" style={{background:'#dc3545', color:'white'}}>
            <FaSignOutAlt/> Sair
        </button>
      </div>
      
      <h3>Escolha seu Quarto</h3>
      <div className="grid-quartos">
        {quartos.map(q => (
            <div key={q.id} className={`card-quarto ${!q.disponivel ? 'indisponivel' : ''}`}>
                
                {/* --- AQUI ESTÁ A MÁGICA DA IMAGEM --- */}
                {q.imagem ? (
                    <img src={q.imagem} alt={q.nome} className="foto-quarto" />
                ) : (
                    <div className="icon-bed"><FaBed/></div> // Fallback se não tiver foto
                )}
                {/* ----------------------------------- */}

                <div className="info-quarto">
                    <h4>{q.nome}</h4>
                    <p className="preco">R$ {q.preco}</p>
                    <p className="descricao">{q.descricao}</p>
                    
                    {q.disponivel ? (
                        <button onClick={() => reservar(q.id)} className="btn-save">
                            Reservar Agora
                        </button>
                    ) : (
                        <div className="badge-ocupado">Indisponível</div>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}

// === TELA DO ADMIN ===
function AdminDashboard({ user, onLogout }) {
  const [reservas, setReservas] = useState([])

  useEffect(() => { carregar() }, [])

  const carregar = async () => { 
      try { 
          const res = await axios.get('http://localhost:3000/admin/reservas'); 
          setReservas(res.data) 
      } catch(e){} 
  }

  const cancelar = async (id) => {
    if(!confirm("Tem certeza que deseja cancelar?")) return;
    try {
        await axios.delete(`http://localhost:3000/admin/reservas/${id}`)
        toast.success("Reserva cancelada!")
        carregar()
    } catch(e) { toast.error("Erro ao cancelar") }
  }

  return (
    <div className="container">
      <div className="header-bar">
        <h2>Painel Admin</h2>
        <button onClick={onLogout} className="btn-cancel" style={{background:'#dc3545', color:'white'}}>
            <FaSignOutAlt/> Sair
        </button>
      </div>

      <h3>Gerenciar Reservas</h3>
      <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Quarto Reservado</th>
                <th>Ação</th>
            </tr>
        </thead>
        <tbody>
            {reservas.map(r => (
                <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>{r.usuario}</td>
                    <td>{r.quarto}</td>
                    <td>
                        {/* Botão Vermelho corrigido */}
                        <button onClick={() => cancelar(r.id)} style={{background: '#dc3545', color: 'white'}}>
                            <FaTrash /> Cancelar
                        </button>
                    </td>
                </tr>
            ))}
            {reservas.length === 0 && (
                <tr><td colSpan="4" style={{textAlign:'center', color:'#888'}}>Nenhuma reserva encontrada.</td></tr>
            )}
        </tbody>
      </table>
    </div>
  )
}

// === ROTAS E PROTEÇÃO ===
function App() {
  const [user, setUser] = useState(() => {
    const salvo = localStorage.getItem('hotel_user')
    return salvo ? JSON.parse(salvo) : null
  })

  const handleLogin = (u) => { setUser(u); localStorage.setItem('hotel_user', JSON.stringify(u)) }
  
  const handleLogout = () => { 
      setUser(null); 
      localStorage.removeItem('hotel_user'); 
      window.location.href = '/' // Força recarregamento para limpar estados
  }

  const RotaPrivada = ({ children, adminOnly }) => {
    if (!user) return <Navigate to="/" />
    if (adminOnly && !user.isAdmin) return <Navigate to="/cliente" />
    return children
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthScreen onLogin={handleLogin}/>} />
        
        <Route path="/cliente" element={
            <RotaPrivada>
                <ClienteDashboard user={user} onLogout={handleLogout}/>
            </RotaPrivada>
        } />
        
        <Route path="/admin" element={
            <RotaPrivada adminOnly={true}>
                <AdminDashboard user={user} onLogout={handleLogout}/>
            </RotaPrivada>
        } />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </BrowserRouter>
  )
}

export default App