from typing import Optional
from ninja import Schema
from .models import Aluno

# 1. Defina o Schema para o Aluno
class AlunoOut(Schema):
    matricula: str
    nome_aluno: str
    email: Optional[str]
    nome_mae: Optional[str] # Nota: No seu model está FloatField, é isso mesmo?
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