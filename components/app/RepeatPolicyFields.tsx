import type { SignalRepeatPolicyMode } from '@/lib/types/signal';
import { getSignalRepeatPolicyHint } from '@/lib/signals/repeat-policy';

interface RepeatPolicyFieldsProps {
  mode: SignalRepeatPolicyMode;
  cooldownMinutes: string;
  snoozeMinutes: string;
  onModeChange: (mode: SignalRepeatPolicyMode) => void;
  onCooldownMinutesChange: (value: string) => void;
  onSnoozeMinutesChange: (value: string) => void;
}

export function RepeatPolicyFields({
  mode,
  cooldownMinutes,
  snoozeMinutes,
  onModeChange,
  onCooldownMinutesChange,
  onSnoozeMinutesChange,
}: RepeatPolicyFieldsProps) {
  return (
    <>
      <label className="ui-field">
        Repeat behavior
        <select
          value={mode}
          onChange={(event) => onModeChange(event.target.value as SignalRepeatPolicyMode)}
          className="ui-select"
        >
          <option value="cooldown">Cooldown</option>
          <option value="post_first_alert_snooze">Post-first alert snooze</option>
          <option value="until_resolved">Until resolved</option>
        </select>
        <span className="ui-helper">{getSignalRepeatPolicyHint(mode)}</span>
      </label>

      {mode === 'post_first_alert_snooze' ? (
        <label className="ui-field">
          Snooze after first alert (minutes)
          <input
            type="number"
            min="1"
            value={snoozeMinutes}
            onChange={(event) => onSnoozeMinutesChange(event.target.value)}
            className="ui-input"
          />
          <span className="ui-helper">
            Telegram `Why`, `Snooze 1h`, and `Snooze 1d` actions stay backend-managed.
          </span>
        </label>
      ) : mode === 'cooldown' ? (
        <label className="ui-field">
          Cooldown (minutes)
          <input
            type="number"
            min="0"
            value={cooldownMinutes}
            onChange={(event) => onCooldownMinutesChange(event.target.value)}
            className="ui-input"
          />
          <span className="ui-helper">Iruka uses this value only for cooldown repeat mode.</span>
        </label>
      ) : (
        <div className="ui-panel-ghost p-4 text-sm text-secondary">
          Iruka sends one alert per incident, then waits until the signal evaluates false before alerting again.
        </div>
      )}
    </>
  );
}
