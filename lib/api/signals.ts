import { createApiClient } from '@/lib/api/client';
import {
  CreateSignalRequest,
  SignalHistoryResponse,
  SignalRecord,
  UpdateSignalRequest,
} from '@/lib/types/signal';

const client = createApiClient({ baseUrl: '' });

export const listSignals = () => client.get<SignalRecord[]>('/api/megabat/signals');

export const getSignal = (id: string) => client.get<SignalRecord>(`/api/megabat/signals/${id}`);

export const createSignal = (payload: CreateSignalRequest) =>
  client.post<SignalRecord, CreateSignalRequest>('/api/megabat/signals', payload);

export const updateSignal = (id: string, payload: UpdateSignalRequest) =>
  client.patch<SignalRecord, UpdateSignalRequest>(`/api/megabat/signals/${id}`, payload);

export const toggleSignal = (id: string) => client.patch<SignalRecord, Record<string, never>>(`/api/megabat/signals/${id}/toggle`, {});

export const deleteSignal = (id: string) => client.del<void>(`/api/megabat/signals/${id}`);

export const simulateSignal = (id: string, payload: Record<string, unknown>) =>
  client.post<Record<string, unknown>, Record<string, unknown>>(`/api/megabat/simulate/${id}/simulate`, payload);

export const findFirstTrigger = (id: string, payload: Record<string, unknown>) =>
  client.post<Record<string, unknown>, Record<string, unknown>>(`/api/megabat/simulate/${id}/first-trigger`, payload);

export const getSignalLogs = (id: string) => client.get<SignalHistoryResponse>(`/api/megabat/signals/${id}/history?include_notifications=true`);

export const getSignalHistory = (id: string) =>
  client.get<SignalHistoryResponse>(`/api/megabat/signals/${id}/history?include_notifications=true`);
