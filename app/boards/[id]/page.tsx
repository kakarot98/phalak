'use client'

import { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, message, Typography, Space, Breadcrumb, Card, Row, Col, Empty } from 'antd'
import { PlusOutlined, HomeOutlined, FolderOutlined } from '@ant-design/icons'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import { useParams } from 'next/navigation'

const { Title } = Typography
const { TextArea } = Input

interface Note {
  id: string
  title: string
  body: string
  positionX: number | null
  positionY: number | null
  boardId: string
}

interface Board {
  id: string
  name: string
  description: string | null
  workspaceId: string
  notes: Note[]
}

export default function BoardPage() {
  const params = useParams()
  const boardId = params.id as string

  const [board, setBoard] = useState<Board | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchBoard()
  }, [boardId])

  const fetchBoard = async () => {
    try {
      setFetchLoading(true)
      const res = await fetch(`/api/boards/${boardId}`)
      if (!res.ok) {
        if (res.status === 404) {
          message.error('Board not found')
        } else {
          throw new Error('Failed to fetch board')
        }
        return
      }
      const data = await res.json()
      setBoard(data)
    } catch (error) {
      message.error('Failed to fetch board')
      console.error(error)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleCreateNote = async (values: { title: string; body: string }) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/boards/${boardId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          positionX: Math.random() * 500,
          positionY: Math.random() * 300,
        }),
      })

      if (res.ok) {
        message.success('Note created successfully')
        form.resetFields()
        setIsModalOpen(false)
        fetchBoard()
      } else {
        const error = await res.json()
        message.error(error.error || 'Failed to create note')
      }
    } catch (error) {
      message.error('Failed to create note')
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

  if (!board) {
    return (
      <AppShell>
        <Empty description="Board not found">
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
            {
              title: (
                <Link href={`/workspaces/${board.workspaceId}`}>
                  <FolderOutlined /> Workspace
                </Link>
              ),
            },
            { title: board.name },
          ]}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>{board.name}</Title>
            {board.description && (
              <Typography.Text type="secondary">{board.description}</Typography.Text>
            )}
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            size="large"
          >
            New Note
          </Button>
        </div>

        {/* Simple grid layout for v1 (future: canvas with drag-and-drop) */}
        {board.notes.length === 0 ? (
          <Empty
            description="No notes yet"
            style={{ padding: '48px' }}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
              Create Your First Note
            </Button>
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {board.notes.map((note) => (
              <Col xs={24} sm={12} md={8} key={note.id}>
                <Card
                  title={note.title}
                  bordered={false}
                  style={{ minHeight: '150px', background: '#fff' }}
                >
                  <p style={{ whiteSpace: 'pre-wrap', color: '#595959' }}>{note.body}</p>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Modal
          title="Create Note"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateNote}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input placeholder="Key Finding #1" />
            </Form.Item>
            <Form.Item
              name="body"
              label="Body"
              rules={[{ required: true, message: 'Please enter content' }]}
            >
              <TextArea rows={5} placeholder="Your note content..." />
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
