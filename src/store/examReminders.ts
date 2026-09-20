import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ExamReminder {
  examId: string
  examName: string
  examDate: string | null // ISO string if real verified date, null if TBA
  isTba: boolean
  reminderType: 'verified_date' | 'announcement'
  enabledAt: string
}

interface ExamRemindersState {
  reminders: Record<string, ExamReminder>
  toggleReminder: (params: {
    examId: string
    examName: string
    examDate: string | null
  }) => { active: boolean; reminder: ExamReminder | null }
  removeReminder: (examId: string) => void
  isReminderActive: (examId: string) => boolean
  getReminder: (examId: string) => ExamReminder | undefined
}

export const useExamRemindersStore = create<ExamRemindersState>()(
  persist(
    (set, get) => ({
      reminders: {},

      toggleReminder: ({ examId, examName, examDate }) => {
        const current = get().reminders[examId]
        if (current) {
          // Toggle OFF
          const next = { ...get().reminders }
          delete next[examId]
          set({ reminders: next })
          return { active: false, reminder: null }
        }

        // Toggle ON
        const isTba = !examDate
        const newReminder: ExamReminder = {
          examId,
          examName,
          examDate: isTba ? null : examDate,
          isTba,
          reminderType: isTba ? 'announcement' : 'verified_date',
          enabledAt: new Date().toISOString(),
        }

        set({
          reminders: {
            ...get().reminders,
            [examId]: newReminder,
          },
        })

        return { active: true, reminder: newReminder }
      },

      removeReminder: (examId: string) => {
        const next = { ...get().reminders }
        delete next[examId]
        set({ reminders: next })
      },

      isReminderActive: (examId: string) => {
        return Boolean(get().reminders[examId])
      },

      getReminder: (examId: string) => {
        return get().reminders[examId]
      },
    }),
    {
      name: 'exam-reminders',
    }
  )
)
