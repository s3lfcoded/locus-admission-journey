import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Robust client-side PDF exporter that generates a downloadable .pdf file.
 * Solves the issue where window.print() is completely unsupported/disabled
 * in mobile browsers (Android Chrome, iOS Safari, WhatsApp/Telegram webviews).
 */
export async function downloadElementAsPdf(elementId, filename = 'unipath-admission-plan.pdf') {
  const el = document.getElementById(elementId);
  if (!el) {
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
    return false;
  }

  // Clone element into off-screen container with explicit dimensions
  const clone = el.cloneNode(true);
  clone.id = elementId + '-export-clone';
  clone.style.display = 'block';
  clone.style.position = 'fixed';
  clone.style.top = '0';
  clone.style.left = '-9999px';
  clone.style.width = '794px'; // Standard A4 width in pixels at 96 DPI
  clone.style.maxWidth = '794px';
  clone.style.background = '#ffffff';
  clone.style.color = '#0f172a';
  clone.style.zIndex = '-99999';
  clone.style.opacity = '1';
  clone.style.pointerEvents = 'none';

  // Ensure all children are visible
  const hiddenElements = clone.querySelectorAll('.no-print, [hidden]');
  hiddenElements.forEach((h) => {
    if (h.classList.contains('no-print')) {
      h.style.display = 'none';
    }
  });

  document.body.appendChild(clone);

  try {
    // Render using html2canvas
    const canvas = await html2canvas(clone, {
      scale: 2, // 2x scale for crisp retina typography
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfPageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfPageHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const imgHeight = (canvas.height * pdfPageWidth) / canvas.width;

    if (imgHeight <= pdfPageHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfPageWidth, imgHeight);
    } else {
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfPageWidth, imgHeight);
      heightLeft -= pdfPageHeight;

      while (heightLeft > 0) {
        position -= pdfPageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfPageWidth, imgHeight);
        heightLeft -= pdfPageHeight;
      }
    }

    // Save triggers native browser download on both mobile & desktop
    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('[PDF Export] HTML2Canvas/jsPDF error:', err);
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      try {
        window.print();
      } catch (e) {
        // ignore
      }
    }
    return false;
  } finally {
    if (clone && clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
  }
}
