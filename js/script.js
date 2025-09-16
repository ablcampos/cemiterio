// ===== CONFIG =====
const url = 'https://api.jarb.com.br/'; // ajuste se necessário
const username = '12345';
const password = '12345';
const headers = new Headers();
headers.append('Accept', 'application/json');

// variáveis
const pagina = document.getElementById('quem-somos');
const pagina1 = document.getElementById('inicial');

if (pagina1){           
    const botao = document.getElementById('myButton');
    botao.addEventListener('click', () => {
      abrirPagina('Enter');  
    });
}  

window.onload = function() {
   
    if (pagina1){           
        const datalist = document.getElementById('listaPessoas');
        const input = document.getElementById('pessoas');
        datalist.innerHTML = ''; // Limpa as opções
        input.value = '';        // Limpa o campo de input
    }  
};

function limparDatalist() {  
    document.getElementById('listaPessoas').innerHTML = '';
}

function abrirPagina(event) {
    
    if (event.key === "Enter" || event === "Enter") {         

        const entrada = document.getElementById('pessoas').value;
        const opcoes = document.querySelectorAll('#listaPessoas option');

        let url = '';

        opcoes.forEach(opcao => {
            if (opcao.value === entrada) {
                url = opcao.getAttribute('data-url');
            }
        });
        
        if (url) {
            window.open(url, '_blank');
            document.getElementById('formulario').reset();

            // Limpa o datalist após abrir a página
            document.getElementById('listaPessoas').innerHTML = '';
        } else {
            alert('Opção não encontrada!');
        }
    }
}

const input = document.getElementById('pessoas');
    
async function carregarPessoas(filtro) {      
      const url2 = url+`pessoa?nome=${encodeURIComponent(filtro)}`;

      headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));

      try {
        const response = await fetch(url2, { headers });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
        }

        const dados = await response.json();

        const datalist = document.getElementById('listaPessoas');
        datalist.innerHTML = ''; // Limpa qualquer dado anterior 

        dados.forEach(pessoa => {
          var option = document.createElement('option');
          option.value = `${pessoa.idcli} - ${pessoa.nome}`;
          option.setAttribute('data-url', "inumado.html?codigo="+ `${pessoa.idcli}`);
          datalist.appendChild(option);                        
        });

      } catch (erro) {
        console.error('Erro ao carregar pessoas:', erro);
      }
}
        
    if (pagina1){   
        input.addEventListener('input', (event) => {
          const valor = event.target.value.trim();
          if (valor.length > 3) {
              carregarPessoas(valor);
          } else {
            limparDatalist();
          }
        });      
      }    


//************************************************************************************************************************************** */      
// COMPARTILHAMENTO DA PAGINA *****************************************************************************************************
//************************************************************************************************************************************** */      

      function share(platform) {
        const url = encodeURIComponent(window.location.href); // URL atual da página
        let shareUrl = '';
    
        switch(platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=Acessar o endereço    ${url}`;
                break;
            case 'instagram':
                alert('O Instagram não permite compartilhamento direto de links via web.'); 
                return;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}`;
                break;
        }
    
        if (shareUrl) {
            window.open(shareUrl, '_blank');
        }
    }

//************************************************************************************************************************************** */      
// SCRIPT PARA QUEM SOMOS APENAS *****************************************************************************************************
//************************************************************************************************************************************** */      

// Executa a função quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', funcaoInicial);
 

function funcaoInicial() {
    
      if (pagina){           
          if (pagina.getAttribute('id')==='quem-somos') {
            location.hash = '#openModal';                
          } 
      }
}



// instância do bxSlider (global para poder destruir)
window.bxGalleryInstance = null;

/* ================= UTILITÁRIOS ================= */
function capitalizarPrimeiraLetra(texto) {
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : '';
}

function formatarData(dataStr) {
  if (!dataStr) return '';
  const d = new Date(dataStr);
  if (isNaN(d)) return '';
  return capitalizarPrimeiraLetra(d.toLocaleDateString('pt-BR', {
    timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric'
  }));
}

/* ====== FUNÇÃO: cria galeria e inicializa bxSlider ====== */
function criarGaleriaComBxSlider(imagens) {
  const galeriaDiv = document.getElementById('galeria');
  galeriaDiv.innerHTML = '';

  // destrói instância anterior se existir
  if (window.bxGalleryInstance && typeof window.bxGalleryInstance.destroySlider === 'function') {
    try { window.bxGalleryInstance.destroySlider(); } catch (e) { /* ignore */ }
    window.bxGalleryInstance = null;
  }

  if (!imagens || !Array.isArray(imagens) || imagens.length === 0) {
    galeriaDiv.innerHTML = '<p style="text-align:center;">Sem imagens adicionais</p>';
    return;
  }

  // cria UL com classe esperada pelo bxSlider
  const ul = document.createElement('ul');
  ul.className = 'bxslider';

  // cria promessas para aguardar load das imagens
  const promises = imagens.map(raw => {
    return new Promise(resolve => {
      const li = document.createElement('li');
      const img = document.createElement('img');

      const src = (raw && raw.startsWith && raw.startsWith('data:image')) ? raw : ('data:image/jpeg;base64,' + raw);
      img.src = src;
      img.alt = 'Foto da galeria';
      img.onload = () => resolve();
      img.onerror = () => resolve(); // resolve mesmo em erro para não travar

      li.appendChild(img);
      ul.appendChild(li);
    });
  });

  galeriaDiv.appendChild(ul);

  // Quando todas as imagens tiverem carregado, inicializa o slider
  Promise.all(promises).then(() => {
    window.bxGalleryInstance = $('.bxslider').bxSlider({
      auto: true,
      speed: 2000,
      pause: 4000,
      adaptiveHeight: true,
      pager: true,
      controls: true
    });
  });
}

