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
                  />
                </Link>
              </Col>
            ))}

            {project.boards.map((board) => (
              <Col key={board.id}>
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
      </AppShell>
    </ErrorBoundary>
  );
}
