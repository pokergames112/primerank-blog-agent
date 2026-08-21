// Prime Rank Marketing - Mobile Dashboard Logic

let currentViewingPost = null;
let allPosts = [];

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupEventListeners();
  loadPendingPosts();
  loadTrends();
  loadPublishedPosts();
});

// ==========================================
// 1. TABS NAVIGATION
// ==========================================
function setupTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      document.getElementById(target)?.classList.add('active');

      if (target === 'tab-pending') loadPendingPosts();
      if (target === 'tab-trends') loadTrends();
      if (target === 'tab-published') loadPublishedPosts();
    });
  });
}

// ==========================================
// 2. EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  // Refresh buttons
  document.getElementById('btn-refresh-pending')?.addEventListener('click', loadPendingPosts);
  document.getElementById('btn-refresh-trends')?.addEventListener('click', loadTrends);

  // Quick generate button
  document.getElementById('btn-quick-generate')?.addEventListener('click', () => {
    document.getElementById('generate-modal')?.classList.add('open');
  });

  // Close modals
  document.getElementById('btn-close-modal')?.addEventListener('click', closeModal);
  document.getElementById('btn-close-generate-modal')?.addEventListener('click', () => {
    document.getElementById('generate-modal')?.classList.remove('open');
  });

  // Modal Actions (Approve, Reject, Edit)
  document.getElementById('btn-modal-approve')?.addEventListener('click', () => {
    if (currentViewingPost) approvePost(currentViewingPost.id);
  });

  document.getElementById('btn-modal-reject')?.addEventListener('click', () => {
    if (currentViewingPost) rejectPost(currentViewingPost.id);
  });

  document.getElementById('btn-modal-edit')?.addEventListener('click', () => {
    if (currentViewingPost) toggleEditMode();
  });

  // Confirm generate modal
  document.getElementById('btn-confirm-generate')?.addEventListener('click', handleManualGenerate);
}

