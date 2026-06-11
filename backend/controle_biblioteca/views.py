from typing import List
from django.shortcuts import get_object_or_404, render
from ninja_extra import route, api_controller
from controle_biblioteca.models import TbLivros, TbCategoria, TbEmprestimos
from controle_biblioteca.schemas import (
    LivroIn, LivroOut, LivroUpdateIn,
    CategoriaIn, CategoriaOut,
    EmprestimoIn, EmprestimoOut,
    MensagemExclusao
)

# Create your views here.

@api_controller("/controle_biblioteca")
class ControleBibliotecaView:
    
    # --- CRUD LIVROS ---
    
    @route.get("/consultar-livros", response=List[LivroOut])
    def consultar_livros(self):
        return TbLivros.objects.all().values()
    
    @route.get("/consultar-livro-por-id/{id}", response=LivroOut)
    def consultar_livro_por_id(self, id: int):
        return get_object_or_404(TbLivros, id=id)

    @route.post("/criar-livro", response=LivroOut)
    def criar_livro(self, data: LivroIn):
        livro = TbLivros.objects.create(**data.dict())
        return livro
    
    @route.delete("/deletar-livro/{id}", response=MensagemExclusao)
    def deletar_livro(self, id: int):
        livro = TbLivros.objects.get(id=id)
        livro.delete()
        return {"mensagem": "livro deletado com sucesso ", "id": id}

    @route.put("/atualizar-livro/{id}", response=LivroOut)
    def atualizar_livro(self, id: int, data: LivroIn):
        # get_object_or_404 evita que o app quebre caso o ID não exista (retorna erro 404 estruturado)
        livro = get_object_or_404(TbLivros, id=id)
        
        # Atualiza os campos do modelo com os dados que vieram do Schema
        for attr, value in data.dict().items():
            setattr(livro, attr, value)
        
        livro.save()
        return livro


    # --- CRUD CATEGORIAS ---

    @route.get("/consultar-categorias", response=List[CategoriaOut])
    def consultar_categorias(self):
        return TbCategoria.objects.all().values()

    @route.post("/criar-categoria", response=CategoriaOut)
    def criar_categoria(self, data: CategoriaIn):
        categoria = TbCategoria.objects.create(**data.dict())
        return categoria
    
    @route.delete("/deletar-categoria/{id}", response=MensagemExclusao)
    def deletar_categoria(self, id: int):
        categoria = TbCategoria.objects.get(id=id)
        categoria.delete()
        return {"mensagem": "categoria deletada com sucesso ", "id": id}


    # --- CRUD EMPRESTIMOS ---

    @route.get("/consultar-emprestimos", response=List[EmprestimoOut])
    def consultar_emprestimos(self):
        return TbEmprestimos.objects.all().values()

    @route.post("/criar-emprestimo", response=EmprestimoOut)
    def criar_emprestimo(self, data: EmprestimoIn):
        emprestimo = TbEmprestimos.objects.create(**data.dict())
        return emprestimo
