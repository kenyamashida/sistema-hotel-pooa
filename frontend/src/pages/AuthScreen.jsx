import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'

export default function AuthScreen({ onLogin }) {
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
              <FaUser className="icon" />
              <input placeholder="Seu Nome" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
          )}

          <div className="input-group">
            <FaEnvelope className="icon" />
            <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="input-
            onChange={(e) => setDataSelecionada(e.target.value)}
            min={obterDataHoje()}
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              border: '2px solid #28a745',
              fontSize: '1rem',
              cursor: 'pointer',
              background: 'white',
              color: '#333'
            }}
          />
        </label>
        <p style={{
          marginTop: '10px',
          fontSize: '0.9rem',
          color: '#666'
        }}>group">
            <FaLock className="icon" />
            <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
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
