import { createApiClient } from '@/lib/api/client';

const client = createApiClient();

export interface SchemaListResponse {
  items: string[];
}

export const listEventTypes = () => client.get<SchemaListResponse>('/api/v1/schema/events');

export const listEntityTypes = () => client.get<SchemaListResponse>('/api/v1/schema/entities');
