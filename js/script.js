// ===========================================================
// CONFIGURAÇÕES GERAIS
// ===========================================================
// const url = 'http://localhost:9000/';
//const url = 'https://api.procampos.com.br/';
const url = 'https://api.jarb.com.br/'
//const url = 'http://localhost:9000/';
const username = '12345';
const password = '12345';
const headers = new Headers();
const pagina = document.getElementById('quem-somos');
const pagina1 = document.getElementById('inicial');

// ===========================================================
// PÁGINA INICIAL - AUTO COMPLETE DE PESSOAS
// ===========================================================
if (pagina1) {
  const botao = document.getElementById('myButton');
  const input = document.getElementById('pessoas');
  const datalist = document.getElementById('listaPessoas');

  botao.addEventListener('click', () => abrirPagina('Enter'));

  window.onload = function () {
    datalist.innerHTML = '';
    input.value = '';
  };

  input.addEventListener('input', (event) => {
    const valor = event.target.value.trim();
    if (valor.length > 3) {
      carregarPessoas(valor);
    } else {
      limparDatalist();
    }
  });
}

function limparDatalist() {
  const datalist = document.getElementById('listaPessoas');
  if (datalist) datalist.innerHTML = '';
}

function abrirPagina(event) {
  if (event.key === "Enter" || event === "Enter") {
   
    const entrada = document.getElementById('pessoas').value;
    const opcoes = document.querySelectorAll('#listaPessoas option');
    let destino = '';

    opcoes.forEach(opcao => {
      if (opcao.value === entrada) {
        destino = opcao.getAttribute('data-url');
      }
    });

    if (destino) {
      window.open(destino, '_blank');
      document.getElementById('formulario').reset();
      limparDatalist();
    } else {
      alert('Opção não encontrada!');
    }
  }
}

async function carregarPessoas(filtro) {
  const url2 = url + `pessoa/procura/${encodeURIComponent(filtro)}/S`;
  headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));
  
  try {
    const response = await fetch(url2, { headers });
    if (!response.ok) throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);

    const dados = await response.json();
    const datalist = document.getElementById('listaPessoas');
    datalist.innerHTML = '';
        
    dados.forEach(pessoa => {      
      const option = document.createElement('option');
      option.value = `${pessoa.idcli} - ${pessoa.nome}`;
      option.setAttribute('data-url', `inumado.html?codigo=${pessoa.idcli}`);
      datalist.appendChild(option);
    });
  } catch (erro) {
    console.error('Erro ao carregar pessoas:', erro);
  }
}

// ===========================================================
// PÁGINA "QUEM SOMOS" - HOMENAGEM
// ===========================================================
document.addEventListener('DOMContentLoaded', funcaoInicial);

function funcaoInicial() {
  if (pagina && pagina.getAttribute('id') === 'quem-somos') {
    location.hash = '#openModal';
  }
}

// ===========================================================
// BAIXA JSON INUMADO
// ===========================================================
function baixaJsonInumado(vlCodigo) {
  headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));
  fetch(url + 'pessoa/' + vlCodigo, { method: 'GET', headers })
    .then(response => {
      if (!response.ok) throw new Error('Erro na API: ' + response.status);
      return response.json();
    })
    .then(data => {
      const dataNasc = new Date(data.nasci).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      const dataFale = new Date(data.fales).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
      console.log('aqui');
      document.getElementById('fraseHomenagem').innerText = data.texto;
      document.getElementById('nomeFales').innerText = data.nome;
      document.getElementById('nasci').innerText = dataNasc;
      document.getElementById('fales').innerText = dataFale;
      document.getElementById('historia-texto').innerText = data.obs;

      const foto = document.getElementById('foto');
      if (data.foto.startsWith('data:image')) {
        foto.src = data.foto;
      } else {
        foto.src = 'data:image/jpeg;base64,' + data.foto;
      }
    
      const fundo = document.getElementById('fundo');
      if (data.fundo.startsWith('data:image')) {
        fundo.src = data.fundo;
      } else {
        fundo.src = 'data:image/jpeg;base64,' + data.fundo;
      }
    })
    .catch(error => {
      console.error('Erro ao buscar dados da API:', error);
      alert('Erro ao carregar dados. Verifique a conexão com a API.');
    });
}

// ===========================================================
// BAIXA JSON DE FOTOS (GALERIA)
// ===========================================================
function baixaJsonFoto(vlCodigo) {
  headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));

  fetch(url + 'foto/' + vlCodigo, { method: 'GET', headers })
    .then(response => {
      if (!response.ok) throw new Error('Erro na API: ' + response.status);
      return response.json();
    })
    .then(data => {
      const galeria = document.getElementById('galeria-grid');
      galeria.innerHTML = '';

      if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          const img = document.createElement('img');
          img.src = 'data:image/jpeg;base64,' + item.foto;
          img.alt = 'Foto';
          img.classList.add('foto-galeria');
          galeria.appendChild(img);
        });
      } else {
        galeria.innerHTML = '<p>Nenhuma foto disponível.</p>';
      }
    })
    .catch(error => {
      console.error('Erro ao buscar fotos:', error);
      alert('Erro ao carregar fotos. Verifique a conexão com a API.');
    });
}

// ===========================================================
// CONTROLE DO ÁUDIO
// ===========================================================
if (pagina) {
  const audio = document.getElementById('musica');
  const permitirAudio = document.querySelector('#permitir');
  const negarAudio = document.querySelector('#negar');
  const parametros = new URLSearchParams(window.location.search);
  const codigo = parametros.get('codigo');

  // Define o caminho da música correta
  if (audio && codigo) {
    audio.src = url + 'SONGS/song' + codigo + '.mp3';
      
    console.log('🎵 Música carregada:', audio.src);
  }

  // Botões do modal
  if (permitirAudio) {
    permitirAudio.addEventListener('click', function () {
      audio.play().catch(err => console.warn('Erro ao tocar áudio:', err));
      location.href = '#close';
    });
  }

  if (negarAudio) {
    negarAudio.addEventListener('click', function () {
      location.href = '#close';
    });
  }

  // Botões "Tocar" e "Parar" dentro da página
  const botaoTocar = document.querySelector('.btn-audio[aria-label="Tocar Música"]');
  const botaoParar = document.querySelector('.btn-audio[aria-label="Parar Música"]');

  if (botaoTocar) {
    botaoTocar.addEventListener('click', () => {
      audio.play().catch(err => console.warn('Erro ao tocar música:', err));
    });
  }

  if (botaoParar) {
    botaoParar.addEventListener('click', () => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  // Carrega os dados da pessoa e as fotos
  if (codigo) {
    baixaJsonInumado(codigo);
    baixaJsonFoto(codigo);
  }
}
