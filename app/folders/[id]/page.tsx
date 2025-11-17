"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button, Row, Col, Modal, Form, Input, message, Empty } from "antd";
import { PlusOutlined, FolderOutlined, HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import ProjectCard from "@/components/ui/ProjectCard";
import LoadingState from "@/components/ui/LoadingState";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import ContextMenu from "@/components/ui/ContextMenu";

const { TextArea } = Input;

interface SubFolder {
  id: string;
  name: string;
  description: string | null;
  _count?: {
    boards: number;
    subFolders: number;
  };
}

interface Board {
  id: string;
  name: string;
  description: string | null;
}

interface Folder {
  id: string;
  name: string;
  description: string | null;
  projectId: string;
  parentFolderId: string | null;
  subFolders: SubFolder[];
  boards: Board[];
  project: {
    id: string;
    name: string;
  };
  parentFolder: {
    id: string;
    name: string;
  } | null;
}

export default function FolderPage() {
  const params = useParams();
  const folderId = params.id as string;

  const [folder, setFolder] = useState<Folder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"folder" | "phalak">("folder");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFolder();
  }, [folderId]);

  const fetchFolder = async () => {
    try {
      setFetchLoading(true);
      const res = await fetch(`/api/folders/${folderId}`);
      if (!res.ok) throw new Error("Failed to fetch folder");
      const data = await res.json();
      setFolder(data);
    } catch (error) {
      message.error("Failed to fetch folder");
      console.error(error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleCreateFolder = async (values: {
    name: string;
    description?: string;
  }) => {
    if (!folder) return;
    setLoading(true);
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          projectId: folder.projectId,
          parentFolderId: folder.id,
        }),
      });

      if (res.ok) {
        message.success("Folder created successfully");
        form.resetFields();
        setIsModalOpen(false);
        fetchFolder();
      } else {
        const error = await res.json();
        message.error(error.error || "Failed to create folder");
      }
    } catch (error) {
      message.error("Failed to create folder");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePhalak = async (values: {
    name: string;
    description?: string;
  }) => {
    if (!folder) return;
    setLoading(true);
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          projectId: folder.projectId,
          folderId: folder.id,
        }),
      });

      if (res.ok) {
        message.success("Phalak created successfully");
        form.resetFields();
        setIsModalOpen(false);
        fetchFolder();
      } else {
        const error = await res.json();
        message.error(error.error || "Failed to create phalak");
      }
    } catch (error) {
      message.error("Failed to create phalak");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: "folder" | "phalak") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  // Context menu handlers (placeholders for now)
  const handleDelete = (id: string, type: "folder" | "phalak") => {
    console.log(`Delete ${type}:`, id);
    // TODO: Implement delete functionality
  };

  const handleRename = (id: string, type: "folder" | "phalak") => {
    console.log(`Rename ${type}:`, id);
    // TODO: Implement rename functionality
  };

  const handleCopy = (id: string, type: "folder" | "phalak") => {
    console.log(`Copy ${type}:`, id);
    // TODO: Implement copy functionality
  };

  const handleCut = (id: string, type: "folder" | "phalak") => {
    console.log(`Cut ${type}:`, id);
    // TODO: Implement cut functionality
  };

  const handlePaste = (id: string, type: "folder" | "phalak") => {
    console.log(`Paste ${type}:`, id);
    // TODO: Implement paste functionality
  };

  if (fetchLoading) {
    return (
      <ErrorBoundary>
        <AppShell heading="Loading...">
          <LoadingState message="Loading folder..." />
        </AppShell>
      </ErrorBoundary>
    );
  }

  if (!folder) {
    return (
      <ErrorBoundary>
        <AppShell heading="Folder Not Found">
          <Empty description="Folder not found" />
        </AppShell>
      </ErrorBoundary>
    );
  }

  const hasContent = folder.subFolders.length > 0 || folder.boards.length > 0;

  // Build breadcrumbs
  const breadcrumbs = [
    {
      title: (
        <Link href="/">
          <HomeOutlined /> Home
        </Link>
      ),
    },
    {
      title: (
        <Link href={`/projects/${folder.project.id}`}>
          {folder.project.name}
        </Link>
      ),
    },
  ];

  if (folder.parentFolder) {
    breadcrumbs.push({
      title: (
        <Link href={`/folders/${folder.parentFolder.id}`}>
          {folder.parentFolder.name}
        </Link>
      ),
    });
  }

  breadcrumbs.push({ title: <span>{folder.name}</span> });

  return (
    <ErrorBoundary>
      <AppShell
        heading={folder.project.name}
        breadcrumbs={breadcrumbs}
        actions={[
          {
            label: "+ New Folders",
            icon: <FolderOutlined />,
            onClick: () => openModal("folder"),
            type: "default",
          },
          {
            label: "+ New Phalaks",
            icon: <PlusOutlined />,
            onClick: () => openModal("phalak"),
            type: "default",
          },
        ]}
      >
        {!hasContent ? (
          <Empty
            description="No subfolders or phalaks yet"
            style={{ padding: "48px" }}
          >
            <Button
              icon={<FolderOutlined />}
              onClick={() => openModal("folder")}
            >
              Create Folder
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal("phalak")}
              style={{ marginLeft: 8 }}
            >
              Create Phalak
            </Button>
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {folder.subFolders.map((subfolder) => (
              <Col key={subfolder.id}>
                <ContextMenu
                  onDelete={() => handleDelete(subfolder.id, "folder")}
                  onRename={() => handleRename(subfolder.id, "folder")}
                  onCopy={() => handleCopy(subfolder.id, "folder")}
                  onCut={() => handleCut(subfolder.id, "folder")}
                  onPaste={() => handlePaste(subfolder.id, "folder")}
                >
                  <Link
                    href={`/folders/${subfolder.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <ProjectCard
                      id={subfolder.id}
                      name={subfolder.name}
                      description={subfolder.description}
                      phalakCount={subfolder._count?.boards || 0}
                      subFolderCount={subfolder._count?.subFolders || 0}
                      type="folder"
                    />
                  </Link>
                </ContextMenu>
              </Col>
            ))}

            {folder.boards.map((board) => (
              <Col key={board.id}>
                <ContextMenu
                  onDelete={() => handleDelete(board.id, "phalak")}
                  onRename={() => handleRename(board.id, "phalak")}
                  onCopy={() => handleCopy(board.id, "phalak")}
                  onCut={() => handleCut(board.id, "phalak")}
                  onPaste={() => handlePaste(board.id, "phalak")}
                >
                  <Link
                    href={`/boards/${board.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <ProjectCard
                      id={board.id}
                      name={board.name}
                      description={board.description}
                      type="phalak"
                    />
                  </Link>
                </ContextMenu>
              </Col>
            ))}
          </Row>
        )}

        <Modal
          title={modalType === "folder" ? "Create Folder" : "Create Phalak"}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={
              modalType === "folder" ? handleCreateFolder : handleCreatePhalak
            }
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter a name" }]}
            >
              <Input
                placeholder={
                  modalType === "folder" ? "Act Structure" : "Three Acts"
                }
              />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <TextArea rows={3} placeholder="Optional description" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ marginRight: 8 }}
              >
                Create
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            </Form.Item>
          </Form>
        </Modal>
      </AppShell>
    </ErrorBoundary>
  );
}
