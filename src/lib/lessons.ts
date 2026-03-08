export function isLessonUnlocked(index: number, completedFlags: boolean[]) {
  if (index === 0) return true;
  return completedFlags[index - 1] === true;
}

export function firstUnlockedLessonIndex(completedFlags: boolean[]) {
  for (let i = 0; i < completedFlags.length; i += 1) {
    if (isLessonUnlocked(i, completedFlags) && !completedFlags[i]) {
      return i;
    }
  }
  return 0;
}
