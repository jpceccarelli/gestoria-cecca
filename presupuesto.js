document.addEventListener("DOMContentLoaded", () => {
  // =================================================================
  // PRECIOS GLOBALES
  // =================================================================
  const COSTO_POR_FIRMA = 40000;
  const COSTO_POR_SUAT = 8600;

  // --- [INICIO LÓGICA DE VISIBILIDAD] ---

  // 1. Leer el parámetro 'tipo' de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const tipoTramite = urlParams.get("tipo"); // 'auto', 'moto', 'denuncia_robo', 'denuncia_venta'

  const titulo = document.querySelector("#presupuesto .container h2");

  // Seleccionar todas las secciones
  const seccionCostosTransferencia = document.querySelector(
    ".seccion-transferencia-costos"
  );
  const seccionesDenunciaRobo = document.querySelectorAll(
    ".seccion-denuncia-robo"
  );
  const seccionDenunciaVenta = document.querySelector(
    ".seccion-denuncia-venta"
  );

  const seccionFormularios = document.querySelector(".seccion-formularios");
  const seccionSuats = document.querySelector(".seccion-suats");
  const seccionFirmas = document.querySelector(".seccion-firmas");
  const botonCopiarDNRPA = document.getElementById("btnCopiarDominio");

  // Helper para mostrar/ocultar elementos
  const mostrarElemento = (el, mostrar) => {
    if (el) el.style.display = mostrar ? "block" : "none";
  };
  const mostrarMultiples = (secciones, mostrar) => {
    secciones.forEach(
      (sec) => (sec.style.display = mostrar ? "block" : "none")
    );
  };
  // Helper inteligente para checkboxes (oculta y resetea valor)
  const mostrarCheckbox = (idGroup, mostrar) => {
    const el = document.getElementById(idGroup);
    if (el) el.style.display = mostrar ? "flex" : "none";
    if (!mostrar && el) {
      const chk = el.querySelector("input[type='checkbox']");
      if (chk) chk.checked = false;
    }
  };

  // --- LOGICA PRINCIPAL SEGÚN TIPO ---

  if (tipoTramite === "moto") {
    // === MOTO ===
    if (titulo) titulo.textContent = "Presupuestador de Moto";

    // Placeholders
    const inputVehiculo = document.getElementById("vehiculoDesc");
    const inputDominio = document.getElementById("dominio");
    if (inputVehiculo) inputVehiculo.placeholder = "HONDA Wave 110";
    if (inputDominio) inputDominio.placeholder = "A 123 BCD";

    // Costos específicos Moto
    const chkF08 = document.getElementById("formF08");
    const chkF02 = document.getElementById("formF02");
    const chkF04 = document.getElementById("formF04");
    if (chkF08) chkF08.dataset.cost = "7500";
    if (chkF02) chkF02.dataset.cost = "6000";
    if (chkF04) chkF04.dataset.cost = "6000";

    // Visibilidad Secciones
    mostrarElemento(seccionCostosTransferencia, true);
    mostrarMultiples(seccionesDenunciaRobo, false);
    mostrarElemento(seccionDenunciaVenta, false);
    mostrarElemento(seccionFormularios, true);
    mostrarElemento(seccionSuats, true);
    mostrarElemento(seccionFirmas, true);
    if (botonCopiarDNRPA)
      mostrarElemento(botonCopiarDNRPA.parentElement.parentElement, true);

    // Visibilidad Formularios
    mostrarCheckbox("formF08Group", true);
    mostrarCheckbox("formF02Group", true);
    mostrarCheckbox("formF04Group", true);
    mostrarCheckbox("form3DGroup", true);
    mostrarCheckbox("formExtravioGroup", false);
    mostrarCheckbox("formF10Group", false);
  } else if (tipoTramite === "denuncia_robo") {
    // === DENUNCIA DE ROBO ===
    if (titulo) titulo.textContent = "Presupuestador Denuncia de Robo";

    mostrarElemento(seccionCostosTransferencia, false);
    mostrarMultiples(seccionesDenunciaRobo, true);
    mostrarElemento(seccionDenunciaVenta, false);
    mostrarElemento(seccionFormularios, true);
    mostrarElemento(seccionSuats, true);
    mostrarElemento(seccionFirmas, true);

    if (botonCopiarDNRPA)
      mostrarElemento(botonCopiarDNRPA.parentElement.parentElement, false);

    // Formularios específicos Robo
    mostrarCheckbox("formF08Group", false);
    mostrarCheckbox("formF02Group", false);
    mostrarCheckbox("formF04Group", false);
    mostrarCheckbox("form3DGroup", false);
    mostrarCheckbox("formExtravioGroup", true);
    mostrarCheckbox("formF10Group", false);
  } else if (tipoTramite === "denuncia_venta") {
    // === DENUNCIA DE VENTA ===
    if (titulo) titulo.textContent = "Presupuestador Denuncia de Venta";

    // Ocultar Transferencia y Robo
    mostrarElemento(seccionCostosTransferencia, false);
    mostrarMultiples(seccionesDenunciaRobo, false);
    // Mostrar sección Venta
    mostrarElemento(seccionDenunciaVenta, true);

    // Comunes
    mostrarElemento(seccionFormularios, true);
    mostrarElemento(seccionSuats, true);
    mostrarElemento(seccionFirmas, true);

    if (botonCopiarDNRPA)
      mostrarElemento(botonCopiarDNRPA.parentElement.parentElement, false);

    // --- FORMULARIOS ESPECÍFICOS PARA VENTA ---
    // Pedidos: F10, F59, F13. Ocultar el resto.
    mostrarCheckbox("formF10Group", true);
    mostrarCheckbox("formF59Group", true);
    mostrarCheckbox("form13IGroup", true);

    // Ocultar los que no van
    mostrarCheckbox("formF08Group", false);
    mostrarCheckbox("formF02Group", false);
    mostrarCheckbox("formF04Group", false);
    mostrarCheckbox("form3DGroup", false);
    mostrarCheckbox("formExtravioGroup", false);
  } else {
    // === AUTO (Defecto) ===
    if (titulo) titulo.textContent = "Presupuestador de Auto";

    mostrarElemento(seccionCostosTransferencia, true);
    mostrarMultiples(seccionesDenunciaRobo, false);
    mostrarElemento(seccionDenunciaVenta, false);
    mostrarElemento(seccionFormularios, true);
    mostrarElemento(seccionSuats, true);
    mostrarElemento(seccionFirmas, true);
    if (botonCopiarDNRPA)
      mostrarElemento(botonCopiarDNRPA.parentElement.parentElement, true);

    // Formularios Default
    mostrarCheckbox("formF08Group", true);
    mostrarCheckbox("formF02Group", true);
    mostrarCheckbox("formF04Group", true);
    mostrarCheckbox("form3DGroup", true);
    mostrarCheckbox("formExtravioGroup", false);
    mostrarCheckbox("formF10Group", false);
  }

  // --- [FIN LÓGICA DE VISIBILIDAD] ---

  // Helper para parsear números
  function parseLocalNumber(value) {
    if (typeof value !== "string") value = String(value);
    const cleaned = value.replace(/[^0-9.,]/g, "");
    const noThousands = cleaned.replace(/\./g, "");
    const standardized = noThousands.replace(",", ".");
    return parseFloat(standardized) || 0;
  }

  const camposInput = document.querySelectorAll(".calc");
  const camposCheckbox = document.querySelectorAll(".calc-check");
  const selectFirmas = document.getElementById("cantidadFirmas");
  const displayTotal = document.getElementById("totalDisplay");
  const displayTotalFirmas = document.getElementById("totalFirmas");
  const form = document.getElementById("presupuestoForm");
  const selectSuats = document.getElementById("cantidadSuats");
  const displayTotalSuats = document.getElementById("totalSuats");

  // --- CALCULAR TOTAL ---
  function formatCurrency(value) {
    return value.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function calcularTotal() {
    let total = 0;

    // Suma inputs visibles (.calc)
    camposInput.forEach((campo) => {
      // offsetParent verifica que el elemento sea visible en pantalla
      if (campo.offsetParent !== null) {
        total += parseLocalNumber(campo.value);
      }
    });

    // Suma checkboxes visibles y chequeados
    camposCheckbox.forEach((checkbox) => {
      if (checkbox.checked && checkbox.offsetParent !== null) {
        total += parseFloat(checkbox.dataset.cost) || 0;
      }
    });

    // Suma firmas
    if (selectFirmas.offsetParent !== null) {
      const cantFirmas = parseInt(selectFirmas.value) || 0;
      const subtotalFirmas = cantFirmas * COSTO_POR_FIRMA;
      total += subtotalFirmas;
      displayTotalFirmas.value = `$ ${formatCurrency(subtotalFirmas)}`;
    }

    // Suma SUATS
    if (selectSuats.offsetParent !== null) {
      const cantSuats = parseInt(selectSuats.value) || 0;
      const subtotalSuats = cantSuats * COSTO_POR_SUAT;
      total += subtotalSuats;
      displayTotalSuats.value = `$ ${formatCurrency(subtotalSuats)}`;
    }

    displayTotal.textContent = formatCurrency(total);
  }

  // Event Listeners
  camposInput.forEach((c) => c.addEventListener("input", calcularTotal));
  camposCheckbox.forEach((c) => c.addEventListener("change", calcularTotal));
  selectFirmas.addEventListener("change", calcularTotal);
  selectSuats.addEventListener("change", calcularTotal);
  form.addEventListener("reset", () => setTimeout(calcularTotal, 0));
  calcularTotal();

  // --- GENERACIÓN PDF ---
  const botonGenerarPDF = document.getElementById("generarPDF");
  const botonPrevisualizarPDF = document.getElementById("previsualizarPDF");
  const pdfPreviewContainer = document.getElementById("pdfPreviewContainer");
  const pdfPreviewFrame = document.getElementById("pdfPreviewFrame");
  const cerrarPrevisualizacionBtn = document.getElementById(
    "cerrarPrevisualizacion"
  );
  let doc = null;

  function crearPDFInterno() {
    const { jsPDF } = window.jspdf;
    doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageCenter = pageWidth / 2;
    const logo = new Image();
    logo.src = "assets/logo-cecca1.jpg";

    return new Promise((resolve, reject) => {
      logo.onload = function () {
        try {
          const cliente =
            document.getElementById("clienteNombre").value || "Cliente";
          const vehiculo =
            document.getElementById("vehiculoDesc").value || "Vehículo";
          const dominio =
            document.getElementById("dominio").value || "Sin Dominio";
          const honorarios = parseLocalNumber(
            document.getElementById("itemHonorarios").value
          );

          // Header
          const logoWidth = 40;
          const logoHeight = 10;
          const logoX = pageCenter - logoWidth / 2;
          doc.addImage(logo, "JPEG", logoX, 10, logoWidth, logoHeight);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text("GESTORÍA", pageCenter, 30, { align: "center" });
          doc.text("Aristóbulo del Valle 599, Guaymallén", pageCenter, 35, {
            align: "center",
          });
          doc.text("Mendoza, Argentina", pageCenter, 40, { align: "center" });

          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");
          let tituloPDF = "PRESUPUESTO DE GESTORÍA";
          if (tipoTramite === "moto") tituloPDF = "PRESUPUESTO DE MOTO";
          else if (tipoTramite === "denuncia_robo")
            tituloPDF = "PRESUPUESTO DENUNCIA DE ROBO";
          else if (tipoTramite === "denuncia_venta")
            tituloPDF = "PRESUPUESTO DENUNCIA DE VENTA";

          doc.text(tituloPDF, pageCenter, 60, { align: "center" });
          doc.setLineWidth(0.5);
          doc.line(15, 65, pageWidth - 15, 65);

          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          doc.text(
            `Fecha: ${new Date().toLocaleDateString("es-AR")}`,
            pageWidth - 15,
            75,
            { align: "right" }
          );
          doc.text(`Cliente: ${cliente}`, 15, 75);
          doc.text(`Vehículo: ${vehiculo}`, 15, 82);
          doc.text(`Dominio: ${dominio}`, 15, 89);
          doc.line(15, 98, pageWidth - 15, 98);

          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("Detalle de Costos", 15, 108);
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          let currentY = 118;
          let total = 0;

          function agregarLinea(texto, monto) {
            if (monto > 0) {
              doc.text(texto, 20, currentY);
              doc.text(`$ ${formatCurrency(monto)}`, pageWidth - 15, currentY, {
                align: "right",
              });
              currentY += 8;
            }
          }

          // --- COSTOS DINÁMICOS ---
          // 1. Formularios
          const getCheckCost = (id) => {
            const el = document.getElementById(id);
            return el && el.checked && el.offsetParent !== null
              ? parseFloat(el.dataset.cost)
              : 0;
          };

          const costF08 = getCheckCost("formF08");
          const costF02 = getCheckCost("formF02");
          const costF04 = getCheckCost("formF04");
          const costF59 = getCheckCost("formF59");
          const cost13I = getCheckCost("form13I");
          const cost3D = getCheckCost("form3D");
          const costExtravio = getCheckCost("formExtravio");
          const costF10 = getCheckCost("formF10");

          const totalFormularios =
            costF08 +
            costF02 +
            costF04 +
            costF59 +
            cost13I +
            cost3D +
            costExtravio +
            costF10;

          // 2. Firmas y SUATS
          const cantFirmas =
            parseInt(document.getElementById("cantidadFirmas").value) || 0;
          const totalCertificaciones = cantFirmas * COSTO_POR_FIRMA;
          const cantSuats =
            parseInt(document.getElementById("cantidadSuats").value) || 0;
          const totalSuats = cantSuats * COSTO_POR_SUAT;

          // 3. Gastos Registrales según tipo
          let gastosRegistrales = 0;

          if (tipoTramite === "denuncia_robo") {
            const drArancel = parseLocalNumber(
              document.getElementById("drArancel").value
            );
            const drArancelBaja = parseLocalNumber(
              document.getElementById("drArancelBaja").value
            );
            const ceArancel = parseLocalNumber(
              document.getElementById("ceArancel").value
            );
            const iiArancel = parseLocalNumber(
              document.getElementById("iiArancel").value
            );

            gastosRegistrales =
              drArancel + drArancelBaja + ceArancel + iiArancel + totalSuats;
            agregarLinea("Arancel Denuncia de Robo", drArancel);
            agregarLinea("Arancel de Baja", drArancelBaja);
            agregarLinea("Cert. Estado de Dominio", ceArancel);
            agregarLinea("Informe de Infracciones", iiArancel);
            agregarLinea("SUATS", totalSuats);
          } else if (tipoTramite === "denuncia_venta") {
            // NUEVO: Denuncia Venta
            const dvArancel = parseLocalNumber(
              document.getElementById("dvArancel").value
            );
            const dvInfracciones = parseLocalNumber(
              document.getElementById("dvInfracciones").value
            );
            const dvBajaATM = parseLocalNumber(
              document.getElementById("dvBajaATM").value
            );

            gastosRegistrales =
              dvArancel + dvInfracciones + dvBajaATM + totalSuats;

            agregarLinea("Arancel Denuncia de Venta", dvArancel);
            agregarLinea("Arancel de Infracciones", dvInfracciones);
            agregarLinea("Arancel Baja ATM", dvBajaATM);
            agregarLinea("SUATS", totalSuats);
          } else {
            // Transferencias
            const aranceles = parseLocalNumber(
              document.getElementById("itemAranceles").value
            );
            const sellado = parseLocalNumber(
              document.getElementById("itemSellado").value
            );
            const varios = parseLocalNumber(
              document.getElementById("itemVarios").value
            );

            gastosRegistrales = aranceles + sellado + varios + totalSuats;
           agregarLinea(
              "Gastos Registrales (Aranceles, Sellado, Suats, Varios)",
              gastosRegistrales
            );
          }

          total =
            gastosRegistrales +
            totalFormularios +
            totalCertificaciones +
            honorarios;

          // Render Formularios
          if (totalFormularios > 0) {
            currentY += 8;
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Formularios", 15, currentY);
            currentY += 10;
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            agregarLinea("Formulario F08", costF08);
            agregarLinea("Formulario F02", costF02);
            agregarLinea("Formulario F04", costF04);
            agregarLinea("Formulario F59", costF59);
            agregarLinea("Formulario 13I", cost13I);
            agregarLinea("Formulario 3D", cost3D);
            agregarLinea("Formulario Extravío", costExtravio);
            agregarLinea("Formulario F10", costF10);
          }

          // Render Firmas
          if (totalCertificaciones > 0) {
            currentY += 8;
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Certificaciones de Firma", 15, currentY);
            currentY += 10;
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            agregarLinea(
              `Cantidad de Firmas (${cantFirmas} x $${formatCurrency(
                COSTO_POR_FIRMA
              )})`,
              totalCertificaciones
            );
          }

          // Render Honorarios y Total
          currentY += 5;
          doc.line(15, currentY, pageWidth - 15, currentY);
          currentY += 10;
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("Honorarios", 15, currentY);
          currentY += 10;
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          agregarLinea("Honorarios de Gestoría", honorarios);

          currentY += 5;
          doc.line(15, currentY, pageWidth - 15, currentY);
          currentY += 12;
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          doc.text("TOTAL A ABONAR:", 15, currentY);
          doc.text(`$ ${formatCurrency(total)}`, pageWidth - 15, currentY, {
            align: "right",
          });

          // Footer
          const footerY = pageHeight - 20;
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.text(
            "Presupuesto válido por 5 días hábiles.",
            pageCenter,
            footerY,
            { align: "center" }
          );
          doc.text(
            "CECCA AUTOMOTORES - infocompuar@gmail.com",
            pageCenter,
            footerY + 5,
            { align: "center" }
          );
          doc.text("+54 9 261 625-6518", pageCenter, footerY + 10, {
            align: "center",
          });

          resolve(doc);
        } catch (error) {
          console.error(error);
          reject(error);
        }
      };
      logo.onerror = () => reject("Error cargando logo");
    });
  }

  botonGenerarPDF.addEventListener("click", async (e) => {
    e.preventDefault();
    if (parseLocalNumber(displayTotal.textContent) === 0)
      return alert("Total es $0,00");
    pdfPreviewContainer.style.display = "none";
    try {
      await crearPDFInterno();
      const cliente =
        document.getElementById("clienteNombre").value || "Cliente";
      const dominio = document.getElementById("dominio").value || "SinDominio";
      let nombreArchivo = `Presupuesto - ${cliente} - ${dominio}.pdf`;
      if (tipoTramite === "denuncia_venta")
        nombreArchivo = `Presupuesto Denuncia Venta - ${cliente}.pdf`;
      doc.save(nombreArchivo);
    } catch (e) {
      console.error(e);
    }
  });

  botonPrevisualizarPDF.addEventListener("click", async (e) => {
    e.preventDefault();
    if (parseLocalNumber(displayTotal.textContent) === 0)
      return alert("Total es $0,00");
    try {
      await crearPDFInterno();
      pdfPreviewFrame.src = doc.output("datauristring");
      pdfPreviewContainer.style.display = "block";
      pdfPreviewContainer.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      console.error(e);
    }
  });

  cerrarPrevisualizacionBtn.addEventListener("click", () => {
    pdfPreviewContainer.style.display = "none";
    pdfPreviewFrame.src = "";
  });

  // Copiar Dominio
  const inputDominio = document.getElementById("dominio");
  const urlDNRPA = "https://www2.jus.gov.ar/dnrpa-site/#!/estimador";
  if (botonCopiarDNRPA) {
    botonCopiarDNRPA.addEventListener("click", () => {
      const dom = inputDominio.value.trim().toUpperCase().replace(/\s/g, "");
      if (!dom) return window.open(urlDNRPA, "_blank");
      navigator.clipboard.writeText(dom).then(() => {
        botonCopiarDNRPA.textContent = "✓";
        window.open(urlDNRPA, "_blank");
        setTimeout(() => (botonCopiarDNRPA.textContent = ">"), 1500);
      });
    });
  }

  // Sellado auto
  const inputTasacion = document.getElementById("valorTasacion");
  const inputSellado = document.getElementById("itemSellado");
  if (inputTasacion && inputSellado) {
    inputTasacion.addEventListener("input", () => {
      inputSellado.value = (parseLocalNumber(inputTasacion.value) * 0.0125)
        .toFixed(2)
        .replace(".", ",");
      calcularTotal();
    });
  }

  // Input Numérico
  const camposSoloNumeros = [
    "itemAranceles",
    "valorTasacion",
    "itemVarios",
    "itemHonorarios",
    "drArancel",
    "drArancelBaja",
    "ceArancel",
    "iiArancel",
    "dvArancel",
    "dvInfracciones",
    "dvBajaATM",
  ];
  camposSoloNumeros.forEach((id) => {
    const el = document.getElementById(id);
    if (el)
      el.addEventListener(
        "input",
        (e) => (e.target.value = e.target.value.replace(/[^0-9.,]/g, ""))
      );
  });
});


