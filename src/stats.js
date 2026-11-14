// Estatísticas das tarefas — código novo, ainda sem testes.

function summarize(tasks) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pending = total - done;
  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

  return { total, done, pending, completionRate, status: classify(completionRate, total) };
}

function classify(rate, total) {
  if (total === 0) return 'vazio';
  if (rate === 100) return 'concluido';
  if (rate >= 50) return 'em-andamento';
  return 'atrasado';
}

function longestTitle(tasks) {
  if (tasks.length === 0) return null;
  return tasks.reduce((longest, t) => (t.title.length > longest.title.length ? t : longest)).title;
}

function search(tasks, term) {
  if (!term || typeof term !== 'string') {
    throw new Error('Termo de busca inválido');
  }
  const normalized = term.trim().toLowerCase();
  return tasks.filter((t) => t.title.toLowerCase().includes(normalized));
}

module.exports = { summarize, classify, longestTitle, search };
