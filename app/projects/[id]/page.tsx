'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, Button, Row, Col, Modal, Form, Input, message, Typography, Space, Empty, Breadcrumb } from 'antd'
import { PlusOutlined, FolderOutlined, FileOutlined, HomeOutlined, FolderOpenOutlined } from '@ant-design/icons'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'

const { Title } = Typography
const { TextArea } = Input

interface Folder {
  id: string
  name: string
  description: string | null
  _count?: {
    boards: number
    subFolders: number
  }
}

interface Board {
  id: string
  name: string
  description: string | null
}

interface Project {
  id: string
  name: string
  description: string | null
  folders: Folder[]
  boards: Board[]
}

export default function ProjectPage() {
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'folder' | 'board'>('folder')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      setFetchLoading(true)
      const res = await fetch(`/api/projects/${projectId}`)
      if (!res.ok) throw new Error('Failed to fetch project')
      const data = await res.json()
      setProject(data)
    } catch (error) {
      message.error('Failed to fetch project')
      console.error(error)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleCreateFolder = async (values: { name: string; description?: string }) => {
    setLoading(true)
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          projectId,
        }),
      })

      if (res.ok) {
        message.success('Folder created successfully')
        form.resetFields()
        setIsModalOpen(false)
        fetchProject()
      } else {
        const error = await res.json()
        message.error(error.error || 'Failed to create folder')
      }
    } catch (error) {
      message.error('Failed to create folder')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBoard = async (values: { name: string; description?: string }) => {
    setLoading(true)
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          projectId,
        }),
      })

      if (res.ok) {
        message.success('Phalakam created successfully')
        form.resetFields()
        setIsModalOpen(false)
        fetchProject()
      } else {
        const error = await res.json()
        message.error(error.error || 'Failed to create phalakam')
      }
    } catch (error) {
      message.error('Failed to create phalakam')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (type: 'folder' | 'board') => {
    setModalType(type)
    setIsModalOpen(true)
  }

  if (fetchLoading) {
    return (
      <AppShell>
        <div style={{ textAlign: 'center', padding: '48px' }}>Loading...</div>
      </AppShell>
    )
  }

  if (!project) {
    return (
      <AppShell>
        <Empty description="Project not found" />
      </AppShell>
    )
  }

  const hasContent = project.folders.length > 0 || project.boards.length > 0

  return (
    <AppShell>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              title: <Link href="/"><HomeOutlined /> Projects</Link>,
            },
            {
              title: project.name,
            },
          ]}
        />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>{project.name}</Title>
            {project.description && (
              <Typography.Text type="secondary">{project.description}</Typography.Text>
            )}
          </div>
          <Space>
            <Button
              icon={<FolderOutlined />}
              onClick={() => openModal('folder')}
            >
              New Folder
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal('board')}
            >
              New Phalakam
            </Button>
          </Space>
        </div>

        {/* Content */}
        {!hasContent ? (
          <Empty
            description="No folders or phalakams yet"
            style={{ padding: '48px' }}
          >
            <Space>
              <Button icon={<FolderOutlined />} onClick={() => openModal('folder')}>
                Create Folder
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal('board')}>
                Create Phalakam
              </Button>
            </Space>
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {/* Folders */}
            {project.folders.map((folder) => (
              <Col xs={24} sm={12} md={8} lg={6} key={folder.id}>
                <Link href={`/folders/${folder.id}`} style={{ textDecoration: 'none' }}>
                  <Card
                    hoverable
                    style={{ height: '100%' }}
                    cover={
                      <div style={{ padding: '40px', textAlign: 'center', background: '#fff7e6' }}>
                        <FolderOpenOutlined style={{ fontSize: '48px', color: '#faad14' }} />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={folder.name}
                      description={
                        folder.description ||
                        `${folder._count?.subFolders || 0} folders, ${folder._count?.boards || 0} phalakams`
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}

            {/* Boards */}
            {project.boards.map((board) => (
              <Col xs={24} sm={12} md={8} lg={6} key={board.id}>
                <Link href={`/boards/${board.id}`} style={{ textDecoration: 'none' }}>
                  <Card
                    hoverable
                    style={{ height: '100%' }}
                    cover={
                      <div style={{ padding: '40px', textAlign: 'center', background: '#f0f5ff' }}>
                        <FileOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                      </div>
                    }
                  >
                    <Card.Meta
                      title={board.name}
                      description={board.description || 'Phalakam'}
                    />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}

        {/* Create Modal */}
        <Modal
          title={modalType === 'folder' ? 'Create Folder' : 'Create Phalakam'}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={modalType === 'folder' ? handleCreateFolder : handleCreateBoard}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter a name' }]}
            >
              <Input placeholder={modalType === 'folder' ? 'Character Design' : 'Main Characters'} />
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