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
import { useModalWithType } from '@/hooks/useModalState'
import type { Project } from '@/types/entities'
import { TYPOGRAPHY, COLORS } from '@/theme'

export default function ProjectsPage() {
  // Custom hooks for data fetching, creating, and modal state
  const { data: projects, loading: fetchLoading, refetch } = useFetchEntity<Project[]>(
    '/api/projects',
    [],
    { errorMessage: 'Failed to fetch projects' }
  )

  const { loading: createProjectLoading, create: createProject } = useCreateEntity('/api/projects', {
    successMessage: 'Project created successfully',
    onSuccess: refetch,
  })

  const { loading: createPhalakLoading, create: createPhalak } = useCreateEntity('/api/boards', {
    successMessage: 'Phalak created successfully',
    onSuccess: refetch,
  })

  const modal = useModalWithType(['project', 'phalak'] as const, 'project')

  const handleCreate = async (values: { name: string; description?: string; projectId?: string }) => {
    if (modal.type === 'project') {
      await createProject(values)
    } else {
      // For phalak, projectId is required
      await createPhalak(values)
    }
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
          { label: '+ New Projects', onClick: () => modal.open('project'), type: 'default' },
          { label: '+ New Phalaks', onClick: () => modal.open('phalak'), type: 'default' },
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
            <Button icon={<PlusOutlined />} onClick={() => modal.open('project')}>
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
          title={modal.type === 'project' ? 'Create Project' : 'Create Phalak'}
          loading={modal.type === 'project' ? createProjectLoading : createPhalakLoading}
          onCancel={modal.close}
          onSubmit={handleCreate}
          fields={
            modal.type === 'project'
              ? [
                  { name: 'name', label: 'Name', required: true, placeholder: 'Film Production' },
                  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional description' },
                ]
              : [
                  { name: 'name', label: 'Name', required: true, placeholder: 'Phalak name' },
                  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional description' },
                  {
                    name: 'projectId',
                    label: 'Project',
                    required: true,
                    type: 'select',
                    placeholder: 'Select a project',
                    options: projects?.map((p) => ({ label: p.name, value: p.id })) || [],
                  },
                ]
          }
        />
      </AppShell>
    </ErrorBoundary>
  )
}
