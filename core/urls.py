
from django.contrib import admin
from django.urls import path
from ninja_extra import NinjaExtraAPI
from controle_aluno.views import ControleAlunosView

api = NinjaExtraAPI()
api.register_controllers(ControleAlunosView)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', api.urls),
]

