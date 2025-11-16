'use client'

import { useState, useEffect } from 'react'
import { Button, Row, Col, Modal, Form, Input, message, Space, Empty, Tabs } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import AppShell from '@/components/layout/AppShell'
import SearchBar from '@/components/ui/SearchBar'
import ProjectCard from '@/components/ui/ProjectCard'

const { TextArea } = Input

interface Project {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    folders: number
    boards: number
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [form] = Form.useForm()

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setFetchLoading(true)
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      message.error('Failed to fetch projects')
      console.error(error)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleCreate = async (values: { name: string; description?: string }) => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        message.success('Project created successfully')
        form.resetFields()
        setIsModalOpen(false)
        fetchProjects()
      } else {
        const error = await res.json()
        message.error(error.error || 'Failed to create project')
      }
    } catch (error) {
      message.error('Failed to create project')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const tabItems = [
    {
      key: 'projects',
      label: (
        <span
          style={{
            fontSize: 24,
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Projects
        </span>
      ),
    },
    {
      key: 'boards',
      label: (
        <span
          style={{
            fontSize: 24,
            fontWeight: 300,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Boards
        </span>
      ),
    },
  ]

  return (
    <AppShell>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Search Bar */}
        <SearchBar />

        {/* Your Workplace Heading */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 40,
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Your Workplace
          </div>
          <Space size="middle">
            <Button
              style={{
                border: '0.5px solid #cfcfcf',
                borderRadius: 4,
                fontSize: 17,
                fontWeight: 300,
                fontFamily: 'Inter, sans-serif',
                height: 28,
              }}
              onClick={() => setIsModalOpen(true)}
            >
              + New Projects
            </Button>
            <Button
              style={{
                border: '0.5px solid #cfcfcf',
                borderRadius: 4,
                fontSize: 17,
                fontWeight: 300,
                fontFamily: 'Inter, sans-serif',
                height: 28,
              }}
            >
              + New Boards
            </Button>
          </Space>
        </div>

        {/* Tabs */}
        <Tabs
          defaultActiveKey="projects"
          items={tabItems}
          style={{
            marginTop: 20,
          }}
          tabBarStyle={{
            borderBottom: '1px solid #cfcfcf',
          }}
        />

        {/* Projects Grid */}
        {fetchLoading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>Loading...</div>
        ) : projects.length === 0 ? (
          <Empty
            description="No projects yet"
            style={{ padding: '48px' }}
          >
            <Button icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Create Your First Project
            </Button>
          </Empty>
        ) : (
          <Row gutter={[20, 20]}>
            {projects.map((project) => (
              <Col key={project.id}>
                <ProjectCard
                  id={project.id}
                  name={project.name}
                  boardCount={project._count?.boards || 0}
                  variant="folder"
                />
              </Col>
            ))}
          </Row>
        )}

        <Modal
          title="Create Project"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreate}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input placeholder="Film Production" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <TextArea rows={3} placeholder="Optional description" />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Create
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </AppShell>
  )
}
