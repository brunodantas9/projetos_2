from typing import Optional
from ninja import Schema
from .models import Aluno

# 1. Defina o Schema para o Aluno
class AlunoOut(Schema):
    matricula: str
    nome_aluno: str
    email: Optional[str]
    nome_mae: Optional[float] # Nota: No seu model está FloatField, é isso mesmo?
    # Se quiser o ID do endereço:
    endereco_id: Optional[int] = None