class BancoDadosRouter:
    """
    Router simples para separar apps por banco de dados.
    app 'default' -> MySQL
    app 'biblioteca' -> PostgreSQL
    """
    def db_for_read(self, model, **hints):
        if model._meta.app_label == "controle_aluno":
            return "default"
        if model._meta.app_label == "controle_biblioteca":
            return "biblioteca"
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == "controle_aluno":
            return "default"
        if model._meta.app_label == "controle_biblioteca":
            return "biblioteca"
        return None

    def allow_relation(self, obj1, obj2, **hints):
        bancos_permitidos = {"default", "biblioteca"}
        if (
        obj1._state.db in bancos_permitidos
        and obj2._state.db in bancos_permitidos
        ):
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == "controle_aluno":
            return db == "default"
        if app_label == "controle_biblioteca":
            return db == "biblioteca"
        return None