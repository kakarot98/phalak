'use client'

import { Button, Row, Col, Empty, Tabs } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import ProjectCard from '@/components/ui/ProjectCard'
import LoadingState from '@/components/ui/LoadingState'
import ErrorBoundary from '@/components/error/ErrorBoundary'
import EntityModal from '@/components/ui/EntityModal'
import { useFetchEntity } from '@/hooks/useFetchEntity'
import { useCreateEntity } from '@/hooks/useCreateEntity'
import { useModalState } from '@/hooks/useModalState'
import type { Project } from '@/types/entities'
import { TYPOGRAPHY, COLORS } from '@/theme'

export default function ProjectsPage() {
  // Custom hooks for data fetching, creating, and modal state
  const { data: projects, loading: fetchLoading, refetch } = useFetchEntity<Project[]>(
    '/api/projects',
    [],
    { errorMessage: 'Failed to fetch projects' }
  )

  const { loading: createLoading, create } = useCreateEntity('/api/projects', {
    successMessage: 'Project created successfully',
    onSuccess: refetch,
  })

  const modal = useModalState()

  const handleCreate = async (values: { name: string; description?: string }) => {
    await create(values)
    modal.close()
  }

  const tabItems = [
    {
      key: 'projects',
      label: <span style={TYPOGRAPHY.label.large}>Projects</span>,
    },
    {
      key: 'phalaks',
      label: <span style={TYPOGRAPHY.body.regular}>Phalaks</span>,
    },
  ]

  return (
    <ErrorBoundary>
      <AppShell
        heading="Your Workspace"
        actions={[
          { label: '+ New Projects', onClick: modal.open, type: 'default' },
          { label: '+ New Phalaks', onClick: () => {}, type: 'default' },
        ]}
      >
        {/* Tabs */}
        <Tabs
          defaultActiveKey="projects"
          items={tabItems}
          tabBarStyle={{
            borderBottom: `1px solid ${COLORS.border.medium}`,
          }}
        />

        {/* Projects Grid */}
        {fetchLoading ? (
          <LoadingState message="Loading projects..." />
        ) : !projects || projects.length === 0 ? (
          <Empty
            description="No projects yet"
            style={{ padding: '48px' }}
          >
            <Button icon={<PlusOutlined />} onClick={modal.open}>
              Create Your First Project
            </Button>
          </Empty>
        ) : (
          <Row gutter={[20, 20]}>
            {projects.map((project) => (
            <Col key={project.id}>
              <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                <ProjectCard
                  id={project.id}
                  name={project.name}
                  description={project.description}
                  phalakCount={project._count?.boards || 0}
                  type="project"
                />
              </Link>
            </Col>
          ))}
        </Row>
      )}

        <EntityModal
          open={modal.isOpen}
          title="Create Project"
          loading={createLoading}
          onCancel={modal.close}
          onSubmit={handleCreate}
          fields={[
            { name: 'name', label: 'Name', required: true, placeholder: 'Film Production' },
            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional description' },
          ]}
        />
      </AppShell>
    </ErrorBoundary>
  )
}
