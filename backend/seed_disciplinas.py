import os
import django

# Configura o ambiente do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from controle_aluno.models import Disciplina

disciplinas = [
    {"nome_disciplina": "Estatística", "carga": 80, "semestre": 1},
    {"nome_disciplina": "Projeto em ciência de dados 2", "carga": 100, "semestre": 2},
    {"nome_disciplina": "Programação linear aplicada", "carga": 80, "semestre": 2},
    {"nome_disciplina": "Estrutura de dados", "carga": 80, "semestre": 1},
]

def run():
    print("Iniciando a populaçao das disciplinas no MySQL...")
    criadas = 0
    for disc in disciplinas:
        obj, created = Disciplina.objects.get_or_create(
            nome_disciplina=disc["nome_disciplina"],
            defaults={"carga": disc["carga"], "semestre": disc["semestre"]}
        )
        if created:
            criadas += 1
            print(f"Disciplina criada: {obj.nome_disciplina}")
    
    print(f"\nSucesso! {criadas} disciplinas novas inseridas.")

if __name__ == '__main__':
    run()
