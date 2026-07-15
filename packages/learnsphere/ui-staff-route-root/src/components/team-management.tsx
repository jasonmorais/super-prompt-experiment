import { DeleteOutlined, EditOutlined, PlusOutlined, TeamOutlined, UndoOutlined, UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import type { StaffTeamsQuery } from '../generated.tsx';

const { Title, Text } = Typography;
type Team = StaffTeamsQuery['teams'][number];
type Person = { learnerId: string; learnerDisplayName: string; learnerEmail: string; teamName: string; assignmentId?: string | null; status?: string | null };
type Course = StaffTeamsQuery['courses'][number];
type Member = Team['members'][number];

export interface TeamManagementProps {
	teams: Team[];
	people: Person[];
	courses: Course[];
	onCreate: (name: string) => Promise<void>;
	onRename: (id: string, name: string) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
	onMembers: (id: string, members: Member[]) => Promise<void>;
	onLeads: (id: string, leads: string[]) => Promise<void>;
	onAssign: (teamId: string, courseId: string, dueAt?: string) => Promise<void>;
	onUnassign: (assignmentId: string) => Promise<void>;
}

const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

export const TeamManagement = ({ teams, people, courses, onCreate, onRename, onDelete, onMembers, onLeads, onAssign, onUnassign }: TeamManagementProps) => {
	const [open, setOpen] = useState<'create' | 'edit' | 'assign' | 'add-person'>();
	const [selected, setSelected] = useState<Team>();
	const [form] = Form.useForm();
	const uniquePeople = [...new Map(people.map((person) => [person.learnerId, person])).values()];
	const close = () => { setOpen(undefined); setSelected(undefined); form.resetFields(); };
	return <>
		<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 28 }}>
			<div><Text style={{ color: '#6d4aff', fontWeight: 750, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: 12 }}>Organization</Text><Title style={{ margin: '6px 0' }}>Team management</Title><Text type="secondary">Create teams, see every member, choose team leads, and assign team-wide learning.</Text></div>
			<Space wrap><Button icon={<UserAddOutlined />} style={{ color: '#6d4aff', borderColor: '#cfc5ff' }} onClick={() => { form.resetFields(); setOpen('add-person'); }}>Add person</Button><Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setOpen('create'); }}>New team</Button></Space>
		</div>
		<Row gutter={[20, 20]}>{teams.map((team) => {
			const assignmentIds = [...new Set(people.filter((person) => person.teamName === team.name && person.assignmentId && person.status !== 'COMPLETED').map((person) => person.assignmentId as string))];
			return <Col xs={24} lg={12} key={team.id}><Card style={{ height: '100%', borderRadius: 18, border: '1px solid #e5e6ee' }} title={<Space><span style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', borderRadius: 10, color: '#6d4aff', background: '#eeeaff' }}><TeamOutlined /></span><span>{team.name}</span><Tag bordered={false} color="purple">{team.members.length} members</Tag></Space>} extra={<Space size={6}><Button size="small" icon={<EditOutlined />} style={{ color: '#6d4aff', borderColor: '#cfc5ff' }} onClick={() => { setSelected(team); form.setFieldsValue({ name: team.name, members: team.members.map((member) => member.learnerId), leads: team.teamLeadIds }); setOpen('edit'); }}>Edit team</Button><Button size="small" danger icon={<DeleteOutlined />} onClick={() => Modal.confirm({ title: `Delete ${team.name}?`, content: 'Existing records remain available and are moved to Unassigned.', okText: 'Delete team', okButtonProps: { danger: true }, onOk: () => onDelete(team.id) })} /></Space>}>
				<Space direction="vertical" size="middle" style={{ width: '100%' }}><div><Text type="secondary">Team leads</Text><div style={{ marginTop: 5 }}>{team.teamLeadIds.length ? team.teamLeadIds.map((id) => team.members.find((member) => member.learnerId === id)?.displayName ?? id).join(', ') : <Text type="secondary">No leads selected</Text>}</div></div><div style={{ borderTop: '1px solid #edf0f4', paddingTop: 14 }}><Text type="secondary">Members</Text><Space direction="vertical" size={8} style={{ width: '100%', marginTop: 9 }}>{team.members.length ? team.members.map((member) => <div key={member.learnerId} style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar size={32} style={{ background: '#d9d1ff', color: '#3e278f', fontSize: 12 }}>{initials(member.displayName)}</Avatar><div style={{ minWidth: 0, flex: 1 }}><div style={{ fontWeight: 650 }}>{member.displayName}{team.teamLeadIds.includes(member.learnerId) && <Tag bordered={false} color="purple" style={{ marginLeft: 7 }}>Lead</Tag>}</div><Text type="secondary" style={{ fontSize: 12 }}>{member.email}</Text></div></div>) : <Text type="secondary">No members yet. Add a person to get started.</Text>}</Space></div><Space wrap><Button type="primary" ghost icon={<PlusOutlined />} onClick={() => { setSelected(team); form.resetFields(); setOpen('assign'); }}>Assign course to team</Button>{assignmentIds.map((assignmentId) => <Button key={assignmentId} type="link" icon={<UndoOutlined />} style={{ padding: 0, color: '#6d4aff' }} onClick={() => onUnassign(assignmentId)}>Undo team assignment</Button>)}</Space></Space>
			</Card></Col>;
		})}</Row>
		<Modal title={open === 'create' ? 'Create team' : open === 'assign' ? `Assign course · ${selected?.name ?? ''}` : open === 'add-person' ? 'Add a person to a team' : `Edit team · ${selected?.name ?? ''}`} open={Boolean(open)} onCancel={close} onOk={() => form.submit()} okText={open === 'edit' ? 'Save team' : open === 'add-person' ? 'Add person' : open === 'assign' ? 'Assign course' : 'Create team'}>
			<Form form={form} layout="vertical" onFinish={async (values) => { if (open === 'create') await onCreate(values.name); if (open === 'add-person') { const team = teams.find((candidate) => candidate.id === values.teamId); if (team) await onMembers(team.id, [...team.members, { learnerId: values.learnerId, displayName: values.displayName, email: values.email }]); } if (open === 'edit' && selected) { const members = uniquePeople.filter((person) => values.members?.includes(person.learnerId)).map(({ learnerId, learnerDisplayName, learnerEmail }) => ({ learnerId, displayName: learnerDisplayName, email: learnerEmail })); await onRename(selected.id, values.name); await onMembers(selected.id, members); await onLeads(selected.id, values.leads ?? []); } if (open === 'assign' && selected) await onAssign(selected.id, values.courseId, values.dueAt?.toISOString()); close(); }}>
				{open === 'create' && <Form.Item name="name" label="Team name" rules={[{ required: true, min: 2 }]}><Input /></Form.Item>}
				{open === 'add-person' && <><Form.Item name="teamId" label="Team" rules={[{ required: true }]}><Select options={teams.map((team) => ({ value: team.id, label: team.name }))} /></Form.Item><Form.Item name="learnerId" label="Learner ID" rules={[{ required: true }]}><Input placeholder="Identity subject or learner ID" /></Form.Item><Form.Item name="displayName" label="Name" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item></>}
				{open === 'edit' && <><Form.Item name="name" label="Team name" rules={[{ required: true, min: 2 }]}><Input /></Form.Item><Form.Item name="members" label="Members"><Select mode="multiple" showSearch optionFilterProp="label" options={uniquePeople.map((person) => ({ value: person.learnerId, label: `${person.learnerDisplayName} · ${person.learnerEmail}` }))} /></Form.Item><Form.Item name="leads" label="Team leads"><Select mode="multiple" options={uniquePeople.filter((person) => form.getFieldValue('members')?.includes(person.learnerId)).map((person) => ({ value: person.learnerId, label: person.learnerDisplayName }))} /></Form.Item></>}
				{open === 'assign' && <><Form.Item name="courseId" label="Published course" rules={[{ required: true }]}><Select showSearch optionFilterProp="label" options={courses.map((course) => ({ value: course.id, label: `${course.title} · ${course.category}` }))} /></Form.Item><Form.Item name="dueAt" label="Due date"><DatePicker style={{ width: '100%' }} /></Form.Item></>}
			</Form>
		</Modal>
	</>;
};
