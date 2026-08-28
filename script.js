document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("etiqueta-form");

  // Campos do formulário
  const hostnameInput = document.getElementById("hostname");
  const ipInput = document.getElementById("ip");
  const setorInput = document.getElementById("setor");
  const patrimonioInput = document.getElementById("patrimonio");
  const serialInput = document.getElementById("serial");
  const mascaraInput = document.getElementById("mascara");
  const gatewayInput = document.getElementById("gateway");

  // Campos de pré-visualização
  const prevHostname = document.getElementById("prev-hostname");
  const prevSetor = document.getElementById("prev-setor");
  const prevIp = document.getElementById("prev-ip");
  const prevPatrimonio = document.getElementById("prev-patrimonio");
  const prevSerial = document.getElementById("prev-serial");
  const prevQr = document.getElementById("qrcode");

  // Atualiza pré-visualização em tempo real
  function atualizarPreview() {
    prevHostname.textContent = hostnameInput.value || "HOSTNAME";
    prevSetor.textContent = setorInput.value || "N/A";
    prevIp.textContent = ipInput.value || "N/A";
    prevPatrimonio.textContent = patrimonioInput.value || "N/A";
    prevSerial.textContent = serialInput.value || "N/A";

    // Atualiza o QR Code da prévia
    const qrTexto = `
Host: ${hostnameInput.value}
Setor: ${setorInput.value}
Patrimônio: ${patrimonioInput.value}
Série: ${serialInput.value}
IP: ${ipInput.value}
Máscara: ${mascaraInput.value}
Gateway: ${gatewayInput.value}
    `;

    prevQr.innerHTML = ""; // limpa QR anterior
    QRCode.toCanvas(document.createElement("canvas"), qrTexto, { width: 100, height: 100 }, (err, canvas) => {
      if (!err) prevQr.appendChild(canvas);
    });
  }

  // Chama atualização sempre que algum campo muda
  [hostnameInput, ipInput, setorInput, patrimonioInput, serialInput, mascaraInput, gatewayInput].forEach(input => {
    input.addEventListener("input", atualizarPreview);
  });

  // Evento de envio (gera etiqueta mini)
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const hostname = hostnameInput.value;
    const ip = ipInput.value;
    const setor = setorInput.value;
    const patrimonio = patrimonioInput.value;
    const serial = serialInput.value;
    const mascara = mascaraInput.value;
    const gateway = gatewayInput.value;

    const wrapper = document.createElement("div");
    wrapper.className = "etiqueta-wrapper";

    const etiqueta = document.createElement("div");
    etiqueta.className = "etiqueta-mini";

    const logoDiv = document.createElement("div");
    logoDiv.className = "logo-etiq";
    logoDiv.innerHTML = `<img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuNCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbWFkYV8yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMjgzLjQ2IDI4My40NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjgzLjQ2IDI4My40NjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQoJLnN0MXtmaWxsOiNFQ0IzMUY7fQo8L3N0eWxlPgo8Zz4KCTxnPgoJCTxnPgoJCQk8cGF0aCBkPSJNMTQxLjc0LDIwLjRjLTE4Ljg3LDAtMzQuMTcsMTUuMy0zNC4xNywzNC4xNmMwLDE4Ljg3LDE1LjMsMzQuMTcsMzQuMTcsMzQuMTdjMTguODYsMCwzNC4xNi0xNS4zLDM0LjE2LTM0LjE3CgkJCQlDMTc1LjksMzUuNywxNjAuNiwyMC40LDE0MS43NCwyMC40eiBNMTQxLjc0LDgzLjc0Yy0xNi4xMiwwLTI5LjE4LTEzLjA3LTI5LjE4LTI5LjE4YzAtMTYuMTEsMTMuMDctMjkuMTcsMjkuMTgtMjkuMTcKCQkJCWMxNi4xMSwwLDI5LjE3LDEzLjA3LDI5LjE3LDI5LjE3QzE3MC45MSw3MC42OCwxNTcuODQsODMuNzQsMTQxLjc0LDgzLjc0eiIvPgoJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTcwLjkxLDU0LjU2YzAsMTYuMTItMTMuMDcsMjkuMTgtMjkuMTcsMjkuMThjLTE2LjEyLDAtMjkuMTgtMTMuMDctMjkuMTgtMjkuMTgKCQkJCWMwLTE2LjExLDEzLjA3LTI5LjE3LDI5LjE4LTI5LjE3QzE1Ny44NCwyNS4zOSwxNzAuOTEsMzguNDUsMTcwLjkxLDU0LjU2eiIvPgoJCTwvZz4KCQk8Zz4KCQkJPHBhdGggZD0iTTE0MS43NCwxMDcuNTdjLTE4Ljg3LDAtMzQuMTcsMTUuMy0zNC4xNywzNC4xNmMwLDE4Ljg3LDE1LjMsMzQuMTcsMzQuMTcsMzQuMTdjMTguODYsMCwzNC4xNi0xNS4zLDM0LjE2LTM0LjE3CgkJCQlDMTc1LjksMTIyLjg3LDE2MC42LDEwNy41NywxNDEuNzQsMTA3LjU3eiBNMTQxLjc0LDE3MC45MWMtMTYuMTIsMC0yOS4xOC0xMy4wNy0yOS4xOC0yOS4xOGMwLTE2LjExLDEzLjA3LTI5LjE3LDI5LjE4LTI5LjE3CgkJCQljMTYuMTEsMCwyOS4xNywxMy4wNywyOS4xNywyOS4xN0MxNzAuOTEsMTU3Ljg0LDE1Ny44NCwxNzAuOTEsMTQxLjc0LDE3MC45MXoiLz4KCQkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE3MC45MSwxNDEuNzNjMCwxNi4xMi0xMy4wNywyOS4xOC0yOS4xNywyOS4xOGMtMTYuMTIsMC0yOS4xOC0xMy4wNy0yOS4xOC0yOS4xOAoJCQkJYzAtMTYuMTEsMTMuMDctMjkuMTcsMjkuMTgtMjkuMTdDMTU3Ljg0LDExMi41NSwxNzAuOTEsMTI1LjYyLDE3MC45MSwxNDEuNzN6Ii8+CgkJPC9nPgoJCTxnPgoJCQk8cGF0aCBkPSJNMTQxLjc0LDE5NC43M2MtMTguODcsMC0zNC4xNywxNS4zLTM0LjE3LDM0LjE2YzAsMTguODcsMTUuMywzNC4xNywzNC4xNywzNC4xN2MxOC44NiwwLDM0LjE2LTE1LjMsMzQuMTYtMzQuMTcKCQkJCUMxNzUuOSwyMTAuMDMsMTYwLjYsMTk0LjczLDE0MS43NCwxOTQuNzN6IE0xNDEuNzQsMjU4LjA4Yy0xNi4xMiwwLTI5LjE4LTEzLjA3LTI5LjE4LTI5LjE4YzAtMTYuMTEsMTMuMDctMjkuMTcsMjkuMTgtMjkuMTcKCQkJCWMxNi4xMSwwLDI5LjE3LDEzLjA3LDI5LjE3LDI5LjE3QzE3MC45MSwyNDUuMDEsMTU3Ljg0LDI1OC4wOCwxNDEuNzQsMjU4LjA4eiIvPgoJCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTcwLjkxLDIyOC44OWMwLDE2LjEyLTEzLjA3LDI5LjE4LTI5LjE3LDI5LjE4Yy0xNi4xMiwwLTI5LjE4LTEzLjA3LTI5LjE4LTI5LjE4CgkJCQljMC0xNi4xMSwxMy4wNy0yOS4xNywyOS4xOC0yOS4xN0MxNTcuODQsMTk5LjcyLDE3MC45MSwyMTIuNzksMTcwLjkxLDIyOC44OXoiLz4KCQk8L2c+Cgk8L2c+Cgk8Zz4KCQk8cG9seWdvbiBwb2ludHM9IjI2OS4yOSwxNDIuNDUgMTk2Ljk3LDIxNC43NyAxNjQuODcsMTgyLjY3IDIwNS4xLDE0Mi40NSAxNjMuNDMsMTAwLjc5IDE5NS41Myw2OC42OSAJCSIvPgoJCTxwb2x5Z29uIHBvaW50cz0iMTQuMTcsMTQxLjAxIDg2LjQ5LDY4LjY5IDExOC41OSwxMDAuNzkgNzguMzYsMTQxLjAxIDEyMC4wMywxODIuNjcgODcuOTMsMjE0Ljc3IAkJIi8+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==">`;

    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `
      <div class="div-text-etiq">
        <b>${hostname}</b><br/>
        <span>${ip}</span><br/>
        <span>${setor}</span>
      </div>
    `;

    const qrDiv = document.createElement("div");
    qrDiv.className = "qr";

    const btn = document.createElement("button");
    btn.textContent = "X";
    btn.className = "delete-bin";
    btn.onclick = () => wrapper.remove();

    etiqueta.appendChild(logoDiv);
    etiqueta.appendChild(info);
    etiqueta.appendChild(qrDiv);
    
    wrapper.appendChild(etiqueta);
    wrapper.appendChild(btn);

    const qrTexto = `
Host: ${hostname}
Setor: ${setor}
Patrimônio: ${patrimonio}
Série: ${serial}
IP: ${ip}
Máscara: ${mascara}
Gateway: ${gateway}
    `;

    QRCode.toCanvas(document.createElement("canvas"), qrTexto, { width: 95, height: 95, margin: 1 }, (err, canvas) => {
      if (!err) qrDiv.appendChild(canvas);
    });

    document.getElementById("etiquetas-container").appendChild(wrapper);
    form.reset();
    atualizarPreview();
  });
});
