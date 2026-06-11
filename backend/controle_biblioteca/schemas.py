from typing import Optional, List
from ninja import Schema
from datetime import date
from decimal import Decimal

# --- Categoria ---
class CategoriaOut(Schema):
    id: int
    nome_categoria: str

class CategoriaIn(Schema):
    nome_categoria: str

class CategoriaUpdateIn(Schema):
    nome_categoria: Optional[str] = None

# --- Livro ---
class LivroOut(Schema):
    id: int
    titulo: str
    autor: Optional[str]
    preco: Optional[Decimal]
    categoria_id: Optional[int]

class LivroIn(Schema):
    titulo: str
    autor: Optional[str]
    preco: Optional[Decimal]
    categoria_id: Optional[int]

class LivroUpdateIn(Schema):
    titulo: Optional[str] = None
    autor: Optional[str] = None
    preco: Optional[Decimal] = None
    categoria_id: Optional[int] = None

# --- Emprestimo ---
class EmprestimoOut(Schema):
    id: int
    data_emprestimo: date
    data_devolucao: Optional[date]
    livro_id: int

class EmprestimoIn(Schema):
    data_emprestimo: date
    data_devolucao: Optional[date]
    livro_id: int

class EmprestimoUpdateIn(Schema):
    data_emprestimo: Optional[date] = None
    data_devolucao: Optional[date] = None
    livro_id: Optional[int] = None

# --- Resposta de Exclusão Genérica ---
class MensagemExclusao(Schema):
    mensagem: str
    id: int
