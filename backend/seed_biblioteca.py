import os
import django
import json

# Configura o ambiente do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from controle_biblioteca.models import TbLivros, TbCategoria

# Seus dados fornecidos
dados = [
  {
    "categoria": "Esportes e São Paulo FC",
    "livros": [
      {"titulo": "São Paulo F.C. - Dentre os Grandes, és o Primeiro", "autor": "Conrado Giacomini", "preco": 49.90},
      {"titulo": "1992: O Mundo em Três Cores", "autor": "Raí e Tajra", "preco": 55.00},
      {"titulo": "Mundial 92-93: O Bicampeonato do São Paulo", "autor": "Arnaldo Ribeiro", "preco": 42.00},
      {"titulo": "O Mestre: Biografia de Telê Santana", "autor": "André Ribeiro", "preco": 59.90},
      {"titulo": "De Letra: O Futebol de Telê Santana", "autor": "Rogério Steinberg", "preco": 39.90},
      {"titulo": "Soberano: Cem Anos de Histórias do São Paulo", "autor": "Orlando Duarte", "preco": 65.00},
      {"titulo": "Rogério Ceni: Mito Mito", "autor": "André Plihal", "preco": 49.90},
      {"titulo": "Maioridade Penal: 18 Anos de Histórias Inéditas do SPFC", "autor": "Lugano", "preco": 54.00},
      {"titulo": "Guardiola: Confidencial", "autor": "Martí Perarnau", "preco": 49.90},
      {"titulo": "A Mentalidade Mamba", "autor": "Kobe Bryant", "preco": 79.90}
    ]
  },
  {
    "categoria": "Tecnologia",
    "livros": [
      {"titulo": "Código Limpo", "autor": "Robert C. Martin", "preco": 85.00},
      {"titulo": "O Programador Pragmático", "autor": "Andrew Hunt", "preco": 89.90},
      {"titulo": "Arquitetura Limpa", "autor": "Robert C. Martin", "preco": 82.00},
      {"titulo": "Entendendo Algoritmos", "autor": "Aditya Bhargava", "preco": 59.00},
      {"titulo": "Padrões de Projetos (Design Patterns)", "autor": "Erich Gamma", "preco": 110.00},
      {"titulo": "Refatoração", "autor": "Martin Fowler", "preco": 95.00},
      {"titulo": "Grokking Machine Learning", "autor": "Luis Serrano", "preco": 79.00},
      {"titulo": "Python Fluente", "autor": "Luciano Ramalho", "preco": 115.00},
      {"titulo": "Designing Data-Intensive Applications", "autor": "Martin Kleppmann", "preco": 120.00},
      {"titulo": "Clean Agile", "autor": "Robert C. Martin", "preco": 69.90}
    ]
  },
  {
    "categoria": "Ficção",
    "livros": [
      {"titulo": "O Senhor dos Anéis: A Sociedade do Anel", "autor": "J.R.R. Tolkien", "preco": 59.90},
      {"titulo": "Duna", "autor": "Frank Herbert", "preco": 45.00},
      {"titulo": "Neuromancer", "autor": "William Gibson", "preco": 48.00},
      {"titulo": "Fundação", "autor": "Isaac Asimov", "preco": 52.00},
      {"titulo": "O Guia do Mochileiro das Galáxias", "autor": "Douglas Adams", "preco": 35.00},
      {"titulo": "Matéria Escura", "autor": "Blake Crouch", "preco": 44.90},
      {"titulo": "O Nome do Vento", "autor": "Patrick Rothfuss", "preco": 64.90},
      {"titulo": "Andróides Sonham com Ovelhas Elétricas?", "autor": "Philip K. Dick", "preco": 42.00},
      {"titulo": "Frankenstein", "autor": "Mary Shelley", "preco": 29.90},
      {"titulo": "Cilindro de Rama", "autor": "Arthur C. Clarke", "preco": 39.90}
    ]
  },
  {
    "categoria": "Clássicos",
    "livros": [
      {"titulo": "1984", "autor": "George Orwell", "preco": 39.90},
      {"titulo": "Admirável Mundo Novo", "autor": "Aldous Huxley", "preco": 41.00},
      {"titulo": "Dom Casmurro", "autor": "Machado de Assis", "preco": 24.90},
      {"titulo": "Memórias Póstumas de Brás Cubas", "autor": "Machado de Assis", "preco": 26.00},
      {"titulo": "O Grande Gatsby", "autor": "F. Scott Fitzgerald", "preco": 32.00},
      {"titulo": "Cem Anos de Solidão", "autor": "Gabriel García Márquez", "preco": 59.90},
      {"titulo": "Crime e Castigo", "autor": "Fiódor Dostoiévski", "preco": 69.00},
      {"titulo": "O Processo", "autor": "Franz Kafka", "preco": 34.90},
      {"titulo": "Grande Sertão: Veredas", "autor": "Guimarães Rosa", "preco": 74.90},
      {"titulo": "A Revolução dos Bichos", "autor": "George Orwell", "preco": 28.00}
    ]
  },
  {
    "categoria": "Ciência e Cultura Pop",
    "livros": [
      {"titulo": "Sapiens: Uma Breve História da Humanidade", "autor": "Yuval Noah Harari", "preco": 59.90},
      {"titulo": "Cosmos", "autor": "Carl Sagan", "preco": 64.90},
      {"titulo": "Uma Breve História do Tempo", "autor": "Stephen Hawking", "preco": 49.90},
      {"titulo": "O Mundo Assombrado pelos Demônios", "autor": "Carl Sagan", "preco": 52.00},
      {"titulo": "Homo Deus", "autor": "Yuval Noah Harari", "preco": 61.00},
      {"titulo": "Cibercultura", "autor": "Pierre Lévy", "preco": 45.00},
      {"titulo": "Cultura Convergente", "autor": "Henry Jenkins", "preco": 54.00},
      {"titulo": "Armas, Germes e Aço", "autor": "Jared Diamond", "preco": 69.90},
      {"titulo": "O Gene Egoísta", "autor": "Richard Dawkins", "preco": 58.00},
      {"titulo": "Rápido e Devagar: Duas Formas de Pensar", "autor": "Daniel Kahneman", "preco": 62.90}
    ]
  }
]

def run():
    print("Iniciando a populaçao do banco de dados biblioteca...")
    
    livros_criados = 0
    categorias_criadas = 0

    for item in dados:
        # 1. Cria ou busca a categoria
        categoria_obj, created = TbCategoria.objects.get_or_create(
            nome_categoria=item["categoria"]
        )
        if created:
            categorias_criadas += 1
            print(f"Categoria criada: {categoria_obj.nome_categoria}")

        # 2. Cria os livros para essa categoria
        for livro in item["livros"]:
            # Usamos update_or_create para evitar duplicados se rodar o script duas vezes
            obj, created = TbLivros.objects.update_or_create(
                titulo=livro["titulo"],
                defaults={
                    "autor": livro["autor"],
                    "preco": livro["preco"],
                    "categoria": categoria_obj
                }
            )
            if created:
                livros_criados += 1

    print(f"\nSucesso!")
    print(f"Categorias novas: {categorias_criadas}")
    print(f"Livros novos: {livros_criados}")

if __name__ == '__main__':
    run()
