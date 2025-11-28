let currentUser = null;

const store = {
  aeronaves: [],
  pecas: [],
  funcionarios: [],
  etapas: [],
  relatorios: [],
  metricas: {
    latency: 0,
    response: 0,
    processing: 0,
    success: 100
  }
};

function loadStore() {
  const saved = localStorage.getItem('aerocodeStore');
  if (saved) {
    Object.assign(store, JSON.parse(saved));
  }
}

function saveStore() {
  localStorage.setItem('aerocodeStore', JSON.stringify(store));
}

async function measureFetch(url, opts = {}) {
  const t0 = performance.now();
  try {
    const res = await fetch(url, {
      ...opts,
      headers: {
        'Content-Type': 'application/json',
        ...opts.headers
      }
    });
    const t1 = performance.now();
    const serverTimeHeader = res.headers.get('x-server-time') || '0';
    const data = await res.json().catch(() => null);
    
    return {
      status: res.status,
      ok: res.ok,
      data,
      clientMs: t1 - t0,
      serverMs: Number(serverTimeHeader),
      totalMs: t1 - t0 + Number(serverTimeHeader)
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return { status: 0, ok: false, data: null, clientMs: 0, serverMs: 0, error };
  }
}

async function fetchAircrafts() {
  const result = await measureFetch('/api/aircraft');
  updateMetrics(result.clientMs, result.serverMs);
  if (result.ok && result.data) {
    store.aeronaves = result.data;
    saveStore();
  }
  return result.data || [];
}

async function fetchParts() {
  const result = await measureFetch('/api/parts');
  updateMetrics(result.clientMs, result.serverMs);
  if (result.ok && result.data) {
    store.pecas = result.data;
    saveStore();
  }
  return result.data || [];
}

async function fetchEmployees() {
  const result = await measureFetch('/api/employees');
  updateMetrics(result.clientMs, result.serverMs);
  if (result.ok && result.data) {
    store.funcionarios = result.data;
    saveStore();
  }
  return result.data || [];
}

async function fetchStages() {
  const result = await measureFetch('/api/stages');
  updateMetrics(result.clientMs, result.serverMs);
  if (result.ok && result.data) {
    store.etapas = result.data;
    saveStore();
  }
  return result.data || [];
}

async function createAircraft(data) {
  const result = await measureFetch('/api/aircraft', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  updateMetrics(result.clientMs, result.serverMs);
  return result;
}

function navigateTo(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.page === pageId) {
      btn.classList.add('active');
    }
  });
  window.scrollTo(0, 0);
}
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    navigateTo(btn.dataset.page);
  });
});
function setupTabs() {
  document.querySelectorAll('.tabs-container').forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        buttons.forEach(b => b.classList.remove('active'));
        container.parentElement.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });

        btn.classList.add('active');
        const content = document.getElementById(tabId);
        if (content) {
          content.classList.add('active');
        }
      });
    });
  });
}

function setupForms() {
  const formAero = document.getElementById('form-aeronave');
  if (formAero) {
    formAero.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        codigo: document.getElementById('aero-codigo').value,
        modelo: document.getElementById('aero-modelo').value,
        tipo: document.getElementById('aero-tipo').value,
        capacidade: parseInt(document.getElementById('aero-capacidade').value),
        alcance: parseInt(document.getElementById('aero-alcance').value)
      };
      
      try {
        const result = await createAircraft(data);
        if (result.ok) {
          showMessage('msg-aero', 'Aeronave cadastrada com sucesso!', 'success');
          formAero.reset();
          await loadListagemData();
          setTimeout(() => navigateTo('listagem'), 1500);
        } else {
          showMessage('msg-aero', result.data.error || 'Erro ao cadastrar', 'error');
        }
      } catch (error) {
        showMessage('msg-aero', 'Erro de conexão', 'error');
      }
    });
  }

  const formPeca = document.getElementById('form-peca');
  if (formPeca) {
    formPeca.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        nome: document.getElementById('peca-nome').value,
        tipo: document.getElementById('peca-tipo').value,
        fornecedor: document.getElementById('peca-fornecedor').value,
        status: document.getElementById('peca-status').value
      };
      
      try {
        const result = await measureFetch('/api/parts', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        updateMetrics(result.clientMs, result.serverMs);
        
        if (result.ok) {
          showMessage('msg-peca', 'Peça cadastrada com sucesso!', 'success');
          formPeca.reset();
          await loadListagemData();
          setTimeout(() => navigateTo('listagem'), 1500);
        } else {
          showMessage('msg-peca', result.data.error || 'Erro ao cadastrar', 'error');
        }
      } catch (error) {
        showMessage('msg-peca', 'Erro de conexão', 'error');
      }
    });
  }

  const formFunc = document.getElementById('form-func');
  if (formFunc) {
    formFunc.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        nome: document.getElementById('func-nome').value,
        email: document.getElementById('func-email').value,
        telefone: document.getElementById('func-telefone').value,
        cargo: document.getElementById('func-cargo').value,
        endereco: document.getElementById('func-endereco').value
      };
      
      try {
        const result = await measureFetch('/api/employees', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        updateMetrics(result.clientMs, result.serverMs);
        
        if (result.ok) {
          showMessage('msg-func', 'Funcionário cadastrado com sucesso!', 'success');
          formFunc.reset();
          await loadListagemData();
          setTimeout(() => navigateTo('listagem'), 1500);
        } else {
          showMessage('msg-func', result.data.error || 'Erro ao cadastrar', 'error');
        }
      } catch (error) {
        showMessage('msg-func', 'Erro de conexão', 'error');
      }
    });
  }

  const formEtapa = document.getElementById('form-etapa');
  if (formEtapa) {
    formEtapa.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        nome: document.getElementById('etapa-nome').value,
        prazo: parseInt(document.getElementById('etapa-prazo').value),
        status: document.getElementById('etapa-status').value
      };
      
      try {
        const result = await measureFetch('/api/stages', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        updateMetrics(result.clientMs, result.serverMs);
        
        if (result.ok) {
          showMessage('msg-etapa', 'Etapa cadastrada com sucesso!', 'success');
          formEtapa.reset();
          await loadListagemData();
          setTimeout(() => navigateTo('listagem'), 1500);
        } else {
          showMessage('msg-etapa', result.data.error || 'Erro ao cadastrar', 'error');
        }
      } catch (error) {
        showMessage('msg-etapa', 'Erro de conexão', 'error');
      }
    });
  }
}

