async function log(msg) {
  const el = document.getElementById('log');
  el.textContent = `${new Date().toISOString()} - ${msg}\n` + el.textContent;
}

async function measureFetch(url, opts) {
  const t0 = performance.now();
  const res = await fetch(url, opts);
  const t1 = performance.now();
  const serverTimeHeader = res.headers.get('x-server-time') || '0';
  const data = await res.json().catch(()=>null);
  return { status: res.status, data, clientMs: t1 - t0, serverMs: Number(serverTimeHeader) };
}

document.getElementById('btn-list').addEventListener('click', async () => {
  log('Iniciando listagem...');
  const r = await measureFetch('/api/aircraft');
  log(`List: status=${r.status} clientMs=${r.clientMs.toFixed(2)} serverMs=${r.serverMs}`);
  log(JSON.stringify(r.data, null, 2));
});

document.getElementById('btn-add').addEventListener('click', async () => {
  const payload = { name: 'New ' + Date.now(), manufacturer: 'Auto' };
  log('Criando aircraft...');
  const r = await measureFetch('/api/aircraft', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  log(`Add: status=${r.status} clientMs=${r.clientMs.toFixed(2)} serverMs=${r.serverMs}`);
  log(JSON.stringify(r.data, null, 2));
});

document.getElementById('btn-metrics').addEventListener('click', async () => {
  log('Obtendo metrics summary...');
  const r = await measureFetch('/metrics/summary');
  log(`Metrics: clientMs=${r.clientMs.toFixed(2)} serverMs=${r.serverMs}`);
  log(JSON.stringify(r.data, null, 2));
});