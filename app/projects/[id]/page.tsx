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
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useModalState } from "@/hooks/useModalState";

const { TextArea } = Input;

interface Folder {
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

interface Project {
  id: string;
  name: string;
  description: string | null;
  folders: Folder[];
  boards: Board[];
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"folder" | "phalak">("folder");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [form] = Form.useForm();

  // Delete modal state
  const deleteModal = useModalState();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    type: "folder" | "phalak";
    folderCount?: number;
    phalakCount?: number;
  } | null>(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    const startTime = performance.now();

    try {
      setFetchLoading(true);
      const fetchStart = performance.now();
      const res = await fetch(`/api/projects/${projectId}`);
      const fetchEnd = performance.now();

      if (!res.ok) throw new Error("Failed to fetch project");

      const parseStart = performance.now();
      const data = await res.json();
      const parseEnd = performance.now();

      setProject(data);

      const totalTime = performance.now() - startTime;
      console.log(`[Client Performance] Project ${projectId}:`, {
        fetchTime: `${(fetchEnd - fetchStart).toFixed(2)}ms`,
        parseTime: `${(parseEnd - parseStart).toFixed(2)}ms`,
        totalTime: `${totalTime.toFixed(2)}ms`,
      });
    } catch (error) {
      message.error("Failed to fetch project");
      console.error(error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleCreateFolder = async (values: {
    name: string;
    description?: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          projectId,
        }),
      });

      if (res.ok) {
        message.success("Folder created successfully");
        form.resetFields();
        setIsModalOpen(false);
        fetchProject();
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
    setLoading(true);
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          projectId,
        }),
      });

      if (res.ok) {
        message.success("Phalak created successfully");
        form.resetFields();
        setIsModalOpen(false);
        fetchProject();
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

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [editingType, setEditingType] = useState<"folder" | "phalak">("folder");

  // Context menu handlers
  const handleDelete = (id: string, type: "folder" | "phalak") => {
    if (type === "folder") {
      const folder = project?.folders.find((f) => f.id === id);
      if (folder) {
        setDeleteTarget({
          id,
          name: folder.name,
          type,
          folderCount: folder._count?.subFolders || 0,
          phalakCount: folder._count?.boards || 0,
        });
        deleteModal.open();
      }
    } else {
      const board = project?.boards.find((b) => b.id === id);
      if (board) {
        setDeleteTarget({
          id,
          name: board.name,
          type,
        });
        deleteModal.open();
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const endpoint =
      deleteTarget.type === "folder"
        ? `/api/folders/${deleteTarget.id}`
        : `/api/boards/${deleteTarget.id}`;

    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to delete ${deleteTarget.type === "folder" ? "folder" : "phalak"}`,
        );
      }

      message.success(
        `${deleteTarget.type === "folder" ? "Folder" : "Phalak"} deleted successfully`,
      );
      deleteModal.close();
      setDeleteTarget(null);
      fetchProject();
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      message.error(err.message);
      console.error(
        `Error deleting ${deleteTarget.type === "folder" ? "folder" : "phalak"}:`,
        err,
      );
    }
  };

  const handleRename = (
    id: string,
    name: string,
    type: "folder" | "phalak",
  ) => {
    setEditingId(id);
    setEditingName(name);
    setEditingType(type);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleEditSave = async (id: string) => {
    const trimmedName = editingName.trim();

    if (!trimmedName) {
      message.error("Name cannot be empty");
      return;
    }

    const endpoint =
      editingType === "folder" ? `/api/folders/${id}` : `/api/boards/${id}`;

    try {
      await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      message.success(
        `${editingType === "folder" ? "Folder" : "Phalak"} renamed successfully`,
      );
      setEditingId(null);
      setEditingName("");
      fetchProject();
    } catch (error) {
      message.error(`Failed to rename ${editingType}`);
      console.error(`Error renaming ${editingType}:`, error);
    }
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
          <LoadingState message="Loading project..." />
        </AppShell>
      </ErrorBoundary>
    );
  }

  if (!project) {
    return (
      <ErrorBoundary>
        <AppShell heading="Project Not Found">
          <Empty description="Project not found" />
        </AppShell>
      </ErrorBoundary>
    );
  }

  const hasContent = project.folders.length > 0 || project.boards.length > 0;

  return (
    <ErrorBoundary>
      <AppShell
        heading={project.name}
        breadcrumbs={[
          {
            title: (
              <Link href="/">
                <HomeOutlined /> Home
              </Link>
            ),
          },
          { title: project.name },
        ]}
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
            description="No folders or phalaks yet"
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
            {project.folders.map((folder) => (
              <Col key={folder.id}>
                <ContextMenu
                  onDelete={() => handleDelete(folder.id, "folder")}
                  onRename={() =>
                    handleRename(folder.id, folder.name, "folder")
                  }
                  onCopy={() => handleCopy(folder.id, "folder")}
                  onCut={() => handleCut(folder.id, "folder")}
                  onPaste={() => handlePaste(folder.id, "folder")}
                >
                  <Link
                    href={`/folders/${folder.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <ProjectCard
                      id={folder.id}
                      name={folder.name}
                      description={folder.description}
                      phalakCount={folder._count?.boards || 0}
                      subFolderCount={folder._count?.subFolders || 0}
                      type="folder"
                      isEditing={editingId === folder.id}
                      editingName={editingName}
                      onEditingNameChange={setEditingName}
                      onEditSave={() => handleEditSave(folder.id)}
                      onEditCancel={handleEditCancel}
                    />
                  </Link>
                </ContextMenu>
              </Col>
            ))}

            {project.boards.map((board) => (
              <Col key={board.id}>
                <ContextMenu
                  onDelete={() => handleDelete(board.id, "phalak")}
                  onRename={() => handleRename(board.id, board.name, "phalak")}
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
                      isEditing={editingId === board.id}
                      editingName={editingName}
                      onEditingNameChange={setEditingName}
                      onEditSave={() => handleEditSave(board.id)}
                      onEditCancel={handleEditCancel}
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
                  modalType === "folder"
                    ? "Character Design"
                    : "Main Characters"
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

        <ConfirmationModal
          open={deleteModal.isOpen}
          title={
            deleteTarget?.type === "folder"
              ? "Delete Folder?"
              : "Delete Phalak?"
          }
          description={
            deleteTarget ? (
              <>
                {deleteTarget.type === "folder" ? (
                  <>
                    <p>
                      Are you sure you want to delete{" "}
                      <strong>{deleteTarget.name}</strong>?
                    </p>
                    {(deleteTarget.folderCount! > 0 ||
                      deleteTarget.phalakCount! > 0) && (
                      <p>
                        This folder contains:
                        {deleteTarget.folderCount! > 0 && (
                          <span> {deleteTarget.folderCount} subfolder(s)</span>
                        )}
                        {deleteTarget.folderCount! > 0 &&
                          deleteTarget.phalakCount! > 0 &&
                          " and"}
                        {deleteTarget.phalakCount! > 0 && (
                          <span> {deleteTarget.phalakCount} phalak(s)</span>
                        )}
                      </p>
                    )}
                  </>
                ) : (
                  <p>
                    Are you sure you want to delete{" "}
                    <strong>{deleteTarget.name}</strong>?
                  </p>
                )}
                <p>
                  <strong>This action cannot be undone.</strong>
                </p>
              </>
            ) : (
              ""
            )
          }
          confirmText="Delete"
          cancelText="Cancel"
          danger
          onConfirm={handleConfirmDelete}
          onCancel={deleteModal.close}
        />
      </AppShell>
    </ErrorBoundary>
  );
}
