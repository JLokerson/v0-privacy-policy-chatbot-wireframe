export const CORRECT_ANSWERS = {
  1: "Yes, both name and biometric data",
  2: "Yes, explicitly stated",
  3: "Yes, but some data may remain",
  4: "Yes, it can be shared with third parties",
  5: "Varies by data type",
}

export function checkAnswer(taskId: number, userAnswer: string): boolean {
  return CORRECT_ANSWERS[taskId as keyof typeof CORRECT_ANSWERS] === userAnswer
}
