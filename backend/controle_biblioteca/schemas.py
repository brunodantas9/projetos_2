from typing import Optional, List
from ninja import Schema
from datetime import date
from decimal import Decimal

class CategoriaOut(Schema):
    id: int
    nome_categoria: str

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

class EmprestimoOut(Schema):
    id: int
    data_emprestimo: date
    data_devolucao: Optional[date]
    livro_id: int
