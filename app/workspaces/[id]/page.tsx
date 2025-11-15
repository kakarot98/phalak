'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Row, Col, Modal, Form, Input, message, Typography, Space, Breadcrumb, Empty } from 'antd'
import { PlusOutlined, FileOutlined, HomeOutlined } from '@ant-design/icons'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import { useParams } from 'next/navigation'

const { Title } = Typography
const { TextArea } = Input

interface Board {
  id: string
  name: string
  description: string | null
  workspaceId: string
}

interface Workspace {
  id: string
  name: string
  description: string | null
  boards: Board[]
}

export default function WorkspaceDetailPage() {
  const params = useParams()
  const workspaceId = params.id as string

  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchWorkspace()
  }, [workspaceId])

  const fetchWorkspace = async () => {
    try {
      setFetchLoading(true)
      const res = await fetch(`/api/workspaces/${workspaceId}`)
      if (!res.ok) {
        if (res.status === 404) {
          message.error('Workspace not found')
        } else {
          throw new Error('Failed to fetch workspace')
        }
        return
      }
      const data = await res.json()
      setWorkspace(data)
    } catch (error) {
      message.error('Failed to fetch workspace')
      console.error(error)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleCreateBoard = async (values: { name: string; description?: string }) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (res.ok) {
        message.success('Board created successfully')
        form.resetFields()
        setIsModalOpen(false)
        fetchWorkspace()
      } else {
        const error = await res.json()
        message.error(error.error || 'Failed to create board')
      }
    } catch (error) {
      message.error('Failed to create board')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <AppShell>
        <div style={{ textAlign: 'center', padding: '48px' }}>Loading...</div>
      </AppShell>
    )
  }

  if (!workspace) {
    return (
      <AppShell>
        <Empty description="Workspace not found">
          <Link href="/">
            <Button type="primary">Back to Workspaces</Button>
          </Link>
        </Empty>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/">
                  <HomeOutlined /> Workspaces
                </Link>
              ),
            },
            { title: workspace.name },
          ]}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>{workspace.name}</Title>
            {workspace.description && (
              <Typography.Text type="secondary">{workspace.description}</Typography.Text>
            )}
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            size="large"
          >
            New Board
          </Button>
        </div>

        {workspace.boards.length === 0 ? (
          <Empty
            description="No boards yet"
            style={{ padding: '48px' }}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Create Your First Board
            </Button>
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {workspace.boards.map((board) => (
              <Col xs={24} sm={12} md={8} lg={6} key={board.id}>
                <Link href={`/boards/${board.id}`} style={{ textDecoration: 'none' }}>
                  <Card
                    hoverable
                    style={{ height: '100%' }}
                    cover={
                      <div style={{ padding: '40px', textAlign: 'center', background: '#f6ffed' }}>
                        <FileOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={board.name}
                      description={board.description || 'No description'}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}

        <Modal
          title="Create Board"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateBoard}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input placeholder="User Research" />
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
