import crypto from 'node:crypto';
import type { TeamOperationAttachInput, TeamOperationMutationResult } from '../builder/generated.ts';
import type { GraphContext } from '../context.ts';

const maxAttachmentBytes = 8_000_000;

const sanitizedFileName = (fileName: string): string => fileName.trim().replaceAll(/[^a-zA-Z0-9._-]/g, '_');

export const attachTeamOperation = async (input: TeamOperationAttachInput, context: GraphContext): Promise<TeamOperationMutationResult> => {
	const fileName = sanitizedFileName(input.fileName);
	if (!fileName || fileName.length > 255) return { status: { success: false, errorMessage: 'A valid file name is required' } };

	const content = Buffer.from(input.contentBase64, 'base64');
	if (!content.length || content.length > maxAttachmentBytes) return { status: { success: false, errorMessage: 'Attachments must be smaller than 8 MB' } };

	const blobName = `team-operations/${input.id}/${crypto.randomUUID()}-${fileName}`;
	try {
		await context.blobStorageService.uploadData({ containerName: 'team-attachments', blobName, data: content, httpHeaders: { blobContentType: input.contentType || 'application/octet-stream' } });
		const result = await context.applicationServices.Operations.TeamOperation.attach({ id: input.id, attachment: { id: crypto.randomUUID(), fileName, contentType: input.contentType || 'application/octet-stream', size: content.length, blobName, uploadedBy: context.applicationServices.verifiedUser?.verifiedJwt?.email ?? context.applicationServices.verifiedUser?.verifiedJwt?.sub ?? 'unknown', uploadedAt: new Date() } });
		if (!result) throw new Error('The attachment could not be saved');
		return { status: { success: true }, teamOperation: result };
	} catch (error) {
		await context.blobStorageService.deleteBlob({ containerName: 'team-attachments', blobName }).catch(() => undefined);
		return { status: { success: false, errorMessage: error instanceof Error ? error.message : 'The attachment could not be saved' } };
	}
};
