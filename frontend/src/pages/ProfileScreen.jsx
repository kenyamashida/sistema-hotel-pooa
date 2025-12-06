import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaUser, FaArrowLeft, FaEdit, FaCheck, FaSignOutAlt } from 'react-icons/fa'

export default function ProfileScreen({ user, onLogout }) {
  const [perfil, setPerfil] = useState(null)
  const [nomeEdit, setNomeEdit] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    carregarPerfil()
  }, [user])

  const carregarPerfil = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/perfil/${user.id}`)
      setPerfil(res.data)
      setNomeEdit(res.data.nome)
      setLoading(false)
    } catch (e) {
      toast.error("Erro ao carregar perfil")
      setLoading(false)
    }
  }

  const salvarPerfil = async () => {
    if (!nomeEdit.trim()) {
      toast.error("Nome não pode estar vazio")
      return
    }
    try {
      await axios.put(`http://localhost:3000/perfil/${user.id}`, { nome: nomeEdit })
      setPerfil({ ...perfil, nome: nomeEdit })
      setIsEditing(false)
      toast.success("Perfil atualizado com sucesso!")
    } catch (e) {
      toast.error("Erro ao atualizar perfil")
    }
  }

  if (loading) {
    return <div className="container"><h3>Carregando...</h3></div>
  }

  return (
    <div className="container profile-container">
      <div className="profile-header">
        <button onClick={() => navigate('/cliente')} className="btn-back">
          <FaArrowLeft /> Voltar
        </button>
        <h2>Meu Perfil</h2>
        <button onClick={onLogout} className="btn-cancel" style={{ background: '#dc3545', color: 'white' }}>
          <FaSignOutAlt /> Sair
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <FaUser />
        </div>

        <div className="profile-info">
          <div className="profile-field">
            <label>Nome</label>
            {isEditing ? (
              <div className="edit-row">
                <input
                  type="text"
                  value={nomeEdit}
                  onChange={e => setNomeEdit(e.target.value)}
                  className="input-edit"
                />
                <button onClick={salvarPerfil} className="btn-save">
                  <FaCheck /> Salvar
                </button>
                <button onClick={() => {
                  setIsEditing(false)
                  setNomeEdit(perfil.nome)
                }} className="btn-cancel">
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="display-row">
                <span className="value">{perfil?.nome}</span>
                <button onClick={() => setIsEditing(true)} className="btn-primary">
                  <FaEdit /> Editar
                </button>
              </div>
            )}
          </div>

          <div className="profile-field">
            <label>E-mail</label>
            <span className="value">{perfil?.email}</span>
          </div>

          <div className="profile-field">
            <label>Status</label>
            <span className="value badge">
              {perfil?.is_admin ? '👑 Administrador' : '👤 Cliente'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