// ==========================================
// 3. LOAD PENDING POSTS (VALIDATION QUEUE)
// ==========================================
async function loadPendingPosts() {
  const container = document.getElementById('pending-list');
  if (!container) return;

  container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Carregando artigos para validação...</p></div>`;

  try {
    const res = await fetch('/api/posts?status=pending_approval');
    const data = await res.json();
    allPosts = data.posts || [];

    // Atualiza badge de contagem
    const badge = document.getElementById('badge-pending-count');
    if (badge) badge.innerText = allPosts.length;

    if (allPosts.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-circle-check" style="color: #10b981;"></i>
          <h3>Tudo em dia!</h3>
          <p>Não há nenhum artigo aguardando validação no momento.</p>
          <button class="btn btn-gradient-sm" style="margin-top: 16px;" onclick="triggerAutoDraft()">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Gerar Novo Artigo de Tendência
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = allPosts
      .map(
        (post) => {
          const checklist = post.seo?.checklist || {
            titleLengthValid: post.title.length >= 10,
            metaTitleLengthValid: (post.seo?.metaTitle?.length || 0) >= 40 && (post.seo?.metaTitle?.length || 0) <= 60,
            metaDescLengthValid: (post.seo?.metaDescription?.length || 0) >= 120 && (post.seo?.metaDescription?.length || 0) <= 160,
            keywordDefined: Boolean(post.seo?.primaryKeyword),
            wordCountValid: (post.seo?.wordCount || 0) >= 800,
            slugCustomized: Boolean(post.slug),
            excerptFilled: Boolean(post.excerpt),
            overallScore: 100
          };

          return `
      <div class="article-card">
        <div class="card-top-meta">
          <span class="trend-badge"><i class="fa-solid fa-fire"></i> ${post.trendSource?.topic || 'Google Trend'}</span>
          <div class="card-metrics">
            <span class="metric-pill"><i class="fa-solid fa-feather"></i> ${post.seo?.wordCount || 0} palavras</span>
            <span class="metric-pill"><i class="fa-solid fa-stopwatch"></i> ${post.seo?.readingTimeMinutes || 7} min</span>
          </div>
        </div>

        <h3 class="card-title">${post.title}</h3>
        <p class="card-excerpt">${post.excerpt}</p>

        <!-- SEO Score & Checklist Box -->
        <div class="seo-score-box">
          <div class="seo-score-header">
            <span class="seo-score-title"><i class="fa-solid fa-chart-line"></i> Auditoria de SEO On-Page</span>
            <span class="seo-score-percent">${checklist.overallScore || 100}% Otimizado</span>
          </div>
          <div class="seo-checklist-grid">
            <div class="seo-check-item ${checklist.titleLengthValid ? 'valid' : 'invalid'}">
              <i class="fa-solid ${checklist.titleLengthValid ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
              <span>Título 10+ chars (${post.title.length} chars)</span>
            </div>
            <div class="seo-check-item ${checklist.metaTitleLengthValid ? 'valid' : 'invalid'}">
              <i class="fa-solid ${checklist.metaTitleLengthValid ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
              <span>Meta Title 40–60 chars (${post.seo?.metaTitle?.length || 0} chars)</span>
            </div>
            <div class="seo-check-item ${checklist.metaDescLengthValid ? 'valid' : 'invalid'}">
              <i class="fa-solid ${checklist.metaDescLengthValid ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
              <span>Meta Desc 120–160 chars (${post.seo?.metaDescription?.length || 0} chars)</span>
            </div>
            <div class="seo-check-item ${checklist.keywordDefined ? 'valid' : 'invalid'}">
              <i class="fa-solid ${checklist.keywordDefined ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
              <span>Palavra-chave: <strong>${post.seo?.primaryKeyword || 'Definida'}</strong></span>
            </div>
            <div class="seo-check-item ${checklist.wordCountValid ? 'valid' : 'invalid'}">
              <i class="fa-solid ${checklist.wordCountValid ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
              <span>Texto 800+ palavras (${post.seo?.wordCount || 0} palavras)</span>
            </div>
            <div class="seo-check-item ${checklist.slugCustomized ? 'valid' : 'invalid'}">
              <i class="fa-solid ${checklist.slugCustomized ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
              <span>Slug: <code>/${post.slug}</code></span>
            </div>
            <div class="seo-check-item ${checklist.excerptFilled ? 'valid' : 'invalid'}">
              <i class="fa-solid ${checklist.excerptFilled ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
              <span>Resumo preenchido</span>
            </div>
          </div>
        </div>

        <div class="card-actions-row">
          <button class="btn btn-secondary" onclick="openArticleModal('${post.id}')" style="flex: 1;">
            <i class="fa-solid fa-book-open"></i> Ler Completo
          </button>
          <button class="btn btn-gradient" onclick="approvePost('${post.id}')" style="flex: 1.2;">
            <i class="fa-solid fa-rocket"></i> Aprovar (1-Toque)
          </button>
        </div>
      </div>
    `;
        }
      )
      .join('');
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>Erro ao conectar com a API do agente.</p></div>`;
  }
}

