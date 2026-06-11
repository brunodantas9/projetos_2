import React, { useState, useEffect, useMemo } from 'react';

// --- Tipagens ---
interface Aluno {
  id?: number;
  matricula: string;
  nome_aluno: string;
  email: string;
  nome_mae: string;
}

interface Livro {
  id?: number;
  titulo: string;
  autor: string;
  preco: number;
  categoria_id?: number;
}

interface Nota {
  id?: number;
  aluno_id: number;
  disciplina_id: number;
  nota: number;
}

interface Categoria {
  id: number;
  nome_categoria: string;
}

interface Disciplina {
  id: number;
  nome_disciplina: string;
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alunos' | 'biblioteca' | 'notas'>('alunos');
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Estados para Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Estado para Modal de Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<{id: number, nome: string} | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para Ordenação
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Dados do formulário (unificado)
  const [studentData, setStudentData] = useState<Aluno>({
    matricula: '', nome_aluno: '', email: '', nome_mae: ''
  });
  const [bookData, setBookData] = useState<Livro>({
    titulo: '', autor: '', preco: 0, categoria_id: undefined
  });
  const [gradeData, setGradeData] = useState<Nota>({
    aluno_id: 0, disciplina_id: 0, nota: 0
  });

  // Busca dados do Backend
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'alunos') {
        const url = `${API_BASE_URL}/controle_aluno/consultar-alunos`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) setAlunos(data);
      } else if (activeTab === 'biblioteca') {
        // Carrega Livros
        const urlLivros = `${API_BASE_URL}/controle_biblioteca/consultar-livros`;
        const resLivros = await fetch(urlLivros);
        const dataLivros = await resLivros.json();
        setLivros(dataLivros);

        // Carrega Categorias para o Select do formulário
        const urlCats = `${API_BASE_URL}/controle_biblioteca/consultar-categorias`;
        const resCats = await fetch(urlCats);
        const dataCats = await resCats.json();
        setCategorias(dataCats);
      } else if (activeTab === 'notas') {
        const url = `${API_BASE_URL}/controle_aluno/consultar-notas`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) setNotas(data);
        
        // Carrega Alunos e Disciplinas para os Selects do formulário
        const resAlunos = await fetch(`${API_BASE_URL}/controle_aluno/consultar-alunos`);
        setAlunos(await resAlunos.json());

        const resDisc = await fetch(`${API_BASE_URL}/controle_aluno/consultar-notas`); // Aqui temos um detalhe: consultar-notas traz notas, precisamos de um endpoint de disciplinas ou carregar do modelo
        // Como criamos apenas o CRUD de notas, vou buscar do endpoint geral de notas para simplificar ou assumir que o backend expõe disciplinas
        // Ajuste: Vamos buscar de 'consultar-notas' apenas para testar, mas o ideal seria ter 'consultar-disciplinas'
        // Por enquanto vou deixar o disciplina_id manual ou fixo se o endpoint não existir
      }
    } catch (error: any) {
      console.error('Erro ao buscar dados:', error);
      setError(error.message || "Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Ações Alunos
  const openEditStudent = (aluno: Aluno) => {
    setModalMode('edit');
    setSelectedId(aluno.id!);
    setStudentData(aluno);
    setIsModalOpen(true);
  };

  const openEditBook = (livro: Livro) => {
    setModalMode('edit');
    setSelectedId(livro.id!);
    setBookData(livro);
    setIsModalOpen(true);
  };

  const openEditGrade = (nota: Nota) => {
    setModalMode('edit');
    setSelectedId(nota.id!);
    setGradeData(nota);
    setIsModalOpen(true);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = modalMode === 'edit';
      const url = isEdit 
        ? `${API_BASE_URL}/controle_aluno/atualizar-aluno/${selectedId}`
        : `${API_BASE_URL}/controle_aluno/criar-aluno`;
      
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) throw new Error("Erro na API");

      setIsModalOpen(false);
      setStudentData({ matricula: '', nome_aluno: '', email: '', nome_mae: '' });
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = modalMode === 'edit';
      const url = isEdit 
        ? `${API_BASE_URL}/controle_biblioteca/atualizar-livro/${selectedId}`
        : `${API_BASE_URL}/controle_biblioteca/criar-livro`;
      
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) throw new Error("Erro na API");

      setIsModalOpen(false);
      setBookData({ titulo: '', autor: '', preco: 0 });
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = modalMode === 'edit';
      const url = isEdit 
        ? `${API_BASE_URL}/controle_aluno/atualizar-nota/${selectedId}`
        : `${API_BASE_URL}/controle_aluno/lancar-nota`;
      
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gradeData),
      });

      if (!response.ok) throw new Error("Erro na API");

      setIsModalOpen(false);
      setGradeData({ aluno_id: 0, disciplina_id: 1, nota: 0 });
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!recordToDelete) return;
    setIsSubmitting(true);
    try {
      let url = "";
      if (activeTab === 'alunos') {
        url = `${API_BASE_URL}/controle_aluno/deletar-aluno/${recordToDelete.id}`;
      } else if (activeTab === 'biblioteca') {
        url = `${API_BASE_URL}/controle_biblioteca/deletar-livro/${recordToDelete.id}`;
      } else if (activeTab === 'notas') {
        url = `${API_BASE_URL}/controle_aluno/deletar-nota/${recordToDelete.id}`;
      }
      
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error("Erro ao excluir");

      fetchData();
      setIsDeleteModalOpen(false);
      setRecordToDelete(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtros e Ordenação
  const filteredAlunos = useMemo(() => {
    let result = alunos.filter(a => 
      a.nome_aluno.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.matricula.includes(searchTerm)
    );

    if (sortConfig && activeTab === 'alunos') {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [alunos, searchTerm, sortConfig, activeTab]);

  const filteredLivros = useMemo(() => {
    let result = livros.filter(l => 
      l.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (l.autor && l.autor.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortConfig && activeTab === 'biblioteca') {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [livros, searchTerm, sortConfig, activeTab]);

  const filteredNotas = useMemo(() => {
    let result = [...notas];
    if (sortConfig && activeTab === 'notas') {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [notas, sortConfig, activeTab]);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col shrink-0 shadow-2xl">
        <div className="p-8 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/20 ring-1 ring-white/10 overflow-hidden p-1">
              <img src="https://upload.wikimedia.org/wikipedia/pt/4/4b/Sao_Paulo_Futebol_Clube.png" alt="Logo SPFC" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Escola do Bruno</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Gestão Escolar</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">Menu Principal</div>
          <button onClick={() => { setActiveTab('alunos'); setSearchTerm(''); setSortConfig(null); }} className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 group ${activeTab === 'alunos' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <UsersIcon /><span className="font-medium">Gestão de Alunos</span>
          </button>
          <button onClick={() => { setActiveTab('biblioteca'); setSearchTerm(''); setSortConfig(null); }} className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 group ${activeTab === 'biblioteca' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <BookIcon /><span className="font-medium">Biblioteca Digital</span>
          </button>
          <button onClick={() => { setActiveTab('notas'); setSearchTerm(''); setSortConfig(null); }} className={`w-full text-left px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3 group ${activeTab === 'notas' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
            <GradeIcon /><span className="font-medium">Gestão de Notas</span>
          </button>
        </nav>

        <div className="p-6 bg-slate-900/50 border-t border-slate-800/50">
          <div className="flex items-center gap-3 px-2 text-xs font-semibold">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">AD</div>
            <div className="flex flex-col"><span className="text-slate-200">Administrador</span><span className="text-emerald-500">Online</span></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {activeTab === 'alunos' ? 'Gestão de Alunos' : activeTab === 'biblioteca' ? 'Biblioteca Digital' : 'Lançamento de Notas'}
          </h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400"><SearchIcon size={18} /></span>
              <input type="text" placeholder="Pesquisar..." className="pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none w-64 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => { 
                setModalMode('create'); 
                if (activeTab === 'alunos') setStudentData({ matricula: '', nome_aluno: '', email: '', nome_mae: '' }); 
                else if (activeTab === 'biblioteca') setBookData({ titulo: '', autor: '', preco: 0 });
                else setGradeData({ aluno_id: alunos[0]?.id || 0, disciplina_id: 1, nota: 0 });
                setIsModalOpen(true); 
              }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95">
              <PlusIcon /> Novo Registro
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 space-y-8">
          {error && <div className="p-4 bg-red-50 border border-red-100 text-red-700 flex items-center justify-between rounded-2xl shadow-sm"><span className="text-sm font-semibold">{error}</span><button onClick={() => setError(null)} className="text-xs uppercase font-bold text-red-400">Fechar</button></div>}

          {/* Modal Cadastro/Edição */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-xl font-bold text-slate-900">{modalMode === 'edit' ? 'Editar' : 'Novo'} {activeTab === 'alunos' ? 'Aluno' : activeTab === 'biblioteca' ? 'Livro' : 'Nota'}</h3>
                </div>
                <form onSubmit={activeTab === 'alunos' ? handleStudentSubmit : activeTab === 'biblioteca' ? handleBookSubmit : handleGradeSubmit} className="p-8 space-y-6">
                  {activeTab === 'alunos' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matrícula</label><input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={studentData.matricula} onChange={(e) => setStudentData({...studentData, matricula: e.target.value})} /></div>
                        <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome Aluno</label><input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={studentData.nome_aluno} onChange={(e) => setStudentData({...studentData, nome_aluno: e.target.value})} /></div>
                      </div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">E-mail</label><input required type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={studentData.email} onChange={(e) => setStudentData({...studentData, email: e.target.value})} /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome da Mãe</label><input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={studentData.nome_mae} onChange={(e) => setStudentData({...studentData, nome_mae: e.target.value})} /></div>
                    </>
                  )}
                  {activeTab === 'biblioteca' && (
                    <>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Título do Livro</label><input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={bookData.titulo} onChange={(e) => setBookData({...bookData, titulo: e.target.value})} /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Autor</label><input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={bookData.autor} onChange={(e) => setBookData({...bookData, autor: e.target.value})} /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preço (R$)</label><input required type="number" step="0.01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={bookData.preco} onChange={(e) => setBookData({...bookData, preco: parseFloat(e.target.value)})} /></div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categoria</label>
                          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={bookData.categoria_id} onChange={(e) => setBookData({...bookData, categoria_id: parseInt(e.target.value)})}>
                            <option value="">Nenhuma</option>
                            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome_categoria}</option>)}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                  {activeTab === 'notas' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aluno</label>
                        <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={gradeData.aluno_id} onChange={(e) => setGradeData({...gradeData, aluno_id: parseInt(e.target.value)})}>
                          <option value="">Selecione um aluno</option>
                          {alunos.map(a => <option key={a.id} value={a.id}>{a.nome_aluno}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Disciplina</label>
                          <select required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={gradeData.disciplina_id} onChange={(e) => setGradeData({...gradeData, disciplina_id: parseInt(e.target.value)})}>
                            <option value="">Selecione</option>
                            <option value="1">Estatística</option>
                            <option value="2">Projeto ciência de dados 2</option>
                            <option value="3">Programação linear aplicada</option>
                            <option value="4">Estrutura de dados</option>
                          </select>
                        </div>
                        <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nota</label><input required type="number" step="0.1" max="10" min="0" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" value={gradeData.nota} onChange={(e) => setGradeData({...gradeData, nota: parseFloat(e.target.value)})} /></div>
                      </div>
                    </>
                  )}
                  <div className="pt-4 flex gap-3"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl">Cancelar</button><button type="submit" disabled={isSubmitting} className="flex-[2] px-6 py-3.5 bg-indigo-600 text-white font-bold text-sm rounded-xl disabled:opacity-50">{isSubmitting ? 'Processando...' : 'Confirmar'}</button></div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Exclusão */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white w-full max-md rounded-[2.5rem] p-8 text-center space-y-6">
                <h3 className="text-2xl font-black text-slate-900">Excluir Registro?</h3>
                <p className="text-slate-500 text-sm">Deseja excluir <b>{recordToDelete?.nome}</b>?</p>
                <div className="flex gap-3 mt-4"><button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold">Não</button><button onClick={handleDelete} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold">Sim, excluir</button></div>
              </div>
            </div>
          )}

          {/* Cards Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden"><h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Registros Totais</h3><span className="text-4xl font-black text-slate-900">{activeTab === 'alunos' ? alunos.length : activeTab === 'biblioteca' ? livros.length : notas.length}</span></div>
            <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden"><h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Fonte de Dados</h3><span className="text-2xl font-black text-indigo-600">{activeTab === 'biblioteca' ? 'API PostgreSQL' : 'API MySQL'}</span></div>
            <div className="p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden"><h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Última Sincronização</h3><span className="text-2xl font-black text-slate-700">{new Date().toLocaleTimeString()}</span></div>
          </div>

          {/* Tabela com Ordenação */}
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('id')}>
                      <div className="flex items-center gap-1">ID {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                    </th>
                    {activeTab === 'alunos' && (
                      <>
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('nome_aluno')}>
                          <div className="flex items-center gap-1">Aluno / Matrícula {sortConfig?.key === 'nome_aluno' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                        </th>
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('nome_mae')}>
                          <div className="flex items-center gap-1">Mãe {sortConfig?.key === 'nome_mae' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                        </th>
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('email')}>
                          <div className="flex items-center gap-1">E-mail {sortConfig?.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                        </th>
                      </>
                    )}
                    {activeTab === 'biblioteca' && (
                      <>
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('titulo')}>
                          <div className="flex items-center gap-1">Título {sortConfig?.key === 'titulo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                        </th>
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('autor')}>
                          <div className="flex items-center gap-1">Autor {sortConfig?.key === 'autor' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                        </th>
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('preco')}>
                          <div className="flex items-center gap-1">Preço {sortConfig?.key === 'preco' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                        </th>
                      </>
                    )}
                    {activeTab === 'notas' && (
                      <>
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('nome_aluno')}>
                          <div className="flex items-center gap-1">Aluno {sortConfig?.key === 'nome_aluno' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                        </th>
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('nome_disciplina')}>
                          <div className="flex items-center gap-1">Disciplina {sortConfig?.key === 'nome_disciplina' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                        </th>
                        <th className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('nota')}>
                          <div className="flex items-center gap-1">Nota {sortConfig?.key === 'nota' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</div>
                        </th>
                      </>
                    )}
                    <th className="px-8 py-5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  {loading ? (
                    <tr><td colSpan={6} className="px-8 py-20 text-center animate-pulse italic text-slate-400">Sincronizando...</td></tr>
                  ) : activeTab === 'alunos' ? (
                    filteredAlunos.map(aluno => (
                      <tr key={aluno.id} className="hover:bg-indigo-50/30 transition-all">
                        <td className="px-8 py-5 text-xs font-bold text-slate-400">#{aluno.id}</td>
                        <td className="px-8 py-5 font-bold text-slate-900">{aluno.nome_aluno} <br/><span className="text-[10px] text-slate-400 font-mono">{aluno.matricula}</span></td>
                        <td className="px-8 py-5 text-xs uppercase text-slate-500 tracking-tighter"><span className="bg-slate-100 px-1.5 py-0.5 rounded mr-2">Mãe</span>{aluno.nome_mae}</td>
                        <td className="px-8 py-5 text-indigo-600 text-xs">{aluno.email}</td>
                        <td className="px-8 py-5 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openEditStudent(aluno)} className="p-2 hover:bg-white rounded-xl text-indigo-600 shadow-sm border border-transparent hover:border-indigo-100 transition-all cursor-pointer">Editar</button>
                            <button onClick={() => { setRecordToDelete({id: aluno.id!, nome: aluno.nome_aluno}); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-white rounded-xl text-red-600 shadow-sm border border-transparent hover:border-red-100 transition-all cursor-pointer">Excluir</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : activeTab === 'biblioteca' ? (
                    filteredLivros.map(livro => (
                      <tr key={livro.id} className="hover:bg-indigo-50/30 transition-all">
                        <td className="px-8 py-5 text-xs font-bold text-slate-400">#{livro.id}</td>
                        <td className="px-8 py-5 font-bold text-slate-900">{livro.titulo}</td>
                        <td className="px-8 py-5 text-slate-500 italic">{livro.autor}</td>
                        <td className="px-8 py-5 text-emerald-600 font-black">R$ {Number(livro.preco || 0).toFixed(2)}</td>
                        <td className="px-8 py-5 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openEditBook(livro)} className="p-2 hover:bg-white rounded-xl text-indigo-600 shadow-sm border border-transparent hover:border-indigo-100 transition-all cursor-pointer">Editar</button>
                            <button onClick={() => { setRecordToDelete({id: livro.id!, nome: livro.titulo}); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-white rounded-xl text-red-600 shadow-sm border border-transparent hover:border-red-100 transition-all cursor-pointer">Excluir</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    filteredNotas.map(nota => (
                      <tr key={nota.id} className="hover:bg-indigo-50/30 transition-all">
                        <td className="px-8 py-5 text-xs font-bold text-slate-400">#{nota.id}</td>
                        <td className="px-8 py-5 font-bold text-slate-900">{nota.nome_aluno || `ID Aluno: ${nota.aluno_id}`}</td>
                        <td className="px-8 py-5 text-slate-500">{nota.nome_disciplina || `ID Disciplina: ${nota.disciplina_id}`}</td>
                        <td className="px-8 py-5"><span className={`px-3 py-1 rounded-full font-bold text-xs ${Number(nota.nota || 0) >= 6 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{Number(nota.nota || 0).toFixed(1)}</span></td>
                        <td className="px-8 py-5 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => openEditGrade(nota)} className="p-2 hover:bg-white rounded-xl text-indigo-600 shadow-sm border border-transparent hover:border-indigo-100 transition-all cursor-pointer">Editar</button>
                            <button onClick={() => { setRecordToDelete({id: nota.id!, nome: `Nota ${nota.nota} (ID ${nota.id})`}); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-white rounded-xl text-red-600 shadow-sm border border-transparent hover:border-red-100 transition-all cursor-pointer">Excluir</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  {(!loading && (activeTab === 'alunos' ? filteredAlunos : activeTab === 'biblioteca' ? filteredLivros : filteredNotas).length === 0) && (
                    <tr><td colSpan={6} className="px-8 py-32 text-center text-slate-300 italic">Nenhum registro encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const UsersIcon = () => (<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const BookIcon = () => (<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>);
const GradeIcon = () => (<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><path d="M12 11v6"/><path d="M9 14h6"/></svg>);
const PlusIcon = () => (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const SearchIcon = ({ size = 20 }) => (<svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>);

export default App;