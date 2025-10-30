// Espera a que la página esté cargada
document.addEventListener('DOMContentLoaded', () => {

  // =================================================================
  // ¡IMPORTANTE! CAMBIA ESTE VALOR POR TU COSTO REAL POR FIRMA
  const COSTO_POR_FIRMA = 30000; 
  // =================================================================

  // --- Parte 1: Calcular el total automáticamente ---
  
  const camposInput = document.querySelectorAll('.calc');
  const camposCheckbox = document.querySelectorAll('.calc-check');
  const selectFirmas = document.getElementById('cantidadFirmas');
  const displayTotal = document.getElementById('totalDisplay');
  const displayTotalFirmas = document.getElementById('totalFirmas');

  function formatCurrency(value) {
    return value.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function calcularTotal() {
    let total = 0;
    
    // Suma los campos de texto/número
    camposInput.forEach(campo => {
      const valor = parseFloat(campo.value) || 0;
      total += valor;
    });

    // Suma los checkboxes chequeados
    camposCheckbox.forEach(checkbox => {
      if (checkbox.checked) {
        total += parseFloat(checkbox.dataset.cost) || 0;
      }
    });

    // Suma las certificaciones de firma
    const cantFirmas = parseInt(selectFirmas.value) || 0;
    const subtotalFirmas = cantFirmas * COSTO_POR_FIRMA;
    total += subtotalFirmas;

    // Actualiza los displays
    displayTotalFirmas.value = `$ ${formatCurrency(subtotalFirmas)}`;
    displayTotal.textContent = formatCurrency(total);
  }

  // Añade "escuchadores" a todos los campos
  camposInput.forEach(campo => campo.addEventListener('input', calcularTotal));
  camposCheckbox.forEach(checkbox => checkbox.addEventListener('change', calcularTotal));
  selectFirmas.addEventListener('change', calcularTotal);

  // Calcula el total por primera vez
  calcularTotal();

  // --- Parte 2: Generar y Previsualizar el PDF ---

  const botonGenerarPDF = document.getElementById('generarPDF');
  const botonPrevisualizarPDF = document.getElementById('previsualizarPDF');
  const pdfPreviewContainer = document.getElementById('pdfPreviewContainer');
  const pdfPreviewFrame = document.getElementById('pdfPreviewFrame');
  const cerrarPrevisualizacionBtn = document.getElementById('cerrarPrevisualizacion');

  let doc = null; 

  // --- Función principal para crear el PDF ---
  function crearPDFInterno() {
    const { jsPDF } = window.jspdf;
    doc = new jsPDF(); 

    // Variables de página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageCenter = pageWidth / 2;

    const logo = new Image();
    // =================================================================
    // ¡IMPORTANTE! CAMBIA ESTA RUTA POR LA RUTA DE TU LOGO
    logo.src = 'assets/logo-cecca.jpg'; // Usando .jpg como me indicaste
    // =================================================================

    return new Promise((resolve, reject) => {
      logo.onload = function() {
        try {
          // --- 1. Lee todos los datos del formulario ---
          const cliente = document.getElementById('clienteNombre').value || "Cliente";
          const vehiculo = document.getElementById('vehiculoDesc').value || "Vehículo";
          const dominio = document.getElementById('dominio').value || "Sin Dominio";

          const aranceles = parseFloat(document.getElementById('itemAranceles').value) || 0;
          const sellado = parseFloat(document.getElementById('itemSellado').value) || 0;
          const varios = parseFloat(document.getElementById('itemVarios').value) || 0;
          
          const formF08_check = document.getElementById('formF08');
          const formF02_check = document.getElementById('formF02');
          const formF04_check = document.getElementById('formF04');
          const formF59_check = document.getElementById('formF59');
          const costF08 = formF08_check.checked ? (parseFloat(formF08_check.dataset.cost) || 0) : 0;
          const costF02 = formF02_check.checked ? (parseFloat(formF02_check.dataset.cost) || 0) : 0;
          const costF04 = formF04_check.checked ? (parseFloat(formF04_check.dataset.cost) || 0) : 0;
          const costF59 = formF59_check.checked ? (parseFloat(formF59_check.dataset.cost) || 0) : 0;
          
          const cantFirmas = parseInt(document.getElementById('cantidadFirmas').value) || 0;
          const totalCertificaciones = cantFirmas * COSTO_POR_FIRMA;
          const honorarios = parseFloat(document.getElementById('itemHonorarios').value) || 0;
          
          const total = aranceles + sellado + varios +
                        costF08 + costF02 + costF04 + costF59 +
                        totalCertificaciones + honorarios;

          // --- 2. Dibuja el PDF ---
          
          // Membrete Centrado
          const logoWidth = 40;
          const logoHeight = 10;
          const logoX = pageCenter - (logoWidth / 2);
          
          doc.addImage(logo, 'JPEG', logoX, 10, logoWidth, logoHeight); 
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text('CECCA AUTOS', pageCenter, 30, { align: 'center' });
          doc.text('Aristóbulo del Valle 599, Guaymallén', pageCenter, 35, { align: 'center' });
          doc.text('Mendoza, Argentina', pageCenter, 40, { align: 'center' });
          
          // Título
          doc.setFontSize(20);
          doc.setFont('helvetica', 'bold');
          doc.text('PRESUPUESTO DE GESTORÍA', pageCenter, 60, { align: 'center' });
          doc.setLineWidth(0.5);
          doc.line(15, 65, pageWidth - 15, 65);

          // Datos del cliente
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, pageWidth - 15, 75, { align: 'right' });
          doc.text(`Cliente: ${cliente}`, 15, 75);
          doc.text(`Vehículo: ${vehiculo}`, 15, 82);
          doc.text(`Dominio: ${dominio}`, 15, 89);
          doc.setLineWidth(0.5);
          doc.line(15, 98, pageWidth - 15, 98);

          // Detalle de costos
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Detalle de Costos', 15, 108);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          let currentY = 118; 

          function agregarLinea(texto, monto) {
            if (monto > 0) {
              doc.text(texto, 20, currentY);
              doc.text(`$ ${formatCurrency(monto)}`, pageWidth - 15, currentY, { align: 'right' });
              currentY += 8;
            }
          }
          
          agregarLinea('Aranceles DNRPA', aranceles);
          agregarLinea('Sellado Rentas', sellado);
          agregarLinea('Aranceles Varios', varios);
          
          // Sección Formularios
          currentY += 5; 
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Formularios', 15, currentY);
          currentY += 10;
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');
          
          agregarLinea('Formulario F08', costF08);
          agregarLinea('Formulario F02', costF02);
          agregarLinea('Formulario F04', costF04);
          agregarLinea('Formulario F59', costF59);
          
          // Sección: Certificaciones de Firma
          currentY += 5;
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Certificaciones de Firma', 15, currentY);
          currentY += 10;
          doc.setFontSize(12);
          doc.setFont('helvetica', 'normal');

          agregarLinea(`Cantidad de Firmas (${cantFirmas} x $${formatCurrency(COSTO_POR_FIRMA)})`, totalCertificaciones);

          currentY += 5;
          doc.setLineWidth(0.5);
          doc.line(15, currentY, pageWidth - 15, currentY);
          currentY += 10;

          // Sección Honorarios
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Honorarios', 15, currentY);
          currentY += 10;
          doc.setFontSize(12);
          
          agregarLinea('Honorarios de Gestoría', honorarios);

          currentY += 5;
          doc.setLineWidth(0.5);
          doc.line(15, currentY, pageWidth - 15, currentY);

          // Total
          currentY += 12;
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.text('TOTAL A ABONAR:', 15, currentY);
          doc.text(`$ ${formatCurrency(total)}`, pageWidth - 15, currentY, { align: 'right' });

          // Pie de página (fijo abajo)
          const footerY = pageHeight - 20; // 20mm desde el fondo
          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          doc.text('Presupuesto válido por 5 días hábiles.', pageCenter, footerY, { align: 'center' });
          doc.text('CECCA AUTOS - info@ceccaautos.com.ar', pageCenter, footerY + 5, { align: 'center' });
          doc.text('+54 9 261 625-6518', pageCenter, footerY + 10, { align: 'center' });

          resolve(doc); 
        } catch (error) {
          console.error("Error al generar el PDF:", error);
          alert("Hubo un error al generar el PDF. Revisa la consola.");
          reject(error);
        }
      };

      logo.onerror = function() {
        alert("Error: No se pudo cargar la imagen del logo. Revisa la ruta en 'presupuesto.js'.");
        reject("Error cargando el logo");
      };
    });
  }

  // --- Manejadores de eventos de los botones ---

  botonGenerarPDF.addEventListener('click', async (e) => {
    e.preventDefault();
    pdfPreviewContainer.style.display = 'none';
    try {
      await crearPDFInterno();
      const cliente = document.getElementById('clienteNombre').value || 'Cliente';
      const dominio = document.getElementById('dominio').value || 'SinDominio';
      doc.save(`Presupuesto - ${cliente} - ${dominio}.pdf`);
    } catch (error) {
      console.error("Fallo al generar y descargar PDF:", error);
    }
  });

  botonPrevisualizarPDF.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await crearPDFInterno();
      const pdfDataUri = doc.output('datauristring');
      pdfPreviewFrame.src = pdfDataUri;
      pdfPreviewContainer.style.display = 'block';
      pdfPreviewContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error("Fallo al previsualizar PDF:", error);
    }
  });

  cerrarPrevisualizacionBtn.addEventListener('click', () => {
    pdfPreviewContainer.style.display = 'none';
    pdfPreviewFrame.src = '';
  });

});