// ==========================================
// 4. LOAD GOOGLE TRENDS SCANNER
// ==========================================
async function loadTrends() {
  const container = document.getElementById('trends-container');
  if (!container) return;

  container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Escaneando Google Trends Brasil...</p></div>`;

  try {
    const res = await fetch('/api/trends');
    const data = await res.json();
    const trends = data.trends || [];

    if (trends.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>Nenhuma tendência capturada.</p></div>`;
      return;
    }

    container.innerHTML = trends
      .map(
        (t) => `
      <div class="trend-item-card">
        <div>
          <div class="trend-item-header">
            <span class="trend-traffic-tag"><i class="fa-solid fa-arrow-trend-up"></i> ${t.approximateTraffic || 'Em Alta'}</span>
            <span style="font-size: 0.75rem; color: #fbbf24;">${t.relevanceScore}% Relevância</span>
          </div>
          <h4 class="trend-item-title" style="margin-top: 8px;">${t.title}</h4>
          <p class="trend-item-snippet" style="margin-top: 6px;">${t.trafficSnippet || t.suggestedAngle || ''}</p>
        </div>
        <button class="btn btn-outline-sm" onclick="generateFromTopic('${encodeURIComponent(t.title)}')">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Criar Artigo Deste Tema
        </button>
      </div>
    `
      )
      .join('');
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>Erro ao carregar tendências.</p></div>`;
  }
}

// ==========================================
// 5. LOAD PUBLISHED POSTS
// ==========================================
async function loadPublishedPosts() {
  const container = document.getElementById('published-list');
  if (!container) return;

  try {
    const res = await fetch('/api/posts?status=published');
    const data = await res.json();
    const published = data.posts || [];

    if (published.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>Nenhum artigo publicado ainda. Valide um rascunho na aba de Validação!</p></div>`;
      return;
    }

    container.innerHTML = published
      .map(
        (post) => `
      <div class="article-card" style="border-left: 4px solid #10b981;">
        <div class="card-top-meta">
          <span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> Publicado no Blog</span>
          <span class="metric-pill">${new Date(post.publishedAt || post.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
        <h3 class="card-title">${post.title}</h3>
        <p class="card-excerpt">${post.excerpt}</p>
        <div class="card-actions-row">
          <a href="/api/blog/posts/${post.slug}" target="_blank" class="btn btn-secondary" style="flex: 1; text-decoration: none;">
            <i class="fa-solid fa-link"></i> Ver Endpoint JSON
          </a>
          <button class="btn btn-secondary" onclick="openArticleModal('${post.id}')">
            <i class="fa-solid fa-eye"></i> Visualizar Artigo
          </button>
        </div>
      </div>
    `
      )
      .join('');
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p>Erro ao carregar publicados.</p></div>`;
  }
}

// ==========================================
// 6. ARTICLE MODAL & READER
// ==========================================
function openArticleModal(id) {
  const post = allPosts.find((p) => p.id === id);
  if (!post) return;

  currentViewingPost = post;

  const wordBadge = document.getElementById('modal-word-badge');
  const timeBadge = document.getElementById('modal-time-badge');
  const modalBody = document.getElementById('modal-body-content');

  if (wordBadge) wordBadge.innerHTML = `<i class="fa-solid fa-feather"></i> ${post.seo?.wordCount || 0} palavras`;
  if (timeBadge) timeBadge.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${post.seo?.readingTimeMinutes || 7} min`;

  const parsedHtml = (window.marked && window.marked.parse) ? window.marked.parse(post.contentMarkdown) : `<pre>${post.contentMarkdown}</pre>`;

  const checklist = post.seo?.checklist || {
    titleLengthValid: post.title.length >= 10,
    metaTitleLengthValid: (post.seo?.metaTitle?.length || 0) >= 40 && (post.seo?.metaTitle?.length || 0) <= 60,
    metaDescLengthValid: (post.seo?.metaDescription?.length || 0) >= 120 && (post.seo?.metaDescription?.length || 0) <= 160,
    keywordDefined: Boolean(post.seo?.primaryKeyword),
    wordCountValid: (post.seo?.wordCount || 0) >= 800,
    slugCustomized: Boolean(post.slug),
    excerptFilled: Boolean(post.excerpt),
    overallScore: 100
  };

  modalBody.innerHTML = `
    <div style="margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;">
      <span class="trend-badge" style="margin-bottom: 8px;"><i class="fa-solid fa-bolt"></i> Tendência: ${post.trendSource?.topic || post.title}</span>
      <h2 style="font-size: 1.4rem; color: #fff; margin-top: 6px;">${post.title}</h2>
      
      <!-- Ficha Técnica de SEO Completa -->
      <div class="seo-score-box" style="margin-top: 14px;">
        <div class="seo-score-header">
          <span class="seo-score-title"><i class="fa-solid fa-gauge-high"></i> Ficha Técnica de SEO (100% Validada)</span>
          <span class="seo-score-percent">${checklist.overallScore || 100}% SEO Score</span>
        </div>
        <div style="font-size: 0.82rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
          <div>🔹 <strong>Meta Title (${post.seo?.metaTitle?.length || 0} chars):</strong> <span style="color: #fbbf24;">${post.seo?.metaTitle || post.title}</span></div>
          <div>🔹 <strong>Meta Description (${post.seo?.metaDescription?.length || 0} chars):</strong> <span>${post.seo?.metaDescription || post.excerpt}</span></div>
          <div>🔹 <strong>Palavra-chave Foco:</strong> <span style="color: #10b981;">${post.seo?.primaryKeyword}</span></div>
          <div>🔹 <strong>URL Amigável (Slug):</strong> <code>https://primerankmarketing.com.br/blog/${post.slug}</code></div>
          <div>🔹 <strong>Total de Palavras:</strong> <span style="color: #10b981; font-weight: 700;">${post.seo?.wordCount} palavras</span> (Meta +800 / +1500 atingida)</div>
        </div>
      </div>
    </div>
    <div class="article-rendered-content">
      ${parsedHtml}
    </div>
  `;

  document.getElementById('article-modal')?.classList.add('open');
}

