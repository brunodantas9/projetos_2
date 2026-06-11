class BancoDadosRouter:
    """
    Router para separar apps por banco de dados.
    - controle_aluno e tabelas de sistema (admin, auth, etc) -> MySQL (default)
    - controle_biblioteca -> PostgreSQL (biblioteca)
    """
    def db_for_read(self, model, **hints):
        if model._meta.app_label == "controle_biblioteca":
            return "biblioteca"
        return "default"

    def db_for_write(self, model, **hints):
        if model._meta.app_label == "controle_biblioteca":
            return "biblioteca"
        return "default"

    def allow_relation(self, obj1, obj2, **hints):
        # Permite relações se ambos os objetos estiverem no mesmo banco
        if obj1._state.db == obj2._state.db:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # Se o banco for 'biblioteca' (PostgreSQL), SÓ aceita o app 'controle_biblioteca'
        if db == "biblioteca":
            return app_label == "controle_biblioteca"
        
        # Se o app for 'controle_biblioteca', ele NÃO pode ir para outros bancos (como o default)
        if app_label == "controle_biblioteca":
            return db == "biblioteca"

        # Para todos os outros bancos e apps (como o default/MySQL), permite se for o default
        return db == "default"