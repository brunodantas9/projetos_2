
from django.db import models


class TbCategoria(models.Model):
    nome_categoria = models.CharField(max_length=100)

    class Meta:
        managed = True
        db_table = 'tb_categoria'


class TbEmprestimos(models.Model):
    data_emprestimo = models.DateField()
    data_devolucao = models.DateField(blank=True, null=True)
    livro = models.ForeignKey('TbLivros', models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'tb_emprestimos'


class TbLivros(models.Model):
    titulo = models.CharField(max_length=255)
    categoria = models.ForeignKey(TbCategoria, models.DO_NOTHING, blank=True, null=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    autor = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'tb_livros'
