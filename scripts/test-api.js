// ============================================
// Aerocode v3.0 - Script de Teste da API
// Compatível com Windows e Linux
// ============================================

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Cores para console (funciona no Windows 10+)
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(color, message) {
  console.log(`${colors[color] || ''}${message}${colors.reset}`);
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  log('blue', '\n========================================');
  log('green', 'Iniciando Testes - Aerocode v3.0');
  log('blue', '========================================\n');

  try {
    // Test Health
    log('yellow', 'Testando Health Check...');
    let res = await makeRequest('GET', '/api/health');
    log('green', `Status: ${res.status}`);
    console.log(JSON.stringify(res.data, null, 2));

    // Test Aircraft
    log('yellow', '\nTestando Aeronaves...');
    res = await makeRequest('GET', '/api/aircraft');
    log('green', `GET /api/aircraft - Status: ${res.status}`);
    log('blue', `   Total de registros: ${Array.isArray(res.data) ? res.data.length : 0}`);

    const newAircraft = {
      codigo: `AER-TEST-${Date.now()}`,
      modelo: 'Test Aircraft',
      tipo: 'comercial',
      capacidade: 250,
      alcance: 7000,
    };
    res = await makeRequest('POST', '/api/aircraft', newAircraft);
    log('green', `POST /api/aircraft - Status: ${res.status}`);
    if (res.status === 201) {
      log('blue', `   ID criado: ${res.data.id}`);
    }

    // Test Parts
    log('yellow', '\nTestando Peças...');
    res = await makeRequest('GET', '/api/parts');
    log('green', `GET /api/parts - Status: ${res.status}`);
    log('blue', `   Total de registros: ${Array.isArray(res.data) ? res.data.length : 0}`);

    const newPart = {
      nome: 'Test Part',
      tipo: 'nacional',
      fornecedor: 'Test Fornecedor',
      status: 'pronta',
    };
    res = await makeRequest('POST', '/api/parts', newPart);
    log('green', `POST /api/parts - Status: ${res.status}`);

    // Test Employees
    log('yellow', '\nTestando Funcionários...');
    res = await makeRequest('GET', '/api/employees');
    log('green', `GET /api/employees - Status: ${res.status}`);
    log('blue', `   Total de registros: ${Array.isArray(res.data) ? res.data.length : 0}`);

    // Test Stages
    log('yellow', '\nTestando Etapas...');
    res = await makeRequest('GET', '/api/stages');
    log('green', `GET /api/stages - Status: ${res.status}`);
    log('blue', `   Total de registros: ${Array.isArray(res.data) ? res.data.length : 0}`);

    const newStage = {
      nome: 'Test Stage',
      prazo: 20,
      status: 'em_andamento',
    };
    res = await makeRequest('POST', '/api/stages', newStage);
    log('green', `POST /api/stages - Status: ${res.status}`);

    // Test Reports
    log('yellow', '\nTestando Relatórios...');
    res = await makeRequest('GET', '/api/reports');
    log('green', `GET /api/reports - Status: ${res.status}`);
    log('blue', `   Total de registros: ${Array.isArray(res.data) ? res.data.length : 0}`);

    const newReport = {
      titulo: 'Test Report',
      tipo: 'producao',
      conteudo: 'This is a test report',
      geradoPor: 'Test System',
    };
    res = await makeRequest('POST', '/api/reports', newReport);
    log('green', `POST /api/reports - Status: ${res.status}`);

    log('blue', '\n========================================');
    log('green', 'Todos os testes concluídos com sucesso!');
    log('blue', '========================================\n');
  } catch (error) {
    log('red', `\nErro durante os testes: ${error.message}`);
    log('red', 'Verifique se o servidor está rodando em http://localhost:3000');
    process.exit(1);
  }
}

// Executar os testes
runTests().catch(err => {
  log('red', `Erro fatal: ${err}`);
  process.exit(1);
});