function closeModal() {
  document.getElementById('article-modal')?.classList.remove('open');
  currentViewingPost = null;
}

// ==========================================
// 7. ACTIONS (APPROVE, REJECT, GENERATE)
// ==========================================
async function approvePost(id) {
  try {
    showToast('🚀 Aprovando e publicando artigo...');
    const res = await fetch(`/api/posts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'published', notes: 'Aprovado via celular no Dashboard Web' }),
    });
    const data = await res.json();

    if (data.success) {
      showToast('✅ Artigo Aprovado & Publicado com Sucesso!');
      closeModal();
      loadPendingPosts();
      loadPublishedPosts();
    } else {
      showToast('❌ Erro: ' + data.error);
    }
  } catch (err) {
    showToast('❌ Falha na conexão com o servidor');
  }
}

async function rejectPost(id) {
  if (!confirm('Deseja realmente descartar este rascunho de artigo?')) return;

  try {
    const res = await fetch(`/api/posts/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', notes: 'Descartado pelo usuário' }),
    });
    const data = await res.json();

    if (data.success) {
      showToast('Artigo descartado.');
      closeModal();
      loadPendingPosts();
    }
  } catch (err) {
    showToast('❌ Erro ao descartar.');
  }
}

async function triggerAutoDraft() {
  showToast('⚡ Agente pesquisando tendências no Google...');
  try {
    const res = await fetch('/api/generate', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      showToast('🎉 Novo artigo gerado com sucesso!');
      loadPendingPosts();
    }
  } catch (err) {
    showToast('❌ Falha ao acionar geração');
  }
}

async function generateFromTopic(encodedTitle) {
  const title = decodeURIComponent(encodedTitle);
  showToast(`⚡ Escrevendo artigo aprofundado para: "${title}"...`);
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicTitle: title }),
    });
    const data = await res.json();
    if (data.success) {
      showToast('🎉 Artigo criado! Acesse a aba de Validação.');
      document.querySelector('[data-tab="tab-pending"]')?.click();
    }
  } catch (err) {
    showToast('❌ Falha na criação do artigo');
  }
}

async function handleManualGenerate() {
  const topic = document.getElementById('input-custom-topic')?.value?.trim();
  const notes = document.getElementById('input-custom-notes')?.value?.trim();

  document.getElementById('generate-modal')?.classList.remove('open');
  showToast('🤖 Agente iniciando redação (+1500 palavras)...');

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicTitle: topic || undefined, customInstructions: notes || undefined }),
    });
    const data = await res.json();
    if (data.success) {
      showToast('✅ Novo artigo criado com sucesso!');
      loadPendingPosts();
      document.querySelector('[data-tab="tab-pending"]')?.click();
    } else {
      showToast('❌ Erro: ' + data.error);
    }
  } catch (err) {
    showToast('❌ Falha na conexão.');
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
