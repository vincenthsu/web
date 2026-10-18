/**
 * Match Grind 75's time budget: each problem reserves 1.96 × its duration
 * for solving and review. Select by priority, then display by difficulty.
 * Source: https://www.techinterviewhandbook.org/grind75/ (2026-10-18).
 */
window.buildGrind75Curriculum = (questions, weeks = 8, hours = 8) => {
  if (!Number.isInteger(weeks) || weeks < 1 || weeks > 26 ||
      !Number.isInteger(hours) || hours < 1 || hours > 40) {
    throw new RangeError("學習週數須為 1–26，每週時數須為 1–40 的整數。");
  }
  let remaining = weeks * hours * 60;
  const selected = [];
  for (const question of [...questions].sort((a, b) => a.priority - b.priority)) {
    remaining -= question.mins * 1.96;
    if (remaining < 0) break;
    selected.push(question);
  }
  const difficulty = { Easy: 0, Medium: 1, Hard: 2 };
  selected.sort((a, b) => difficulty[a.difficulty] - difficulty[b.difficulty]);
  let week = 1;
  let spent = 0;
  return selected.map((question) => {
    const duration = question.mins * 1.96;
    if (week < weeks && spent + duration > hours * 60) {
      week++;
      spent = 0;
    }
    spent += duration;
    return { ...question, week };
  });
};
