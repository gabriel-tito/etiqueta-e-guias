document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("scanner-modal");
  const btnClose = document.getElementById("btn-close-scanner");
  const statusTxt = document.getElementById("scanner-status");
  
  let html5QrcodeScanner = null;
  let currentTargetInputId = null;

  // Fecha o modal e desliga o scanner
  function closeScannerModal() {
    modal.classList.remove("active");
    if (html5QrcodeScanner) {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear scanner. ", error);
      });
      html5QrcodeScanner = null;
    }
  }

  // Callback de sucesso ao ler um código
  function onScanSuccess(decodedText, decodedResult) {
    if (currentTargetInputId) {
      const input = document.getElementById(currentTargetInputId);
      if (input) {
        input.value = decodedText;
        
        // Dispara um evento de 'input' e 'change' para notificar outros scripts que o valor mudou
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    
    // Mostra feedback rápido de sucesso antes de fechar
    if (statusTxt) {
      statusTxt.textContent = "Código lido com sucesso!";
      statusTxt.style.color = "#28a745";
    }
    
    setTimeout(() => {
      closeScannerModal();
    }, 500);
  }

  // Callback de erro durante o loop de frames da câmera
  function onScanFailure(error) {
    // Ignorar avisos constantes pois ele "falha" em todos os frames onde não há código visível
  }

  // Abre o scanner apontado para um input específico
  function openScannerModal(targetId) {
    currentTargetInputId = targetId;
    modal.classList.add("active");
    
    if (statusTxt) {
      statusTxt.textContent = "Aguardando câmera ou código...";
      statusTxt.style.color = "#666";
    }

    // Inicializa o scanner (Formato retangular ajuda na leitura de Códigos de Barras)
    html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 100 },
        rememberLastUsedCamera: true
      },
      false
    );
    
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
  }

  // Adiciona evento de clique a todos os botões de câmera dos inputs
  const cameraBtns = document.querySelectorAll(".btn-input-camera");
  cameraBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      openScannerModal(target);
    });
  });

  // Fechar no "X"
  if (btnClose) {
    btnClose.addEventListener("click", closeScannerModal);
  }

  // Fechar clicando fora do modal
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeScannerModal();
      }
    });
  }
});
