document.addEventListener("DOMContentLoaded", () => {
  // =================================================================
  const COSTO_POR_FIRMA = 30000;
  const COSTO_POR_SUAT = 8350;
  // =================================================================

  // --- [INICIO DE LA NUEVA LÓGICA DINÁMICA] ---

  // 1. Leer el parámetro 'tipo' de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const tipoTramite = urlParams.get("tipo"); // 'auto', 'moto', 'denuncia_robo'

  const titulo = document.querySelector("#presupuesto .container h2");

  // Seleccionar todas las secciones
  const seccionCostosTransferencia = document.querySelector(
    ".seccion-transferencia-costos"
  );
  const seccionesDenunciaRobo = document.querySelectorAll(
    ".seccion-denuncia-robo"
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

  if (tipoTramite === "moto") {
    // --- LÓGICA PARA MOTO ---
    if (titulo) titulo.textContent = "Presupuestador de Moto";

    // --- ** INICIO DEL NUEVO CAMBIO ** ---
    // Cambiar Placeholders
    const inputVehiculo = document.getElementById("vehiculoDesc");
    const inputDominio = document.getElementById("dominio");

    if (inputVehiculo) inputVehiculo.placeholder = "HONDA Wave 110";
    if (inputDominio) inputDominio.placeholder = "A 123 BCD";
    // --- ** FIN DEL NUEVO CAMBIO ** ---

    // Cambiar Costos
    const chkF08 = document.getElementById("formF08");
    const chkF02 = document.getElementById("formF02");
    const chkF04 = document.getElementById("formF04");
    if (chkF08) chkF08.dataset.cost = "5500";
    if (chkF02) chkF02.dataset.cost = "500";
    if (chkF04) chkF04.dataset.cost = "5000";

    // Mostrar/Ocultar
    mostrarElemento(seccionCostosTransferencia, true);
    mostrarMultiples(seccionesDenunciaRobo, false);
    mostrarElemento(seccionFormularios, true);
    mostrarElemento(seccionSuats, true);
    mostrarElemento(seccionFirmas, true);
    if (botonCopiarDNRPA)
      mostrarElemento(botonCopiarDNRPA.parentElement.parentElement, true);
  } else if (tipoTramite === "denuncia_robo") {
    // --- LÓGICA PARA DENUNCIA DE ROBO ---
    if (titulo) titulo.textContent = "Presupuestador Denuncia de Robo";

    // Mostrar/Ocultar Secciones
    mostrarElemento(seccionCostosTransferencia, false); // Oculta costos de transferencia
    mostrarMultiples(seccionesDenunciaRobo, true); // Muestra costos de denuncia
    mostrarElemento(seccionFormularios, true); // Muestra formularios
    mostrarElemento(seccionSuats, true); // Muestra SUATS
    mostrarElemento(seccionFirmas, true); // Muestra firmas

    // Ocultar botón de Copiar Dominio
    if (botonCopiarDNRPA)
      mostrarElemento(botonCopiarDNRPA.parentElement.parentElement, false);

    // --- ** NUEVO: Ocultar/Mostrar Checkboxes Específicos ** ---
    mostrarElemento(document.getElementById("formF08Group"), false);
    mostrarElemento(document.getElementById("form3DGroup"), false);
    mostrarElemento(document.getElementById("formExtravioGroup"), true); // Muestra el nuevo
  } else {
    // --- LÓGICA PARA AUTO (o por defecto) ---
    if (titulo) titulo.textContent = "Presupuestador de Auto"; // Título por defecto

    // Mostrar/Ocultar
    mostrarElemento(seccionCostosTransferencia, true);
    mostrarMultiples(seccionesDenunciaRobo, false);
    mostrarElemento(seccionFormularios, true);
    mostrarElemento(seccionSuats, true);
    mostrarElemento(seccionFirmas, true);
    if (botonCopiarDNRPA)
      mostrarElemento(botonCopiarDNRPA.parentElement.parentElement, true);

    // --- ** NUEVO: Asegurarse de que los checkboxes estén correctos ** ---
    mostrarElemento(document.getElementById("formF08Group"), true);
    mostrarElemento(document.getElementById("form3DGroup"), true);
    mostrarElemento(document.getElementById("formExtravioGroup"), false);
  }
  // --- [FIN DE LA NUEVA LÓGICA] ---

  /**
   * Convierte un string de número local (ej: "41.485" o "1.250,50")
   * a un número flotante estándar (ej: 41485 o 1250.50).
   */
  function parseLocalNumber(value) {
    if (typeof value !== "string") {
      value = String(value);
    }
    const cleaned = value.replace(/[^0-9.,]/g, "");
    const noThousands = cleaned.replace(/\./g, "");
    const standardized = noThousands.replace(",", ".");
    return parseFloat(standardized) || 0;
  }

  // --- Elementos del DOM ---
  const camposInput = document.querySelectorAll(".calc");
  const camposCheckbox = document.querySelectorAll(".calc-check");
  const selectFirmas = document.getElementById("cantidadFirmas");
  const displayTotal = document.getElementById("totalDisplay");
  const displayTotalFirmas = document.getElementById("totalFirmas");
  const form = document.getElementById("presupuestoForm"); // Para el reseteo

  const selectSuats = document.getElementById("cantidadSuats");
  const displayTotalSuats = document.getElementById("totalSuats");

  // --- Parte 1: Calcular el total automáticamente ---

  function formatCurrency(value) {
    return value.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function calcularTotal() {
    let total = 0;

    // Suma los campos de texto/número (.calc)
    camposInput.forEach((campo) => {
      // Solo suma si el campo está visible
      if (campo.offsetParent !== null) {
        const valor = parseLocalNumber(campo.value);
        total += valor;
      }
    });

    // Suma los checkboxes chequeados (solo si son visibles)
    camposCheckbox.forEach((checkbox) => {
      if (checkbox.checked && checkbox.offsetParent !== null) {
        total += parseFloat(checkbox.dataset.cost) || 0;
      }
    });

    // Suma las certificaciones de firma (solo si es visible)
    if (selectFirmas.offsetParent !== null) {
      const cantFirmas = parseInt(selectFirmas.value) || 0;
      const subtotalFirmas = cantFirmas * COSTO_POR_FIRMA;
      total += subtotalFirmas;
      displayTotalFirmas.value = `$ ${formatCurrency(subtotalFirmas)}`;
    }

    // Suma los SUATS (solo si es visible)
    if (selectSuats.offsetParent !== null) {
      const cantSuats = parseInt(selectSuats.value) || 0;
      const subtotalSuats = cantSuats * COSTO_POR_SUAT;
      total += subtotalSuats;
      displayTotalSuats.value = `$ ${formatCurrency(subtotalSuats)}`;
    }

    // Actualiza el display total
    displayTotal.textContent = formatCurrency(total);
  }

  // Añade "escuchadores" a todos los campos
  camposInput.forEach((campo) =>
    campo.addEventListener("input", calcularTotal)
  );
  camposCheckbox.forEach((checkbox) =>
    checkbox.addEventListener("change", calcularTotal)
  );
  selectFirmas.addEventListener("change", calcularTotal);
  selectSuats.addEventListener("change", calcularTotal);

  // Escuchador para el botón de "Limpiar Formulario"
  form.addEventListener("reset", () => {
    setTimeout(calcularTotal, 0);
  });

  // Calcula el total por primera vez
  calcularTotal();

  // --- Parte 2: Generar y Previsualizar el PDF ---

  const botonGenerarPDF = document.getElementById("generarPDF");
  const botonPrevisualizarPDF = document.getElementById("previsualizarPDF");
  const pdfPreviewContainer = document.getElementById("pdfPreviewContainer");
  const pdfPreviewFrame = document.getElementById("pdfPreviewFrame");
  const cerrarPrevisualizacionBtn = document.getElementById(
    "cerrarPrevisualizacion"
  );

  let doc = null;

  // --- Función principal para crear el PDF (Tu versión) ---
  function crearPDFInterno() {
    const { jsPDF } = window.jspdf;
    doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageCenter = pageWidth / 2;

    const logo = new Image();
    logo.src = "assets/logo-cecca.jpg";

    return new Promise((resolve, reject) => {
      logo.onload = function () {
        try {
          // --- 1. Lee todos los datos del formulario ---
          const cliente =
            document.getElementById("clienteNombre").value || "Cliente";
          const vehiculo =
            document.getElementById("vehiculoDesc").value || "Vehículo";
          const dominio =
            document.getElementById("dominio").value || "Sin Dominio";
          const honorarios = parseLocalNumber(
            document.getElementById("itemHonorarios").value
          );

          // --- 2. Dibuja el PDF (Encabezado) ---
          const logoWidth = 40;
          const logoHeight = 10;
          const logoX = pageCenter - logoWidth / 2;
          doc.addImage(logo, "JPEG", logoX, 10, logoWidth, logoHeight);

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text("CECCA AUTOS", pageCenter, 30, { align: "center" });
          doc.text("Aristóbulo del Valle 599, Guaymallén", pageCenter, 35, {
            align: "center",
          });
          doc.text("Mendoza, Argentina", pageCenter, 40, { align: "center" });

          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");

          let tituloPDF = "PRESUPUESTO DE GESTORÍA"; // Default
          if (tipoTramite === "moto") {
            tituloPDF = "PRESUPUESTO DE MOTO";
          } else if (tipoTramite === "denuncia_robo") {
            tituloPDF = "PRESUPUESTO DENUNCIA DE ROBO";
          }

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
          doc.setLineWidth(0.5);
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
              doc.text(
                `$ ${monto.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                pageWidth - 15,
                currentY,
                { align: "right" }
              );
              currentY += 8;
            }
          }

          // --- 3. Dibuja el CUERPO del PDF (Dinámico) ---

          // Leer Formularios (siempre se leen)
          const costF08 = document.getElementById("formF08").checked
            ? parseFloat(document.getElementById("formF08").dataset.cost)
            : 0;
          const costF02 = document.getElementById("formF02").checked
            ? parseFloat(document.getElementById("formF02").dataset.cost)
            : 0;
          const costF04 = document.getElementById("formF04").checked
            ? parseFloat(document.getElementById("formF04").dataset.cost)
            : 0;
          const costF59 = document.getElementById("formF59").checked
            ? parseFloat(document.getElementById("formF59").dataset.cost)
            : 0;
          const cost13I = document.getElementById("form13I").checked
            ? parseFloat(document.getElementById("form13I").dataset.cost)
            : 0;
          const cost3D = document.getElementById("form3D").checked
            ? parseFloat(document.getElementById("form3D").dataset.cost)
            : 0;
          // ** NUEVO: Leer Extravío **
          const costExtravio = document.getElementById("formExtravio").checked
            ? parseFloat(document.getElementById("formExtravio").dataset.cost)
            : 0;

          const totalFormularios =
            costF08 +
            costF02 +
            costF04 +
            costF59 +
            cost13I +
            cost3D +
            costExtravio;

          // Leer Firmas (siempre se leen)
          const cantFirmas =
            parseInt(document.getElementById("cantidadFirmas").value) || 0;
          const totalCertificaciones = cantFirmas * COSTO_POR_FIRMA;

          // Leer SUATS (siempre se leen)
          const cantSuats =
            parseInt(document.getElementById("cantidadSuats").value) || 0;
          const totalSuats = cantSuats * COSTO_POR_SUAT;

          if (tipoTramite === "denuncia_robo") {
            // --- PDF PARA DENUNCIA DE ROBO ---
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

            // === INICIO DEL CAMBIO ===
            // Agrupamos todos los costos de Denuncia + SUATS
            const gastosRegistrales =
              drArancel + drArancelBaja + ceArancel + iiArancel + totalSuats;

            agregarLinea("Gastos Registrales", gastosRegistrales);

            total =
              gastosRegistrales +
              totalFormularios +
              totalCertificaciones +
              honorarios;
            // === FIN DEL CAMBIO ===
          } else {
            // --- PDF PARA TRANSFERENCIA (AUTO/MOTO) ---
            const aranceles = parseLocalNumber(
              document.getElementById("itemAranceles").value
            );
            const sellado = parseLocalNumber(
              document.getElementById("itemSellado").value
            );
            const varios = parseLocalNumber(
              document.getElementById("itemVarios").value
            );

            const gastosRegistrales = aranceles + sellado + varios + totalSuats; // SUATS va aquí para transferencias

            total =
              gastosRegistrales +
              totalFormularios +
              totalCertificaciones +
              honorarios;

            agregarLinea(
              "Gastos Registrales (Aranceles, Sellado, Suats, etc.)",
              gastosRegistrales
            );
          }

          // --- SECCIONES COMUNES (Formularios, Suats, Firmas) ---

          // Sección Formularios (si hay)
          if (totalFormularios > 0) {
            currentY += 5;
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
            agregarLinea("Formulario Extravío", costExtravio); // ** NUEVO **
          }

          // === INICIO DEL CAMBIO ===
          // Sección SUATS (Eliminada de aquí)
          // Ya se incluye en "Gastos Registrales" en ambos casos.
          // === FIN DEL CAMBIO ===

          // Sección Firmas (si hay)
          if (totalCertificaciones > 0) {
            currentY += 5;
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

          // --- 4. Dibuja el PIE del PDF (Honorarios y Total) ---

          currentY += 5;
          doc.setLineWidth(0.5);
          doc.line(15, currentY, pageWidth - 15, currentY);
          currentY += 10;

          // Sección Honorarios
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("Honorarios", 15, currentY);
          currentY += 10;
          doc.setFontSize(12);

          agregarLinea("Honorarios de Gestoría", honorarios);

          currentY += 5;
          doc.setLineWidth(0.5);
          doc.line(15, currentY, pageWidth - 15, currentY);

          // Total
          currentY += 12;
          doc.setFontSize(18);
          doc.setFont("helvetica", "bold");
          doc.text("TOTAL A ABONAR:", 15, currentY);
          doc.text(
            `$ ${total.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            pageWidth - 15,
            currentY,
            { align: "right" }
          );

          // Pie de página (fijo abajo)
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
            "CECCA AUTOS - info@ceccaautos.com.ar",
            pageCenter,
            footerY + 5,
            { align: "center" }
          );
          doc.text("+54 9 261 625-6518", pageCenter, footerY + 10, {
            align: "center",
          });

          resolve(doc);
        } catch (error) {
          console.error("Error al generar el PDF:", error);
          alert("Hubo un error al generar el PDF. Revisa la consola.");
          reject(error);
        }
      };

      logo.onerror = function () {
        alert(
          "Error: No se pudo cargar la imagen del logo. Revisa la ruta en 'presupuesto.js'."
        );
        reject("Error cargando el logo");
      };
    });
  }

  // --- Manejadores de eventos de los botones PDF (CON VALIDACIÓN) ---

  botonGenerarPDF.addEventListener("click", async (e) => {
    e.preventDefault();

    const totalFinal = parseLocalNumber(displayTotal.textContent);
    if (totalFinal === 0) {
      alert(
        "No se puede generar un presupuesto con total $0,00.\nPor favor, añade algún costo."
      );
      return;
    }

    pdfPreviewContainer.style.display = "none";
    try {
      await crearPDFInterno();
      const cliente =
        document.getElementById("clienteNombre").value || "Cliente";
      const dominio = document.getElementById("dominio").value || "SinDominio";

      let nombreArchivo = `Presupuesto - ${cliente} - ${dominio}.pdf`; // Default
      if (tipoTramite === "moto") {
        nombreArchivo = `Presupuesto Moto - ${cliente} - ${dominio}.pdf`;
      } else if (tipoTramite === "denuncia_robo") {
        nombreArchivo = `Presupuesto Denuncia Robo - ${cliente} - ${dominio}.pdf`;
      }

      doc.save(nombreArchivo);
    } catch (error) {
      console.error("Fallo al generar y descargar PDF:", error);
    }
  });

  botonPrevisualizarPDF.addEventListener("click", async (e) => {
    e.preventDefault();

    const totalFinal = parseLocalNumber(displayTotal.textContent);
    if (totalFinal === 0) {
      alert(
        "No se puede previsualizar un presupuesto con total $0,00.\nPor favor, añade algún costo."
      );
      return;
    }

    try {
      await crearPDFInterno();
      const pdfDataUri = doc.output("datauristring");
      pdfPreviewFrame.src = pdfDataUri;
      pdfPreviewContainer.style.display = "block";
      pdfPreviewContainer.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Fallo al previsualizar PDF:", error);
    }
  });

  cerrarPrevisualizacionBtn.addEventListener("click", () => {
    pdfPreviewContainer.style.display = "none";
    pdfPreviewFrame.src = "";
  });

  // --- Parte 3: Copiar Dominio y abrir enlace DNRPA ---

  const inputDominio = document.getElementById("dominio");
  const btnCopiarDominio = document.getElementById("btnCopiarDominio");
  const urlDNRPA = "https://www2.jus.gov.ar/dnrpa-site/#!/estimador";

  if (btnCopiarDominio) {
    btnCopiarDominio.addEventListener("click", () => {
      const dominioTexto = inputDominio.value
        .trim()
        .toUpperCase()
        .replace(/\s/g, "");

      if (!dominioTexto) {
        window.open(urlDNRPA, "_blank");
        return;
      }

      navigator.clipboard
        .writeText(dominioTexto)
        .then(() => {
          const originalText = btnCopiarDominio.textContent;
          btnCopiarDominio.textContent = "✓";
          window.open(urlDNRPA, "_blank");
          setTimeout(() => {
            btnCopiarDominio.textContent = originalText;
          }, 1500);
        })
        .catch((err) => {
          console.error("Error al copiar el dominio: ", err);
          window.open(urlDNRPA, "_blank");
        });
    });
  } else {
    console.warn("No se encontró el botón con id 'btnCopiarDominio'.");
  }

  // --- Parte 4 (Revisada): Cálculo automático de Sellado (1.25%) ---

  const inputTasacion = document.getElementById("valorTasacion");
  const inputSellado = document.getElementById("itemSellado");

  if (inputTasacion && inputSellado) {
    inputTasacion.addEventListener("input", () => {
      const baseValue = parseLocalNumber(inputTasacion.value);
      const calculatedValue = baseValue * 0.0125;
      inputSellado.value = calculatedValue.toFixed(2).replace(".", ",");
      calcularTotal();
    });
  }

  // --- Parte 5: Bloquear entrada de letras en campos numéricos ---

  const camposSoloNumeros = [
    "itemAranceles",
    "valorTasacion",
    "itemVarios",
    "itemHonorarios",
    // AÑADIDOS LOS NUEVOS CAMPOS
    "drArancel",
    "drArancelBaja",
    "ceArancel",
    "iiArancel",
  ];

  function forzarEntradaNumerica(event) {
    const valorActual = event.target.value;
    const valorLimpio = valorActual.replace(/[^0-9.,]/g, "");
    if (valorActual !== valorLimpio) {
      event.target.value = valorLimpio;
    }
  }

  camposSoloNumeros.forEach((id) => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.addEventListener("input", forzarEntradaNumerica);
    }
  });
});
