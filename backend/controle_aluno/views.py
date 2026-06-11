from typing import List
from django.shortcuts import get_object_or_404, render
from ninja_extra import route, api_controller
from controle_aluno.models import Aluno
from controle_aluno.models import Endereco, Nota
from controle_aluno.schemas import AlunoIn, AlunoOut, AlunoExcluido, NotaIn, NotaOut, NotaExcluida

# Create your views here.

@api_controller("/controle_aluno",)
class ControleAlunosView:

    # --- CRUD ALUNOS ---

    @route.get("/consultar-alunos", response=List[AlunoOut])
    def consultar_alunos(self):
        return Aluno.objects.all().values()

    @route.get("/consultar-alunos-por-id/{id}", response=List[AlunoOut])
    def consultar_alunos_por_id(self, id:int):
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


    # --- CRUD NOTAS ---

    @route.get("/consultar-notas", response=List[NotaOut])
    def consultar_notas(self):
        # Usamos select_related para buscar os dados de aluno e disciplina em uma única consulta (mais performance)
        notas_qs = Nota.objects.select_related('aluno', 'disciplina').all()
        
        # Mapeamos os objetos para incluir os nomes que o Schema espera
        resultado = []
        for nota in notas_qs:
            resultado.append({
                "id": nota.id,
                "aluno_id": nota.aluno.id,
                "nome_aluno": nota.aluno.nome_aluno,
                "disciplina_id": nota.disciplina.id,
                "nome_disciplina": nota.disciplina.nome_disciplina,
                "nota": float(nota.nota) if nota.nota else 0
            })
        return resultado

    @route.get("/consultar-notas-por-aluno/{aluno_id}", response=List[NotaOut])
    def consultar_notas_por_aluno(self, aluno_id: int):
        notas_qs = Nota.objects.select_related('aluno', 'disciplina').filter(aluno_id=aluno_id)
        
        resultado = []
        for nota in notas_qs:
            resultado.append({
                "id": nota.id,
                "aluno_id": nota.aluno.id,
                "nome_aluno": nota.aluno.nome_aluno,
                "disciplina_id": nota.disciplina.id,
                "nome_disciplina": nota.disciplina.nome_disciplina,
                "nota": float(nota.nota) if nota.nota else 0
            })
        return resultado

    @route.post("/lancar-nota", response=NotaOut)
    def lancar_nota(self, data: NotaIn):
        nota = Nota.objects.create(**data.dict())
        return nota

    @route.delete("/deletar-nota/{id}", response=NotaExcluida)
    def deletar_nota(self, id: int):
        nota = get_object_or_404(Nota, id=id)
        nota.delete()
        return {"mensagem": "nota deletada com sucesso ", "id": id}

    @route.put("/atualizar-nota/{id}", response=NotaOut)
    def atualizar_nota(self, id: int, data: NotaIn):
        # get_object_or_404 evita que o app quebre caso o ID não exista
        nota_obj = get_object_or_404(Nota, id=id)

        for attr, value in data.dict().items():
            setattr(nota_obj, attr, value)

        nota_obj.save()
        return nota_obj