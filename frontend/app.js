const textInput = document.getElementById('text-input');
const counter = document.getElementById('counter');
const analyzeBtn = document.getElementById('analyze-btn');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');
const reportPanel = document.getElementById('report-panel');
const summaryBar = document.getElementById('summary-bar');
const errorsList = document.getElementById('errors-list');
const correctedPanel = document.getElementById('corrected-panel');
const correctedText = document.getElementById('corrected-text');
const copyBtn = document.getElementById('copy-btn');

const API_BASE = '';

const TYPE_COLORS = {
  ortografía: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  gramática: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  puntuación: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  semántica: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  estilo: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
};

const TYPE_LABELS = {
  ortografía: 'Ortografía',
  gramática: 'Gramática',
  puntuación: 'Puntuación',
  semántica: 'Semántica',
  estilo: 'Estilo',
};

textInput.addEventListener('input', updateCounter);
analyzeBtn.addEventListener('click', handleAnalyze);
copyBtn.addEventListener('click', handleCopy);

function updateCounter() {
  const len = textInput.value.length;
  counter.textContent = `${len} caracteres`;
}

function setLoading(isLoading) {
  loading.classList.toggle('hidden', !isLoading);
  analyzeBtn.disabled = isLoading;
  analyzeBtn.textContent = isLoading ? 'Analizando...' : 'Analizar';
  errorMessage.classList.add('hidden');
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}

function validate() {
  const text = textInput.value.trim();
  if (text.length < 20) {
    showError(`El texto debe tener al menos 20 caracteres (tiene ${text.length})`);
    return null;
  }
  if (text.length > 5000) {
    showError(`El texto no puede exceder 5000 caracteres (tiene ${text.length})`);
    return null;
  }
  errorMessage.classList.add('hidden');
  return text;
}

async function handleAnalyze() {
  const text = validate();
  if (!text) return;

  setLoading(true);
  reportPanel.classList.add('hidden');
  correctedPanel.classList.add('hidden');

  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || `Error ${res.status}`);
    }

    const data = await res.json();
    renderReport(data);
    renderCorrected(data);
  } catch (err) {
    showError('Error al analizar el texto. Verifica que el servidor esté corriendo e intenta de nuevo.');
  } finally {
    setLoading(false);
  }
}

function renderReport(data) {
  const { errors, summary } = data;

  let summaryHtml = '';
  if (errors.length === 0) {
    summaryHtml = '<p class="text-green-600 font-medium">No se encontraron errores.</p>';
  } else {
    const parts = [];
    for (const [type, count] of Object.entries(summary.by_type)) {
      if (count > 0) parts.push(`${count} de ${TYPE_LABELS[type] || type}`);
    }
    summaryHtml = `<p class="text-gray-700 font-medium">${summary.total} ${
      summary.total === 1 ? 'error encontrado' : 'errores encontrados'
    }: ${parts.join(', ')}</p>`;
  }
  summaryBar.innerHTML = summaryHtml;

  let cardsHtml = '';
  errors.forEach((err) => {
    const colors = TYPE_COLORS[err.type] || TYPE_COLORS.ortografia;
    const label = TYPE_LABELS[err.type] || err.type;
    cardsHtml += `
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="${colors.bg} ${colors.text} text-xs font-medium px-2.5 py-0.5 rounded-full">${label}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-gray-400 text-xs">Original</span>
            <p class="text-gray-800 line-through decoration-red-400">${escapeHtml(err.original)}</p>
          </div>
          <div>
            <span class="text-gray-400 text-xs">Corrección</span>
            <p class="text-green-700 font-medium">${escapeHtml(err.correction)}</p>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">${escapeHtml(err.explanation)}</p>
      </div>
    `;
  });
  errorsList.innerHTML = cardsHtml;

  reportPanel.classList.remove('hidden');
}

function renderCorrected(data) {
  correctedText.textContent = data.corrected_text;
  correctedPanel.classList.remove('hidden');
  correctedPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleCopy() {
  navigator.clipboard.writeText(correctedText.textContent).then(() => {
    const orig = copyBtn.textContent;
    copyBtn.textContent = '¡Copiado!';
    setTimeout(() => { copyBtn.textContent = orig; }, 2000);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
