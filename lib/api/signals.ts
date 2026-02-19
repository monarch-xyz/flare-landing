import { createApiClient } from '@/lib/api/client';
import { Signal, SignalListResponse, SignalLogsResponse } from '@/lib/types/signal';

const client = createApiClient();

export const listSignals = () => client.get<SignalListResponse>('/api/v1/signals');

export const getSignal = (id: string) => client.get<Signal>(`/api/v1/signals/${id}`);

export const createSignal = (payload: Signal) => client.post<Signal, Signal>('/api/v1/signals', payload);

export const updateSignal = (id: string, payload: Partial<Signal>) =>
  client.patch<Signal, Partial<Signal>>(`/api/v1/signals/${id}`, payload);

export const deleteSignal = (id: string) => client.del<void>(`/api/v1/signals/${id}`);

export const simulateSignal = (id: string) => client.post<Record<string, unknown>, Record<string, unknown>>(`/api/v1/signals/${id}/simulate`, {});

export const getSignalLogs = (id: string) => client.get<SignalLogsResponse>(`/api/v1/signals/${id}/logs`);
