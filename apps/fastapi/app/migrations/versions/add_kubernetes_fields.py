"""Add Kubernetes fields to Project model

Revision ID: add_kubernetes_fields
Revises: 
Create Date: 2023-04-17 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_kubernetes_fields'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add Kubernetes resource fields to the projects table
    op.add_column('projects', sa.Column('deployment_name', sa.String(), nullable=True))
    op.add_column('projects', sa.Column('service_name', sa.String(), nullable=True))
    op.add_column('projects', sa.Column('pvc_name', sa.String(), nullable=True))
    op.add_column('projects', sa.Column('container_running', sa.Boolean(), nullable=True, server_default='false'))
    op.add_column('projects', sa.Column('container_status', sa.String(), nullable=True))
    op.add_column('projects', sa.Column('container_created_at', sa.DateTime(), nullable=True))
    op.add_column('projects', sa.Column('container_last_started_at', sa.DateTime(), nullable=True))
    op.add_column('projects', sa.Column('container_image', sa.String(), nullable=True))
    op.add_column('projects', sa.Column('container_port', sa.String(), nullable=True))
    op.add_column('projects', sa.Column('k8s_resources', postgresql.JSONB(astext_type=sa.Text()), nullable=True))


def downgrade():
    # Remove Kubernetes resource fields from the projects table
    op.drop_column('projects', 'k8s_resources')
    op.drop_column('projects', 'container_port')
    op.drop_column('projects', 'container_image')
    op.drop_column('projects', 'container_last_started_at')
    op.drop_column('projects', 'container_created_at')
    op.drop_column('projects', 'container_status')
    op.drop_column('projects', 'container_running')
    op.drop_column('projects', 'pvc_name')
    op.drop_column('projects', 'service_name')
    op.drop_column('projects', 'deployment_name')
