import { useCallback, useEffect, useMemo, useState } from 'react';
import { Status, SyncStatus } from '@generated/prisma';
import { useAppDispatch, useAppSelector } from './redux';
import { updateSelectedSession } from '@/libraries/redux/slices/sessions';
import { generateUUID } from '@/utilities/generators/id';
import { FormSession } from './form/session';
import { POMO_SESSION_LENGTH } from '@/data/constants';

interface UsePomodoroParams {
  durationMinutes: number;
  form: FormSession;
  addSessionToState?: () => void;
  updateState?: () => void;
  handleSubmit?: (operation: any, resetOnSubmit?: boolean) => void;
}

export default function usePomodoro({
  durationMinutes,
  form,
  addSessionToState,
  updateState,
  handleSubmit,
}: UsePomodoroParams) {
  const selectedSession = useAppSelector(
    (state) => state.sessions.selectedSession
  );

  const totalDurationSeconds = useMemo(() => {
    return (
      (durationMinutes && durationMinutes > 0
        ? durationMinutes
        : POMO_SESSION_LENGTH) * 60
    );
  }, [durationMinutes]);

  const [remainingSeconds, setRemainingSeconds] =
    useState(totalDurationSeconds);
  const [state, setState] = useState<Status>(Status.INACTIVE);

  const isActive = state === Status.ACTIVE;

  const dispatch = useAppDispatch();
  const sessionUser = useAppSelector((state) => state.session.value);

  // Strict per-second decrement
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const startTimer = useCallback(async () => {
    const creationDate = new Date();

    if (!selectedSession) {
      // First start → create a new session
      dispatch(
        updateSelectedSession({
          id: generateUUID(),
          title: form.values.title || '',
          start: form.values.properties?.start,
          end: '' as any,
          status: Status.ACTIVE,
          duration: durationMinutes,
          pomo_duration: 0,
          profile_id: sessionUser?.id || '',
          task_id: form.values.properties?.task_id || '',
          category_id: form.values.properties?.category_id || 'inbox',
          sync_status: SyncStatus.PENDING,
          created_at: creationDate.toISOString() as any,
          updated_at: creationDate.toISOString() as any,
        } as any)
      );

      if (handleSubmit) {
        await handleSubmit(addSessionToState, true);
      }
    } else {
      // Resume → just update existing session status
      dispatch(
        updateSelectedSession({
          ...selectedSession,
          status: Status.ACTIVE,
          updated_at: creationDate.toISOString() as any,
        } as any)
      );
    }

    setState(Status.ACTIVE);
  }, [
    selectedSession,
    sessionUser,
    durationMinutes,
    form,
    handleSubmit,
    addSessionToState,
    dispatch,
  ]);

  const pauseTimer = useCallback(() => {
    // update selected session
    dispatch(
      updateSelectedSession({
        ...selectedSession,
        focus_duration: totalDurationSeconds - remainingSeconds,
        sync_status: SyncStatus.PENDING,
        updated_at: new Date().toISOString() as any,
      } as any)
    );

    // update focus duration in form
    form.setFieldValue(
      'properties.focusDuration',
      totalDurationSeconds - remainingSeconds
    );

    // update session state
    if (updateState) updateState();

    setState(Status.PAUSED);
  }, [remainingSeconds, totalDurationSeconds, selectedSession, sessionUser]);

  const resetTimer = useCallback(() => {
    const endDate = new Date();

    console.log('selectedSession', selectedSession);

    if (selectedSession) {
      // Update session with final values
      dispatch(
        updateSelectedSession({
          ...selectedSession,
          end: endDate.toISOString() as any,
          focus_duration: totalDurationSeconds - remainingSeconds,
          title: form.values.title || selectedSession.title,
          sync_status: SyncStatus.PENDING,
          updated_at: endDate.toISOString() as any,
        } as any)
      );

      // Also persist in sessions array
      if (updateState) updateState();
    }

    // Clear selected session
    dispatch(updateSelectedSession(null));

    // Reset form & timer
    form.reset();
    setRemainingSeconds(totalDurationSeconds);
    setState(Status.INACTIVE);
  }, [
    selectedSession,
    totalDurationSeconds,
    remainingSeconds,
    form,
    updateState,
    dispatch,
  ]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return {
    minutes,
    seconds,
    state,
    startTimer,
    pauseTimer,
    resetTimer,
  };
}
