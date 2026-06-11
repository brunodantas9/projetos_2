from typing import Optional
from ninja import Schema
from .models import Aluno

# 1. Defina o Schema para o Aluno
class AlunoOut(Schema):
    id : int
    matricula: str
    nome_aluno: str
    email: Optional[str]
    nome_mae: Optional[str] 
    # Se quiser o ID do endereço:
    endereco_id: Optional[int] = None
    

class AlunoIn(Schema):
    matricula: str
    nome_aluno: str
    email: Optional[str]
    nome_mae: Optional[str] 
    endereco_id: Optional[int] = None

class AlunoExcluido(Schema):
    mensagem: str
    id: int

class AlunoUpdateIn(Schema):
    matricula: Optional[str] = None
    nome_aluno: Optional[str] = None
    email: Optional[str] = None
    nome_mae: Optional[str] = None
    endereco_id: Optional[int] = None

# --- Schemas para Notas ---

class NotaOut(Schema):
    id: int
    aluno_id: int
    nome_aluno: str = None
    disciplina_id: int
    nome_disciplina: str = None
    nota: Optional[float]

class NotaIn(Schema):
    aluno_id: int
    disciplina_id: int
    nota: float

class NotaUpdateIn(Schema):
    aluno_id: Optional[int] = None
    disciplina_id: Optional[int] = None
    nota: Optional[float] = None

class NotaExcluida(Schema):
    mensagem: str
    id: int