/* ====== FUNÇÃO: baixa dados da pessoa e popula a página ====== */
function baixaJsonInumado(vlCodigo) {
  if (!vlCodigo) return;

  headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));

  fetch(url + 'pessoa/' + vlCodigo, { method: 'GET', headers: headers })
    .then(resp => {
      if (!resp.ok) throw new Error('Erro na API: ' + resp.status + ' ' + resp.statusText);
      return resp.json();
    })
    .then(data => {
      // preenche campos
      document.getElementById('breveHistoria').innerText = data.texto || '';
      document.getElementById('nomeFales').innerText = data.nome || '';
      document.getElementById('nasci').innerText = formatarData(data.nasci) ? ('✨ ' + formatarData(data.nasci)) : '';
      document.getElementById('fales').innerText = formatarData(data.fales) ? ('✝️ ' + formatarData(data.fales)) : '';
      document.getElementById('historia').value = data.obs || '';

      // foto principal
      const fotoEl = document.getElementById('foto');
      if (data.foto) {
        fotoEl.src = (data.foto.startsWith && data.foto.startsWith('data:image')) ? data.foto : ('data:image/jpeg;base64,' + data.foto);
      } else {
        fotoEl.removeAttribute('src');
      }

      // galeria: se a API já retornou data.galeria (array), usa ela
      if (data.galeria && Array.isArray(data.galeria) && data.galeria.length > 0) {
        criarGaleriaComBxSlider(data.galeria);
      } else {
        // senão, tenta buscar via endpoint /foto/{codigo} (mantendo compatibilidade)
        baixaJsonFoto(vlCodigo);
      }
    })
    .catch(err => {
      console.error('Erro ao carregar dados pessoa:', err);
      alert('Erro ao carregar dados. Verifique a conexão com a API.');
    });
}

/* ====== FUNÇÃO: baixa fotos (endpoint alternativo) ====== */
function baixaJsonFoto(vlCodigo) {
  if (!vlCodigo) return;

  headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));

  fetch(url + 'foto/' + vlCodigo, { method: 'GET', headers: headers })
    .then(resp => {
      if (!resp.ok) {
        // se não houver fotos via esse endpoint, apenas mostra mensagem
        console.warn('Sem fotos pelo endpoint /foto/:', resp.status);
        criarGaleriaComBxSlider([]); // fallback
        return null;
      }
      return resp.json();
    })
    .then(data => {
      if (!data) return;
      // Assume que 'data' é um array de objetos com item.foto (base64)
      if (Array.isArray(data) && data.length > 0) {
        const arr = data.map(item => {
          // se item.foto já vier com data:image..., deixa; senão converte
          return (item.foto && item.foto.startsWith && item.foto.startsWith('data:image')) ? item.foto : ('data:image/jpeg;base64,' + item.foto);
        });
        criarGaleriaComBxSlider(arr);
      } else {
        criarGaleriaComBxSlider([]);
      }
    })
    .catch(err => {
      console.error('Erro ao carregar fotos:', err);
      criarGaleriaComBxSlider([]);
    });
}

/* ====== comportamento da página ====== */
document.addEventListener('DOMContentLoaded', function () {
  // se veio com ?codigo=xxx no URL, baixa os dados
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get('codigo');

  // abre modal de aviso (se for a página "quem-somos")
  if (pagina && pagina.id === 'quem-somos') {
    location.hash = '#openModal';
  }

  if (codigo) {
    baixaJsonInumado(codigo);
  }

  // botões do modal
  const permitirBtn = document.getElementById('permitir');
  const negarBtn = document.getElementById('negar');
  if (permitirBtn) {
    permitirBtn.addEventListener('click', function () {
      const audio = document.getElementById('musica');
      if (audio) audio.play().catch(() => {/* autoplay pode ser bloqueado */});
      location.hash = '#close';
    });
  }
  if (negarBtn) {
    negarBtn.addEventListener('click', function () {
      location.hash = '#close';
    });
  }

  // seta src do audio se existir o codigo (opcional)
  if (codigo) {
    const tipo_codigo = codigo;
    const audioEl = document.getElementById('musica');
    if (audioEl) audioEl.src = "https://api.jarb.com.br/SONGS/song" + tipo_codigo + ".mp3";
  }
});
