from typing import List
from django.shortcuts import get_object_or_404, render
from ninja_extra import route, api_controller
from controle_aluno.models import Aluno
from controle_aluno.models import Endereco
from controle_aluno.schemas import AlunoIn, AlunoOut, AlunoExcluido

# Create your views here.

@api_controller("/controle_aluno",)
class ControleAlunosView:
    @route.get("/consultar-alunos", response=List[AlunoOut])
    def consultar_alunos(self):
        return Aluno.objects.all().values()
    
    @route.get("/consultar-alunos/{id}", response=List[AlunoOut])
    def consultar_alunos(self, id:int):
        return Aluno.objects.filter(id=id)


    @route.post("/criar-aluno", response=AlunoOut)
    def criar_aluno(self, data: AlunoIn): 
        aluno = Aluno.objects.create(**data.dict())
        return aluno
    
    @route.delete("/deletar-aluno/{id}", response=AlunoExcluido)
    def deletar_aluno(self, id: int):
        aluno = Aluno.objects.get(id=id)
        aluno.delete()
        return {"mensagem": "aluno deletado com sucesso ", "id": id}
    

    @route.put("/atualizar-aluno/{id}", response=AlunoOut)
    def atualizar_aluno(self, id: int, data: AlunoIn):
        # get_object_or_404 evita que o app quebre caso o ID não exista (retorna erro 404 estruturado)
        aluno = get_object_or_404(Aluno, id=id)
        
        # Atualiza os campos do modelo com os dados que vieram do Schema
        for attr, value in data.dict().items():
            setattr(aluno, attr, value)
        
        aluno.save()
        return aluno