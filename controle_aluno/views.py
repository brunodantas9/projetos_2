from typing import List
from django.shortcuts import render
from ninja_extra import route, api_controller
from controle_aluno.models import Aluno
from controle_aluno.schemas import AlunoOut

# Create your views here.

@api_controller("/controle_aluno",)
class ControleAlunosView:
    @route.get("/consultar-alunos", response=List[AlunoOut])
    def consultar_alunos(self):
        return Aluno.objects.all()
