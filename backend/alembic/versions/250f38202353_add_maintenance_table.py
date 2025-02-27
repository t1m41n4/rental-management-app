from alembic import op
import sqlalchemy as sa

revision = '250f38202353'
down_revision = 'e8ea39fbc467'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'maintenance',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.Integer(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('submitted_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['tenant_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_maintenance_id'), 'maintenance', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_maintenance_id'), table_name='maintenance')
    op.drop_table('maintenance')