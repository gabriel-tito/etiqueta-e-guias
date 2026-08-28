document.addEventListener("DOMContentLoaded", () => {
  // Dados do formulário da guia
  const gRemetente = document.getElementById("g-remetente");
  const gChamado = document.getElementById("g-chamado");
  const gDestinatario = document.getElementById("g-destinatario");
  const gTipo = document.getElementById("g-tipo");
  const gResponsavel = document.getElementById("g-responsavel");

  // Dados do equipamento atual
  const gTipoEquipamento = document.getElementById("g-tipo-equipamento");
  const gEquipamento = document.getElementById("g-equipamento");
  const gHostname = document.getElementById("g-hostname");
  const gIp = document.getElementById("g-ip");
  const gPatrimonio = document.getElementById("g-patrimonio");
  const gSerial = document.getElementById("g-serial");
  const btnAddEquipamento = document.getElementById("btn-add-equipamento");

  const lblModelo = document.getElementById("lbl-modelo");
  const lblHostname = document.getElementById("lbl-hostname");
  const lblIp = document.getElementById("lbl-ip");
  const lblPatrimonio = document.getElementById("lbl-patrimonio");
  const lblSerial = document.getElementById("lbl-serial");

  function atualizarCamposEquipamento() {
    const tipo = gTipoEquipamento.value;
    
    lblModelo.style.display = 'none';
    lblHostname.style.display = 'none';
    lblIp.style.display = 'none';
    lblPatrimonio.style.display = 'none';
    lblSerial.style.display = 'none';

    if (tipo === "Monitor") {
      lblModelo.style.display = 'block';
      lblSerial.style.display = 'block';
    } else if (tipo === "Teclado" || tipo === "Mouse" || tipo === "Estabilizador") {
      lblModelo.style.display = 'block';
    } else if (tipo === "Computador") {
      lblModelo.style.display = 'block';
      lblHostname.style.display = 'block';
      lblIp.style.display = 'block';
      lblPatrimonio.style.display = 'block';
      lblSerial.style.display = 'block';
    } else if (tipo === "Switch" || tipo === "projetor") {
      lblModelo.style.display = 'block';
      lblSerial.style.display = 'block';
    } else if (tipo === "notebook") {
      lblModelo.style.display = 'block';
      lblHostname.style.display = 'block';
      lblPatrimonio.style.display = 'block';
      lblSerial.style.display = 'block';
    } else if (tipo === "Webcam") {
      lblModelo.style.display = 'block';
      lblPatrimonio.style.display = 'block';
    }
  }

  gTipoEquipamento.addEventListener("change", atualizarCamposEquipamento);
  atualizarCamposEquipamento();

  // Previews gerais da Guia (Agora com múltiplas vias)
  const prevGRemetentes = document.querySelectorAll(".prev-g-remetente");
  const prevGChamados = document.querySelectorAll(".prev-g-chamado");
  const prevGDestinatarios = document.querySelectorAll(".prev-g-destinatario");
  const prevGTipos = document.querySelectorAll(".prev-g-tipo");
  const prevGResponsaveis = document.querySelectorAll(".prev-g-responsavel");
  const tabelaEquipamentosBodies = document.querySelectorAll(".tabela-equipamentos-body");

  let equipamentos = [];

  function atualizarPreviewGeral() {
    prevGRemetentes.forEach(el => el.textContent = gRemetente.value || "N/A");
    prevGChamados.forEach(el => el.textContent = gChamado.value || "N/A");
    prevGDestinatarios.forEach(el => el.textContent = gDestinatario.value || "N/A");
    prevGTipos.forEach(el => el.textContent = gTipo.value);

    const resp = gResponsavel.value.trim();
    prevGResponsaveis.forEach(el => {
      if (resp) {
        el.innerHTML = `Nome: <strong>${resp}</strong>`;
      } else {
        el.textContent = "Nome: _______________________________";
      }
    });
  }

  function renderizarTabela() {
    tabelaEquipamentosBodies.forEach(tbody => {
      tbody.innerHTML = "";
      
      if (equipamentos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="padding: 20px;">Nenhum equipamento adicionado</td></tr>`;
        return;
      }

      equipamentos.forEach((eq, index) => {
        const tr = document.createElement("tr");
        
        tr.innerHTML = `
          <td>${eq.tipoEquipamento || ""}</td>
          <td>${eq.equipamento || ""}</td>
          <td>${eq.patrimonio || ""}</td>
          <td>${eq.serial || ""}</td>
          <td>${eq.hostname || ""}</td>
          <td>${eq.ip || ""}</td>
          <td class="btn-remover-col" style="border: none;">
            <button class="btn-remover" data-index="${index}">Remover</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });

    // Adiciona evento de remover para os botões de todas as vias
    document.querySelectorAll(".btn-remover").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        equipamentos.splice(index, 1);
        renderizarTabela();
      });
    });
  }

  // Monitora alterações nos campos gerais
  [gRemetente, gChamado, gDestinatario, gTipo, gResponsavel].forEach(input => {
    input.addEventListener("input", atualizarPreviewGeral);
    input.addEventListener("change", atualizarPreviewGeral);
  });

  // Autopreenchimento inteligente dependendo do Tipo de Guia
  function preencherPorTipoGuia() {
    if (gTipo.value === "GUIA DE ENTRADA") {
      gDestinatario.value = "CTI - SERVICE DESK";
      // Limpa o remetente caso o usuário ainda não tenha digitado algo importante
      if (gRemetente.value === "CTI - SERVICE DESK") gRemetente.value = "";
    } else if (gTipo.value === "GUIA DE SAÍDA") {
      gRemetente.value = "CTI - SERVICE DESK";
      // Limpa o destinatário caso tenha o valor padrão
      if (gDestinatario.value === "CTI - SERVICE DESK") gDestinatario.value = "";
    }
    atualizarPreviewGeral();
  }

  gTipo.addEventListener("change", preencherPorTipoGuia);

  // Adicionar equipamento à lista
  btnAddEquipamento.addEventListener("click", () => {
    // Pode exigir que ao menos um campo seja preenchido
    if (!gEquipamento.value && !gHostname.value && !gPatrimonio.value && !gSerial.value) {
      alert("Preencha ao menos um campo do equipamento para adicionar.");
      return;
    }

    equipamentos.push({
      tipoEquipamento: gTipoEquipamento.value,
      equipamento: gEquipamento.value.trim(),
      hostname: gHostname.value.trim(),
      ip: gIp.value.trim(),
      patrimonio: gPatrimonio.value.trim(),
      serial: gSerial.value.trim()
    });

    // Limpa os campos do equipamento atual
    gEquipamento.value = "";
    gHostname.value = "";
    gIp.value = "";
    gPatrimonio.value = "";
    gSerial.value = "";

    renderizarTabela();
  });

  // Inicializa o preview e preenchimento inteligente
  preencherPorTipoGuia();
  atualizarPreviewGeral();
  renderizarTabela();

  // Imprimir Guia com Data e Hora (opcional)
  document.getElementById("btn-imprimir-guia").addEventListener("click", () => {
    const dataHoraElems = document.querySelectorAll(".data-hora-impressao");
    const chkUsarData = document.getElementById("chk-usar-data");
    
    let textoData = `DATA: _______/_______/_____________`;
    if (chkUsarData.checked) {
      const agora = new Date();
      const dataFormatada = agora.toLocaleDateString('pt-BR');
      const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      textoData = `DATA: ${dataFormatada} às ${horaFormatada}`;
    }
    
    dataHoraElems.forEach(el => el.textContent = textoData);
    
    window.print();
  });

  // ----- INTEGRAÇÃO DO JSQR (WEBCAM NATIVA) -----
  const video = document.getElementById("qr-video");
  const canvasElement = document.getElementById("qr-canvas");
  const canvas = canvasElement.getContext("2d");
  const videoContainer = document.getElementById("video-container");
  const btnStartCamera = document.getElementById("btn-start-camera");
  const qrMessage = document.getElementById("qr-message");

  let stream = null;
  let isScanning = false;
  let lastReadTime = 0;

  btnStartCamera.addEventListener("click", () => {
    if (isScanning) {
      // Parar câmera
      isScanning = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      videoContainer.style.display = "none";
      btnStartCamera.textContent = "Iniciar Câmera";
      qrMessage.style.display = "none";
      return;
    }

    btnStartCamera.textContent = "Iniciando...";

    // Iniciar câmera solicitando a padrão ou traseira
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(s => {
      stream = s;
      video.srcObject = stream;
      video.setAttribute("playsinline", true);
      video.play();
      
      requestAnimationFrame(tick);
      
      isScanning = true;
      videoContainer.style.display = "block";
      btnStartCamera.textContent = "Parar Câmera";
      qrMessage.style.display = "none";
    }).catch(err => {
      console.error(err);
      btnStartCamera.textContent = "Iniciar Câmera";
      qrMessage.textContent = "Erro ao iniciar câmera (verifique permissões).";
      qrMessage.style.color = "red";
      qrMessage.style.display = "block";
    });
  });

  function tick() {
    if (!isScanning) return;
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      
      const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      
      if (code && (Date.now() - lastReadTime > 2000)) { // 2s de cooldown entre leituras
        const decodedText = code.data;
        console.log("QR Lido:", decodedText); // Para ajudar na depuração caso precise
        
        // \b garante que é a palavra exata. (?:^|[\r\n]+) garante que está no início de uma linha
        const hostMatch = decodedText.match(/(?:^|[\r\n]+)\s*(?:Hostname|Host)\s*:\s*(.*)/i);
        const ipMatch = decodedText.match(/(?:^|[\r\n]+)\s*IP\s*:\s*(.*)/i);
        const patMatch = decodedText.match(/(?:^|[\r\n]+)\s*(?:Patrim[oô]nio|Pat)\s*:\s*(.*)/i);
        const serieMatch = decodedText.match(/(?:^|[\r\n]+)\s*(?:S[eé]rie|NS|S[eé]r)\s*:\s*(.*)/i);

        let achou = false;
        if (hostMatch && hostMatch[1]) { gHostname.value = hostMatch[1].trim(); achou = true; }
        if (ipMatch && ipMatch[1]) { gIp.value = ipMatch[1].trim(); achou = true; }
        if (patMatch && patMatch[1]) { gPatrimonio.value = patMatch[1].trim(); achou = true; }
        if (serieMatch && serieMatch[1]) { gSerial.value = serieMatch[1].trim(); achou = true; }

        if (achou) {
          lastReadTime = Date.now();
          qrMessage.textContent = "Qr Code autenticado com sucesso!";
          qrMessage.style.color = "#00ff00"; // Verde vivo (combina com fundo preto)
          qrMessage.style.display = "block";
          
          // Desliga a câmera automaticamente
          isScanning = false;
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          videoContainer.style.display = "none";
          btnStartCamera.textContent = "Iniciar Câmera";

          setTimeout(() => {
            qrMessage.style.display = "none";
          }, 3000);
        }
      }
    }
    requestAnimationFrame(tick);
  }
});
