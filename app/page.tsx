'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Modal, Form, Input, message, Typography, Space, Empty } from 'antd'
import { PlusOutlined, FolderOpenOutlined } from '@ant-design/icons'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'

const { Title } = Typography
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

  return (
    <AppShell>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>Projects</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            size="large"
          >
            New Project
          </Button>
        </div>

        {fetchLoading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>Loading...</div>
        ) : projects.length === 0 ? (
          <Empty
            description="No projects yet"
            style={{ padding: '48px' }}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Create Your First Project
            </Button>
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {projects.map((project) => (
              <Col xs={24} sm={12} md={8} lg={6} key={project.id}>
                <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                  <Card
                    hoverable
                    style={{ height: '100%' }}
                    cover={
                      <div style={{ padding: '40px', textAlign: 'center', background: '#f0f5ff' }}>
                        <FolderOpenOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={project.name}
                      description={project.description || `${project._count?.folders || 0} folders, ${project._count?.boards || 0} phalakams`}
                    />
                  </Card>
                </Link>
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
