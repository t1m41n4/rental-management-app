"""add 2fa fields

Revision ID: add_2fa_fields
Revises: 250f38202353
Create Date: 2024-01-01 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = 'add_2fa_fields'
down_revision = '250f38202353'

def upgrade():
    op.add_column('users', sa.Column('two_factor_secret', sa.String(), nullable=True))
    op.add_column('users', sa.Column('two_factor_enabled', sa.Boolean(), nullable=True, server_default='false'))

def downgrade():
    op.drop_column('users', 'two_factor_enabled')
    op.drop_column('users', 'two_factor_secret')