function showMessage(elementId, message, type = 'success') {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.className = `message ${type}`;
    el.style.display = 'block';
  }
}

async function loadListagemData() {
  await fetchAircrafts();
  await fetchParts();
  await fetchEmployees();
  await fetchStages();
  const tableAero = document.getElementById('table-aeronaves');
  if (tableAero) {
    tableAero.innerHTML = store.aeronaves.length === 0 
      ? '<tr><td colspan="5" style="text-align:center; padding: 2rem;">Nenhuma aeronave cadastrada</td></tr>'
      : store.aeronaves.map(item => `
        <tr>
          <td>${item.codigo}</td>
          <td>${item.modelo}</td>
          <td>${item.tipo === 'comercial' ? 'Comercial' : 'Militar'}</td>
          <td>${item.capacidade}</td>
          <td>${item.alcance}</td>
        </tr>
      `).join('');
  }
  const tablePeca = document.getElementById('table-pecas');
  if (tablePeca) {
    tablePeca.innerHTML = store.pecas.length === 0
      ? '<tr><td colspan="4" style="text-align:center; padding: 2rem;">Nenhuma peça cadastrada</td></tr>'
      : store.pecas.map(item => `
        <tr>
          <td>${item.nome}</td>
          <td><span class="status-badge status-${item.tipo}">${item.tipo === 'nacional' ? 'Nacional' : 'Importada'}</span></td>
          <td>${item.fornecedor}</td>
          <td><span class="status-badge status-${item.status}">${item.status}</span></td>
        </tr>
      `).join('');
  }
  const tableFunc = document.getElementById('table-funcionarios');
  if (tableFunc) {
    tableFunc.innerHTML = store.funcionarios.length === 0
      ? '<tr><td colspan="4" style="text-align:center; padding: 2rem;">Nenhum funcionário cadastrado</td></tr>'
      : store.funcionarios.map(item => `
        <tr>
          <td>${item.nome}</td>
          <td>${item.email}</td>
          <td>${item.telefone}</td>
          <td><span class="status-badge status-${item.cargo}">${item.cargo}</span></td>
        </tr>
      `).join('');
  }
  const tableEtapa = document.getElementById('table-etapas');
  if (tableEtapa) {
    tableEtapa.innerHTML = store.etapas.length === 0
      ? '<tr><td colspan="3" style="text-align:center; padding: 2rem;">Nenhuma etapa cadastrada</td></tr>'
      : store.etapas.map(item => `
        <tr>
          <td>${item.nome}</td>
          <td>${item.prazo} dias</td>
          <td><span class="status-badge status-${item.status}">${item.status}</span></td>
        </tr>
      `).join('');
  }
}

function updateDashboard() {
  document.getElementById('count-aircraft').textContent = store.aeronaves.length;
  document.getElementById('count-parts').textContent = store.pecas.length;
  document.getElementById('count-employees').textContent = store.funcionarios.length;
  document.getElementById('count-stages').textContent = store.etapas.length;
}

const btnRefreshDash = document.getElementById('btn-refresh-dash');
if (btnRefreshDash) {
  btnRefreshDash.addEventListener('click', async () => {
    btnRefreshDash.classList.add('loading');
    btnRefreshDash.disabled = true;
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    updateDashboard();
    loadListagemData();
    
    btnRefreshDash.classList.remove('loading');
    btnRefreshDash.disabled = false;
    showMessage('dashboard-msg', 'Dados atualizados!', 'success');
  });
}
function generateReport(type) {
  const timestamp = new Date().toLocaleString('pt-BR');
  const report = {
    id: Date.now(),
    type: type,
    title: getReportTitle(type),
    timestamp: timestamp,
    data: getReportData(type)
  };

  store.relatorios.push(report);
  saveStore();

  const list = document.getElementById('relatorio-list');
  if (list.querySelector('.empty-state')) {
    list.innerHTML = '';
  }

  const item = document.createElement('div');
  item.className = 'relatorio-item';
  item.innerHTML = `
    <div>
      <strong>${report.title}</strong>
      <p style="font-size: 0.85rem; color: var(--text-light); margin-top: 0.25rem;">
        ${timestamp}
      </p>
    </div>
    <button class="btn btn-primary" onclick="downloadReport(${report.id})">Download</button>
  `;
  list.appendChild(item);

  showMessage('relatorio-msg', 'Relatório gerado com sucesso!', 'success');
}

