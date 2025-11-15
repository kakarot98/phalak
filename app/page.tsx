'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Modal, Form, Input, message, Typography, Space, Empty } from 'antd'
import { PlusOutlined, FolderOpenOutlined } from '@ant-design/icons'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'

const { Title } = Typography
const { TextArea } = Input

interface Workspace {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [form] = Form.useForm()

  // Fetch workspaces on mount
  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      setFetchLoading(true)
      const res = await fetch('/api/workspaces')
      if (!res.ok) throw new Error('Failed to fetch workspaces')
      const data = await res.json()
      setWorkspaces(data)
    } catch (error) {
      message.error('Failed to fetch workspaces')
      console.error(error)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleCreate = async (values: { name: string; description?: string }) => {
    setLoading(true)
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        message.success('Workspace created successfully')
        form.resetFields()
        setIsModalOpen(false)
        fetchWorkspaces()
      } else {
        const error = await res.json()
        message.error(error.error || 'Failed to create workspace')
      }
    } catch (error) {
      message.error('Failed to create workspace')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>Workspaces</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            size="large"
          >
            New Workspace
          </Button>
        </div>

        {fetchLoading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>Loading...</div>
        ) : workspaces.length === 0 ? (
          <Empty
            description="No workspaces yet"
            style={{ padding: '48px' }}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Create Your First Workspace
            </Button>
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {workspaces.map((workspace) => (
              <Col xs={24} sm={12} md={8} lg={6} key={workspace.id}>
                <Link href={`/workspaces/${workspace.id}`} style={{ textDecoration: 'none' }}>
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
                      title={workspace.name}
                      description={workspace.description || 'No description'}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}

        <Modal
          title="Create Workspace"
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
              <Input placeholder="Product Design" />
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
