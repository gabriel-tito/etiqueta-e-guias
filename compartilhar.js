document.addEventListener("DOMContentLoaded", () => {
  const btnCompartilharEtiqueta = document.getElementById("btn-compartilhar-etiqueta");
  const btnCompartilharGuia = document.getElementById("btn-compartilhar-guia");

  async function compartilharPDF(elementoAlvoId, nomeArquivoBase) {
    const element = document.getElementById(elementoAlvoId);
    if (!element) {
      alert("Nenhum conteúdo para gerar PDF.");
      return;
    }

    if (elementoAlvoId === "etiquetas-container" && element.innerHTML.trim() === "") {
      alert("Crie pelo menos uma etiqueta primeiro antes de compartilhar.");
      return;
    }

    try {
      // 1. Tirar "foto" do elemento
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      // 2. Criar PDF A4
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Margens
      let marginX = 0;
      let marginY = 0;
      if (elementoAlvoId === "etiquetas-container") {
        marginX = 10; marginY = 10;
      } else if (elementoAlvoId === "guia-print-area") {
        marginX = 8; marginY = 5;
      }
      
      const innerWidth = pdfWidth - (marginX * 2);
      const innerHeight = pdfHeight - (marginY * 2);
      
      const imgRatio = canvas.width / canvas.height;
      const pdfRatio = innerWidth / innerHeight;
      
      let finalWidth, finalHeight;
      
      // Essa lógica garante que a imagem CAIBA sempre, forçando 1 única página!
      if (imgRatio > pdfRatio) {
        // Mais larga que a área do pdf -> largura dita a escala
        finalWidth = innerWidth;
        finalHeight = innerWidth / imgRatio;
      } else {
        // Mais alta que a área do pdf -> altura dita a escala
        finalHeight = innerHeight;
        finalWidth = innerHeight * imgRatio;
      }
      
      // Centraliza horizontalmente
      const x = marginX + (innerWidth - finalWidth) / 2;
      const y = marginY; // top
      
      pdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);
      
      const filename = `${nomeArquivoBase}_${new Date().getTime()}.pdf`;
      const pdfBlob = pdf.output('blob');

      // 3. Preparar para compartilhamento via API Nativa
      const file = new File([pdfBlob], filename, { type: 'application/pdf' });

      // 4. Checar se o navegador (ex: Android/iOS) suporta envio de arquivos no menu de compartilhamento
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: nomeArquivoBase,
            text: 'Segue em anexo o arquivo PDF gerado pelo sistema.'
          });
          console.log('Compartilhado com sucesso!');
        } catch (error) {
          console.log('Compartilhamento cancelado pelo usuário ou falhou.', error);
        }
      } else {
        // Fallback: Computador ou navegador sem suporte -> Iniciar Download automático
        console.log("Web Share API de arquivos não suportada. Baixando PDF...");
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erro ao gerar PDF: ", error);
      alert("Ocorreu um erro ao gerar o arquivo PDF. Tente novamente.");
    }
  }

  // Evento para a página de INÍCIO (Etiquetas)
  if (btnCompartilharEtiqueta) {
    btnCompartilharEtiqueta.style.display = "block"; // Garante que ficará visível, se estiver escondido via inline
    btnCompartilharEtiqueta.addEventListener("click", () => {
      const optElement = document.getElementById("etiquetas-container");
      
      const btnRemovers = optElement.querySelectorAll('.delete-bin');
      btnRemovers.forEach(el => el.style.display = 'none');
      optElement.classList.add('pdf-export');

      const originalText = btnCompartilharEtiqueta.innerText;
      btnCompartilharEtiqueta.innerText = "Gerando...";
      btnCompartilharEtiqueta.disabled = true;
      
      compartilharPDF("etiquetas-container", "Etiquetas_DETRAN").finally(() => {
        btnCompartilharEtiqueta.innerText = originalText;
        btnCompartilharEtiqueta.disabled = false;
        optElement.classList.remove('pdf-export');
        btnRemovers.forEach(el => el.style.display = '');
      });
    });
  }

  // Evento para a página de GUIAS
  if (btnCompartilharGuia) {
    btnCompartilharGuia.addEventListener("click", () => {
      const optElement = document.getElementById("guia-print-area");
      
      // O html2pdf "fotografa" a tela do jeito que ela está (ignorando o @media print)
      // Portanto, precisamos esconder temporariamente os botões de remover da tela 
      // para que eles não apareçam no PDF final.
      const btnRemovers = optElement.querySelectorAll('.btn-remover, .btn-remover-col');
      btnRemovers.forEach(el => el.style.display = 'none');
      
      optElement.classList.add('pdf-export');
      
      const originalText = btnCompartilharGuia.innerText;
      btnCompartilharGuia.innerText = "Gerando...";
      btnCompartilharGuia.disabled = true;

      compartilharPDF("guia-print-area", "Guia_Equipamentos").finally(() => {
        btnCompartilharGuia.innerText = originalText;
        btnCompartilharGuia.disabled = false;
        optElement.classList.remove('pdf-export');
        // Restaurar a visibilidade dos botões de remover após gerar o PDF
        btnRemovers.forEach(el => el.style.display = '');
      });
    });
  }
});