function getReportTitle(type) {
  const titles = {
    producao: 'Relatório de Produção',
    testes: 'Relatório de Testes',
    qualidade: 'Relatório de Qualidade',
    recursos: 'Relatório de Recursos'
  };
  return titles[type] || 'Relatório';
}

function getReportData(type) {
  switch (type) {
    case 'producao':
      return {
        etapas: store.etapas.length,
        percentualConcluido: Math.round((store.etapas.filter(e => e.status === 'concluida').length / (store.etapas.length || 1)) * 100),
        prazosAtrasados: store.etapas.filter(e => e.status === 'atrasada').length
      };
    case 'recursos':
      return {
        funcionarios: store.funcionarios.length,
        administradores: store.funcionarios.filter(f => f.cargo === 'administrador').length,
        engenheiros: store.funcionarios.filter(f => f.cargo === 'engenheiro').length,
        operadores: store.funcionarios.filter(f => f.cargo === 'operador').length
      };
    case 'qualidade':
      return {
        pecas: store.pecas.length,
        pecasProntas: store.pecas.filter(p => p.status === 'pronta').length,
        pecasEmTransporte: store.pecas.filter(p => p.status === 'transporte').length
      };
    default:
      return { total: store.aeronaves.length };
  }
}

function downloadReport(reportId) {
  const report = store.relatorios.find(r => r.id === reportId);
  if (!report) return;

  const content = `
AEROCODE - SISTEMA DE GESTÃO AERONÁUTICA
Relatório: ${report.title}
Data: ${report.timestamp}

DADOS DO RELATÓRIO:
${Object.entries(report.data).map(([key, value]) => `${key}: ${value}`).join('\n')}

Gerado em: ${new Date().toLocaleString('pt-BR')}
  `.trim();

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', `relatorio_${report.type}_${reportId}.txt`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function updateMetrics(clientMs, serverMs) {
  
}

document.addEventListener('DOMContentLoaded', async () => {
  const checkResult = await fetch('/api/auth/check');
  const { hasUsers } = await checkResult.json();

  if (!hasUsers) {
    document.getElementById('register-first-page').classList.remove('hidden');
    document.getElementById('login-page').classList.add('hidden');
    setupRegisterFirstForm();
  } else {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('register-first-page').classList.add('hidden');
    setupLoginForm();
    
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      document.getElementById('login-page').classList.add('hidden');
      showMainApp();
    }
  }
});

function setupLoginForm() {
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const senha = document.getElementById('login-senha').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha })
        });

        const data = await res.json();

        if (!res.ok) {
          showMessage('login-msg', data.error || 'Erro ao fazer login', 'error');
          return;
        }

        currentUser = data;
        sessionStorage.setItem('currentUser', JSON.stringify(data));
        
        showMessage('login-msg', 'Login realizado com sucesso!', 'success');
        
        setTimeout(() => {
          document.getElementById('login-page').classList.add('hidden');
          showMainApp();
        }, 1000);
      } catch (error) {
        console.error(error);
        showMessage('login-msg', 'Erro na conexão', 'error');
      }
    });
  }
}

function setupRegisterFirstForm() {
  const formRegister = document.getElementById('form-register-first');
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('reg-nome').value;
      const email = document.getElementById('reg-email').value;
      const senha = document.getElementById('reg-senha').value;
      const cargo = document.getElementById('reg-cargo').value;

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha, cargo })
        });

        const data = await res.json();

        if (!res.ok) {
          showMessage('register-msg', data.error || 'Erro ao cadastrar', 'error');
          return;
        }

        currentUser = data;
        sessionStorage.setItem('currentUser', JSON.stringify(data));
        
        showMessage('register-msg', 'Usuário criado com sucesso!', 'success');
        
        setTimeout(() => {
          document.getElementById('register-first-page').classList.add('hidden');
          showMainApp();
        }, 1000);
      } catch (error) {
        console.error(error);
        showMessage('register-msg', 'Erro na conexão', 'error');
      }
    });
  }
}

function showMainApp() {
  loadStore();
  setupTabs();
  setupForms();
  updateDashboard();
  loadListagemData();
  
  const userBtn = document.getElementById('btn-user-info');
  if (userBtn && currentUser) {
    userBtn.textContent = `Olá, ${currentUser.nome}`;
  }
  
  document.getElementById('main-app').classList.remove('hidden');
  console.log('App initialized for user:', currentUser.nome);
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem('currentUser');
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
  document.getElementById('form-login').reset();
  console.log('Usuário deslogado');
}