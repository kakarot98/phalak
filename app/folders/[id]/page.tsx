'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, Button, Row, Col, Modal, Form, Input, message, Typography, Space, Empty, Breadcrumb } from 'antd'
import { PlusOutlined, FolderOutlined, FileOutlined, HomeOutlined, FolderOpenOutlined } from '@ant-design/icons'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'

const { Title } = Typography
const { TextArea} = Input

interface SubFolder {
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

interface Folder {
  id: string
  name: string
  description: string | null
  projectId: string
  parentFolderId: string | null
  subFolders: SubFolder[]
  boards: Board[]
  project: {
    id: string
    name: string
  }
  parentFolder: {
    id: string
    name: string
  } | null
}

export default function FolderPage() {
  const params = useParams()
  const folderId = params.id as string

  const [folder, setFolder] = useState<Folder | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'folder' | 'board'>('folder')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchFolder()
  }, [folderId])

  const fetchFolder = async () => {
    try {
      setFetchLoading(true)
      const res = await fetch(`/api/folders/${folderId}`)
      if (!res.ok) throw new Error('Failed to fetch folder')
      const data = await res.json()
      setFolder(data)
    } catch (error) {
      message.error('Failed to fetch folder')
      console.error(error)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleCreateFolder = async (values: { name: string; description?: string }) => {
    if (!folder) return
    setLoading(true)
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          projectId: folder.projectId,
          parentFolderId: folder.id,
        }),
      })

      if (res.ok) {
        message.success('Folder created successfully')
        form.resetFields()
        setIsModalOpen(false)
        fetchFolder()
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
    if (!folder) return
    setLoading(true)
    try {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          projectId: folder.projectId,
          folderId: folder.id,
        }),
      })

      if (res.ok) {
        message.success('Phalakam created successfully')
        form.resetFields()
        setIsModalOpen(false)
        fetchFolder()
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

  if (!folder) {
    return (
      <AppShell>
        <Empty description="Folder not found" />
      </AppShell>
    )
  }

  const hasContent = folder.subFolders.length > 0 || folder.boards.length > 0

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
              title: <Link href={`/projects/${folder.project.id}`}>{folder.project.name}</Link>,
            },
            ...(folder.parentFolder
              ? [{ title: <Link href={`/folders/${folder.parentFolder.id}`}>{folder.parentFolder.name}</Link> }]
              : []
            ),
            {
              title: folder.name,
            },
          ]}
        />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>{folder.name}</Title>
            {folder.description && (
              <Typography.Text type="secondary">{folder.description}</Typography.Text>
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
            description="No subfolders or phalakams yet"
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
            {/* Subfolders */}
            {folder.subFolders.map((subfolder) => (
              <Col xs={24} sm={12} md={8} lg={6} key={subfolder.id}>
                <Link href={`/folders/${subfolder.id}`} style={{ textDecoration: 'none' }}>
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
                      title={subfolder.name}
                      description={
                        subfolder.description ||
                        `${subfolder._count?.subFolders || 0} folders, ${subfolder._count?.boards || 0} phalakams`
                      }
                    />
                  </Card>
                </Link>
              </Col>
            ))}

            {/* Boards */}
            {folder.boards.map((board) => (
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
              <Input placeholder={modalType === 'folder' ? 'Act Structure' : 'Three Acts'} />
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