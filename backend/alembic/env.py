from alembic import context
from sqlalchemy import engine_from_config, pool
from app.models.models import Base  # Your models
from app.services.auth import engine  # Your engine from services/auth.py

config = context.config

if config.config_file_name is not None:
    import logging
    logging.basicConfig()
    logging.getLogger('alembic').setLevel(logging.INFO)

# Set target metadata to your models
target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine  # Use the existing engine
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()