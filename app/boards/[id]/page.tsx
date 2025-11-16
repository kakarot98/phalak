'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button, Modal, Form, Input, message, Breadcrumb, Empty } from 'antd'
import { HomeOutlined, FolderOutlined, UndoOutlined, QuestionCircleOutlined, SearchOutlined, BellOutlined, SettingOutlined, ShareAltOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import BoardCanvas from '@/components/canvas/BoardCanvas'
import CanvasCard from '@/components/canvas/CanvasCard'
import TextCard from '@/components/cards/TextCard'

const { TextArea } = Input

interface Card {
  id: string
  type: string
  title: string | null
  content: string | null
  positionX: number
  positionY: number
  width: number
  height: number | null
  zIndex: number
  color: string | null
  boardId: string
}

interface Board {
  id: string
  name: string
  description: string | null
  projectId: string
  folderId: string | null
  cards: Card[]
  project: {
    id: string
    name: string
  }
  folder: {
    id: string
    name: string
  } | null
}

export default function BoardPage() {
  const params = useParams()
  const boardId = params.id as string

  const [board, setBoard] = useState<Board | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cardType, setCardType] = useState<string>('TEXT')
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

  const handleCreateCard = async (values: { title: string; body: string }) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/boards/${boardId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TEXT',
          title: values.title,
          content: JSON.stringify({
            richText: values.body
          }),
          positionX: 100 + Math.random() * 200,
          positionY: 100 + Math.random() * 200,
          width: 280
        }),
      })

      if (res.ok) {
        message.success('Card created successfully')
        form.resetFields()
        setIsModalOpen(false)
        fetchBoard()
      } else {
        const error = await res.json()
        message.error(error.error || 'Failed to create card')
      }
    } catch (error) {
      message.error('Failed to create card')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCard = useCallback((type: string) => {
    setCardType(type)
    setIsModalOpen(true)
  }, [])

  const handleCardMove = useCallback(async (cardId: string, deltaX: number, deltaY: number) => {
    // Find the card
    const card = board?.cards.find(c => c.id === cardId)
    if (!card) return

    // Calculate new position
    const newX = card.positionX + deltaX
    const newY = card.positionY + deltaY

    // Optimistic update
    setBoard(prev => {
      if (!prev) return prev
      return {
        ...prev,
        cards: prev.cards.map(c =>
          c.id === cardId
            ? { ...c, positionX: newX, positionY: newY }
            : c
        )
      }
    })

    // Update on server
    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionX: newX,
          positionY: newY
        })
      })

      if (!res.ok) {
        throw new Error('Failed to update position')
      }
    } catch (error) {
      console.error('Failed to update card position:', error)
      // Revert on error
      fetchBoard()
    }
  }, [board])

  if (fetchLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7f5f2'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!board) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7f5f2'
      }}>
        <Empty description="Phalakam not found">
          <Link href="/">
            <Button type="primary">Back to Projects</Button>
          </Link>
        </Empty>
      </div>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar (Milanote style) */}
      <div style={{
        height: '64px',
        background: 'white',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100
      }}>
        {/* Left: Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Breadcrumb
            items={[
              {
                title: <Link href="/"><HomeOutlined /> Projects</Link>,
              },
              {
                title: <Link href={`/projects/${board.project.id}`}>{board.project.name}</Link>,
              },
              ...(board.folder
                ? [{
                    title: <Link href={`/folders/${board.folder.id}`}><FolderOutlined /> {board.folder.name}</Link>,
                  }]
                : []
              ),
              {
                title: board.name,
              },
            ]}
          />
        </div>

        {/* Center: Board Title */}
        <div style={{
          fontSize: '16px',
          fontWeight: 500,
          color: '#333'
        }}>
          {board.name}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button icon={<UndoOutlined />} type="text" />
          <div style={{ color: '#999', cursor: 'pointer' }}>0</div>
          <Button icon={<QuestionCircleOutlined />} type="text" />
          <Button icon={<SearchOutlined />} type="text" />
          <Button icon={<BellOutlined />} type="text" />
          <Button icon={<SettingOutlined />} type="text" />
          <div style={{ width: '1px', height: '24px', background: '#e8e8e8', margin: '0 8px' }} />
          <Button icon={<ShareAltOutlined />}>Share</Button>
          <Button icon={<ExportOutlined />}>Export</Button>
          <Button icon={<EyeOutlined />}>View</Button>
        </div>
      </div>

      {/* Canvas */}
      <BoardCanvas onCardMove={handleCardMove} onAddCard={handleAddCard}>
        {board.cards.map((card) => (
          <CanvasCard
            key={card.id}
            id={card.id}
            x={card.positionX}
            y={card.positionY}
            width={card.width}
            zIndex={card.zIndex}
          >
            <TextCard
              title={card.title}
              content={card.content}
              color={card.color}
            />
          </CanvasCard>
        ))}
      </BoardCanvas>

      {/* Create Card Modal */}
      <Modal
        title="Create Text Note"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateCard}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Card Title" />
          </Form.Item>
          <Form.Item
            name="body"
            label="Content"
            rules={[{ required: true, message: 'Please enter content' }]}
          >
            <TextArea rows={5} placeholder="Your note content..." />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
