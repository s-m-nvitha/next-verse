import type { ExamReminder } from '@/store/examReminders'
import { formatDate } from '@/lib/utils'

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported'

export interface NotificationDispatchResult {
  delivered: boolean
  mode: 'service-worker' | 'browser' | 'fallback'
  message: string
}

/**
 * Checks if Notification API is available in the current browser environment.
 */
export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window
}

/**
 * Requests browser notification permission if supported.
 */
export const requestNotificationPermission = async (): Promise<NotificationPermissionState> => {
  if (!isNotificationSupported()) {
    return 'unsupported'
  }

  try {
    if (Notification.permission === 'granted') {
      return 'granted'
    }
    if (Notification.permission === 'denied') {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    return permission as NotificationPermissionState
  } catch {
    return 'unsupported'
  }
}

/**
 * Dispatches an exam reminder notification through the active Service Worker
 * or the standard browser Notification API.
 */
export const dispatchExamReminderNotification = async (
  reminder: ExamReminder
): Promise<NotificationDispatchResult> => {
  const isTba = reminder.isTba || !reminder.examDate

  const title = isTba
    ? `Announcement Reminder: ${reminder.examName}`
    : `Exam Reminder: ${reminder.examName}`

  const body = isTba
    ? `Official exam date is TBA. We will track and alert you once the exam authority publishes the schedule.`
    : `Exam date is ${formatDate(new Date(reminder.examDate!))}. We'll send alerts as the date approaches.`

  if (!isNotificationSupported()) {
    return {
      delivered: false,
      mode: 'fallback',
      message: 'Browser notifications are not supported in this browser.',
    }
  }

  if (Notification.permission !== 'granted') {
    return {
      delivered: false,
      mode: 'fallback',
      message: `Notification permission is ${Notification.permission}.`,
    }
  }

  // 1. Attempt Service Worker showNotification if SW is registered & ready
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration && registration.active) {
        await registration.showNotification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: `exam-reminder-${reminder.examId}`,
          data: {
            examId: reminder.examId,
            reminderType: reminder.reminderType,
          },
        })
        return {
          delivered: true,
          mode: 'service-worker',
          message: 'Notification delivered via Service Worker.',
        }
      }
    }
  } catch (err) {
    console.warn('Service Worker notification failed, falling back to window Notification:', err)
  }

  // 2. Fallback to standard Window Notification API
  try {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: `exam-reminder-${reminder.examId}`,
    })
    return {
      delivered: true,
      mode: 'browser',
      message: 'Notification delivered via standard browser API.',
    }
  } catch (err) {
    return {
      delivered: false,
      mode: 'fallback',
      message: err instanceof Error ? err.message : 'Failed to display notification.',
    }
  }
}
