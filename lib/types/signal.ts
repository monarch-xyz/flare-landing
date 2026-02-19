export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';

export interface Filter {
  field: string;
  op: FilterOperator;
  value: string | number | boolean | string[];
}

export interface EventRef {
  type: 'event';
  event_type: string;
  filters: Filter[];
  field: string;
  aggregation: 'sum' | 'count' | 'avg' | 'min' | 'max';
}

export interface StateRef {
  type: 'state';
  entity_type: string;
  filters: Filter[];
  field: string;
  snapshot?: 'current' | 'window_start';
}

export interface Constant {
  type: 'constant';
  value: number;
}

export interface BinaryExpression {
  type: 'expression';
  operator: 'add' | 'sub' | 'mul' | 'div';
  left: ExpressionNode;
  right: ExpressionNode;
}

export type ExpressionNode = EventRef | StateRef | BinaryExpression | Constant;

export interface Condition {
  type: 'condition';
  left: ExpressionNode;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';
  right: ExpressionNode;
}

export interface SignalDelivery {
  type: 'telegram' | 'discord' | 'webhook';
  target: string;
}

export interface SignalWindow {
  duration: string;
}

export interface Signal {
  id?: string;
  name: string;
  description?: string;
  chains: number[];
  window: SignalWindow;
  condition: Condition;
  conditions?: Condition[];
  logic?: 'AND' | 'OR';
  delivery: SignalDelivery;
  cooldown_minutes?: number;
  is_active?: boolean;
}

export interface SignalListItem {
  id: string;
  name: string;
  is_active: boolean;
  last_triggered?: string | null;
  trigger_count?: number;
}

export interface SignalListResponse {
  signals: SignalListItem[];
  total: number;
}

export interface SignalLogEntry {
  triggered_at: string;
  result: Record<string, unknown>;
  delivered: boolean;
  delivery_type: string;
}

export interface SignalLogsResponse {
  logs: SignalLogEntry[];
}
