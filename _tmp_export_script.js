
    // Bloqueo visual por contraseña (protección básica en frontend)
    const AUTH_PASSWORD = 'drodrigu040417';
    const gate = document.getElementById('auth-gate');
    const authForm = document.getElementById('auth-form');
    const authInput = document.getElementById('auth-password');
    const authError = document.getElementById('auth-error');

    const unlockSite = () => {
      document.body.classList.remove('gated');
      gate.setAttribute('hidden', '');
    };

    authInput?.focus();

    authForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      if ((authInput.value || '').trim() === AUTH_PASSWORD) {
        authError.textContent = '';
        unlockSite();
        return;
      }
      authError.textContent = 'Contraseña incorrecta.';
      authInput.value = '';
      authInput.focus();
    });

    // Menu accesible y responsive
    const btn = document.querySelector('.menu');
    const list = document.getElementById('site-nav');
    const toggleNav = () => {
      const open = list.hasAttribute('hidden');
      if (open) list.removeAttribute('hidden'); else list.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', toggleNav);

    list.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (window.innerWidth <= 980) { list.setAttribute('hidden', ''); btn.setAttribute('aria-expanded', 'false'); }
    }));

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const hash = a.getAttribute('href');
        const el = document.querySelector(hash);
        if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });

    const QUICK_STORAGE_KEY = 'cvQuickEntriesV1';
    const QUICK_EDITS_STORAGE_KEY = 'cvCardEditsV1';
    const PROOFS_STATIC_INDEX_URL = '/justificantes/index.json';
    const PROOFS_STATIC_BASE = '/justificantes';
    const PROOFS_API_BASE = (() => {
      const host = (window.location.hostname || '').toLowerCase();
      if (host === '127.0.0.1' || host === 'localhost') return '/api/proofs';
      return '';
    })();
    const quickSettings = document.getElementById('quick-settings');
    const quickSettingsMain = document.getElementById('quick-settings-main');
    const quickSettingsMenu = document.getElementById('quick-settings-menu');
    const quickSettingsAdd = document.getElementById('quick-settings-add');
    const quickSettingsEdit = document.getElementById('quick-settings-edit');
    const quickSettingsPublish = document.getElementById('quick-settings-publish');
    const quickPublishStatus = document.getElementById('quick-publish-status');
    const quickAddModal = document.getElementById('quick-add-modal');
    const quickAddClose = document.getElementById('quick-add-close');
    const quickAddCancel = document.getElementById('quick-add-cancel');
    const quickAddForm = document.getElementById('quick-add-form');
    const quickTypeWrap = document.getElementById('quick-type-wrap');
    const quickType = document.getElementById('quick-type');
    const quickTitleWrap = document.getElementById('quick-title-wrap');
    const quickTitleLabel = document.getElementById('quick-title-label');
    const quickTitle = document.getElementById('quick-title');
    const quickFields = Array.from(document.querySelectorAll('.quick-field'));
    const quickWorkKind = document.getElementById('quick-work-kind');
    const quickStudent = document.getElementById('quick-student');
    const quickStudentLabel = document.getElementById('quick-student-label');
    const quickRole = document.getElementById('quick-role');
    const quickDegree = document.getElementById('quick-degree');
    const quickDefense = document.getElementById('quick-defense');
    const quickCourse = document.getElementById('quick-course');
    const quickGrade = document.getElementById('quick-grade');
    const quickAuthors = document.getElementById('quick-authors');
    const quickJournal = document.getElementById('quick-journal');
    const quickYear = document.getElementById('quick-year');
    const quickDoi = document.getElementById('quick-doi');
    const quickQuartile = document.getElementById('quick-quartile');
    const quickProjectCat = document.getElementById('quick-project-cat');
    const quickPeriod = document.getElementById('quick-period');
    const quickProjectYear = document.getElementById('quick-project-year');
    const quickFunding = document.getElementById('quick-funding');
    const quickEntity = document.getElementById('quick-entity');
    const quickTalkKind = document.getElementById('quick-talk-kind');
    const quickEvent = document.getElementById('quick-event');
    const quickLocation = document.getElementById('quick-location');
    const quickTalkDate = document.getElementById('quick-talk-date');
    const quickTalkCat = document.getElementById('quick-talk-cat');
    const quickSubjectDegree = document.getElementById('quick-subject-degree');
    const quickSubjectHoursT = document.getElementById('quick-subject-hours-t');
    const quickSubjectHoursP = document.getElementById('quick-subject-hours-p');
    const quickSubjectCourse = document.getElementById('quick-subject-course');
    const quickContactEmailText = document.getElementById('quick-contact-email-text');
    const quickContactEmailLink = document.getElementById('quick-contact-email-link');
    const quickContactInstitution = document.getElementById('quick-contact-institution');
    const quickContactOrcid = document.getElementById('quick-contact-orcid');
    const quickContactScholar = document.getElementById('quick-contact-scholar');
    const quickContactRg = document.getElementById('quick-contact-rg');
    const quickContactUja = document.getElementById('quick-contact-uja');
    const quickProofPanel = document.getElementById('quick-proof-panel');
    const quickProofUpload = document.getElementById('quick-proof-upload');
    const quickProofOpen = document.getElementById('quick-proof-open');
    const quickProofRemove = document.getElementById('quick-proof-remove');
    const quickProofInput = document.getElementById('quick-proof-input');
    const quickProofName = document.getElementById('quick-proof-name');
    const proofToast = document.getElementById('proof-toast');
    const quickSubjectsBlock = document.getElementById('quick-subjects-block');
    const pubQ3Btn = document.getElementById('pub-q3-btn');
    const pubQ3Summary = document.getElementById('pub-q3-summary');
    const pubAllBtn = document.querySelector('#pub-filters button[data-filter="all"]');
    const EXPORT_BUTTON_ICON = `
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3v12"></path>
        <path d="m7 10 5 5 5-5"></path>
        <path d="M5 21h14"></path>
      </svg>
    `;

    const getQuickEntries = () => {
      try {
        const raw = localStorage.getItem(QUICK_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (_) {
        return [];
      }
    };

    const saveQuickEntries = (entries) => {
      try {
        localStorage.setItem(QUICK_STORAGE_KEY, JSON.stringify(entries));
      } catch (_) {
        // ignore storage errors
      }
    };

    const getCardEdits = () => {
      try {
        const raw = localStorage.getItem(QUICK_EDITS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch (_) {
        return {};
      }
    };

    const saveCardEdits = (edits) => {
      try {
        localStorage.setItem(QUICK_EDITS_STORAGE_KEY, JSON.stringify(edits));
      } catch (_) {
        // ignore storage errors
      }
    };

    let proofToastTimer = null;

    const showProofToast = (message) => {
      if (!proofToast) return;
      proofToast.textContent = message;
      proofToast.classList.add('is-visible');
      if (proofToastTimer) window.clearTimeout(proofToastTimer);
      proofToastTimer = window.setTimeout(() => {
        proofToast.classList.remove('is-visible');
      }, 2200);
    };

    const showPublishStatus = (message, persist = false) => {
      if (!quickPublishStatus) return;
      quickPublishStatus.textContent = message;
      quickPublishStatus.hidden = false;
      if (!persist) {
        window.setTimeout(() => {
          if (quickPublishStatus.textContent === message) quickPublishStatus.hidden = true;
        }, 2800);
      }
    };

    const isLocalProofHost = () => Boolean(PROOFS_API_BASE);
    const getLocalProofUploadMessage = () =>
      'La subida de justificantes solo funciona en local. Sube el PDF en local y luego haz git push.';
    const showLocalProofUploadMessage = () => {
      showProofToast(getLocalProofUploadMessage());
    };

    const slugifyFileName = (text) =>
      String(text || 'seccion')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'seccion';

    const isPdfMergeLibraryReady = () => Boolean(window.PDFLib?.PDFDocument);

    const isElementVisibleForExport = (node) =>
      Boolean(node && !node.hidden && !node.classList.contains('is-hidden'));

    const getTextContent = (selector, scope = document) =>
      (scope?.querySelector(selector)?.textContent || '').replace(/\s+/g, ' ').trim();

    const buildDynamicSubtitle = (count, singular, plural, suffix = 'visibles en esta seccion.') =>
      `Se exportan ${count} ${count === 1 ? singular : plural} ${suffix}`.trim();

    const getAcademicSectionTitleBlock = () =>
      document.querySelector('#tfg-tfm > .container.stack-2 > .title');

    const getAcademicTrainingColumn = () =>
      document.querySelector('#sobre-mi .grid-2 > .stack-1:last-child');

    const getSectionExportConfigs = () => [
      {
        key: 'formacion-academica',
        host: () => getAcademicTrainingColumn(),
        anchor: () => getAcademicTrainingColumn()?.querySelector(':scope > h3'),
        title: () => getTextContent(':scope > h3', getAcademicTrainingColumn()) || 'Formacion Academica',
        subtitle: () => '',
        countLabel: (count) => `${count} ${count === 1 ? 'merito academico' : 'meritos academicos'}`,
        items: () => Array.from(getAcademicTrainingColumn()?.querySelectorAll(':scope > .card') || [])
          .filter(isElementVisibleForExport),
        proofIds: () => Array.from(getAcademicTrainingColumn()?.querySelectorAll(':scope > .card') || [])
          .filter(isElementVisibleForExport)
          .map((item) => getProofHostId(item))
          .filter(Boolean)
      },
      {
        key: 'publicaciones',
        host: () => document.getElementById('acad-title-block'),
        title: () => getTextContent('h2', document.getElementById('acad-title-block')) || 'Publicaciones',
        subtitle: (count) => buildDynamicSubtitle(count, 'publicacion', 'publicaciones'),
        countLabel: (count) => `${count} ${count === 1 ? 'publicacion' : 'publicaciones'}`,
        items: () => Array.from(document.querySelectorAll('#publicaciones .stack-1 > article.card'))
          .filter(isElementVisibleForExport),
        proofIds: () => Array.from(document.querySelectorAll('#publicaciones .stack-1 > article.card'))
          .filter(isElementVisibleForExport)
          .map((item) => getProofHostId(item))
          .filter(Boolean)
      },
      {
        key: 'congresos',
        host: () => document.querySelector('#congresos .title'),
        title: () => getTextContent('#congresos .title h2') || 'Congresos y Conferencias',
        subtitle: (count) => buildDynamicSubtitle(count, 'contribucion', 'contribuciones'),
        countLabel: (count) => `${count} ${count === 1 ? 'contribucion' : 'contribuciones'}`,
        items: () => Array.from(document.querySelectorAll('#congresos .stack-1 > .card'))
          .filter(isElementVisibleForExport),
        proofIds: () => Array.from(document.querySelectorAll('#congresos .stack-1 > .card'))
          .filter(isElementVisibleForExport)
          .map((item) => getProofHostId(item))
          .filter(Boolean)
      },
      {
        key: 'proyectos',
        host: () => document.querySelector('#proyectos .title'),
        title: () => getTextContent('#projects-main-title') || 'Proyectos',
        subtitle: (count) => buildDynamicSubtitle(count, 'proyecto', 'proyectos'),
        countLabel: (count) => `${count} ${count === 1 ? 'proyecto' : 'proyectos'}`,
        items: () => Array.from(document.querySelectorAll('#proyectos > .container.stack-2 > .stack-1 > .card, #proyectos > .container.stack-2 > .card'))
          .filter(isElementVisibleForExport),
        proofIds: () => Array.from(document.querySelectorAll('#proyectos > .container.stack-2 > .stack-1 > .card, #proyectos > .container.stack-2 > .card'))
          .filter(isElementVisibleForExport)
          .map((item) => getProofHostId(item))
          .filter(Boolean)
      },
      {
        key: 'docencia',
        host: () => document.getElementById('docencia-title-block'),
        title: () => getTextContent('#docencia-title-block h2') || 'Docencia',
        subtitle: (count) => buildDynamicSubtitle(count, 'bloque docente', 'bloques docentes'),
        countLabel: (count) => `${count} ${count === 1 ? 'bloque docente' : 'bloques docentes'}`,
        items: () => Array.from(document.querySelectorAll('#docencia .year-card, #quick-subjects-stack > .card'))
          .filter(isElementVisibleForExport),
        proofIds: () => ['group-docencia']
      },
      {
        key: 'direccion-academica',
        host: () => getAcademicSectionTitleBlock(),
        title: () => getTextContent('#acad-main-title') || 'Dirección académica',
        subtitle: (count) => buildDynamicSubtitle(count, 'merito academico', 'meritos academicos', 'visibles del bloque actual.'),
        countLabel: (count) => `${count} ${count === 1 ? 'merito academico' : 'meritos academicos'}`,
        items: () => Array.from(document.querySelectorAll('#tfg-stack .card, #tfm-stack .card, #trib-stack .card'))
          .filter(isElementVisibleForExport),
        proofIds: () => {
          const ids = [];
          if (isElementVisibleForExport(document.getElementById('tfg-stack'))) ids.push('group-tfg');
          if (isElementVisibleForExport(document.getElementById('tfm-stack'))) ids.push('group-tfm');
          if (isElementVisibleForExport(document.getElementById('trib-stack'))) ids.push('group-tribunales');
          return ids;
        }
      }
    ];

    const normalizeExportLine = (text) =>
      String(text || '').replace(/\s+/g, ' ').replace(/[‐‑‒–—]/g, '-').trim();

    const sanitizeExportClone = (node) => {
      const clone = node.cloneNode(true);
      clone.querySelectorAll('.inline-edit-btn, .inline-delete-btn, .inline-proof-wrap, .subject-edit-btn, .subject-delete-btn').forEach((el) => el.remove());
      clone.querySelectorAll('details').forEach((details) => {
        details.open = true;
      });
      clone.querySelectorAll('a').forEach((link) => {
        const text = normalizeExportLine(link.textContent);
        const href = link.getAttribute('href') || '';
        link.textContent = text || href;
      });
      return clone;
    };

    const extractTableLines = (table) => {
      const lines = [];
      const rows = Array.from(table?.querySelectorAll('tbody tr') || []);
      rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll('td, th'))
          .map((cell) => normalizeExportLine(cell.textContent))
          .filter(Boolean);
        if (cells.length) lines.push(`- ${cells.join(' | ')}`);
      });
      return lines;
    };

    const extractItemLines = (node) => {
      const clone = sanitizeExportClone(node);
      const lines = [];
      const push = (value, prefix = '') => {
        const text = normalizeExportLine(value);
        if (!text) return;
        const full = prefix ? `${prefix}${text}` : text;
        if (!lines.includes(full)) lines.push(full);
      };

      if (clone.classList.contains('year-card')) {
        push(clone.querySelector('.year-head h4')?.textContent);
        push(clone.querySelector('.year-badge')?.textContent);
        push(clone.querySelector('summary')?.textContent);
        extractTableLines(clone.querySelector('table')).forEach((line) => push(line));
        return lines;
      }

      push(clone.querySelector('.tag, .pill')?.textContent);
      push(clone.querySelector('h3, h4')?.textContent);
      Array.from(clone.querySelectorAll('p')).forEach((paragraph) => push(paragraph.textContent));
      Array.from(clone.querySelectorAll('table')).forEach((table) => {
        extractTableLines(table).forEach((line) => push(line));
      });

      if (!lines.length) push(clone.textContent);
      return lines;
    };

    const buildSectionExportBlocks = (items) =>
      items.map((item, index) => ({
        label: `Merito ${index + 1}`,
        lines: extractItemLines(item)
      }));

    const wrapPdfText = (text, font, size, maxWidth) => {
      const words = normalizeExportLine(text).split(' ').filter(Boolean);
      if (!words.length) return [''];
      const lines = [];
      let current = words[0];
      for (let i = 1; i < words.length; i += 1) {
        const candidate = `${current} ${words[i]}`;
        if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
          current = candidate;
        } else {
          lines.push(current);
          current = words[i];
        }
      }
      lines.push(current);
      return lines;
    };

    const drawWrappedPdfText = (page, text, options) => {
      const {
        x,
        y,
        maxWidth,
        font,
        size,
        lineHeight,
        color
      } = options;
      const lines = wrapPdfText(text, font, size, maxWidth);
      lines.forEach((line, index) => {
        page.drawText(line, {
          x,
          y: y - (index * lineHeight),
          size,
          font,
          color
        });
      });
      return y - (lines.length * lineHeight);
    };

    const drawPdfBox = (page, x, y, width, height, options = {}) => {
      page.drawRectangle({
        x,
        y,
        width,
        height,
        color: options.fill,
        borderColor: options.border,
        borderWidth: options.borderWidth ?? 1,
        opacity: options.opacity ?? 1
      });
    };

    const getSectionProofRecords = async (config) => {
      const proofIds = Array.from(new Set((typeof config.proofIds === 'function' ? config.proofIds() : [])
        .filter(Boolean)));
      const records = [];
      for (const proofId of proofIds) {
        const record = await getProofRecord(proofId);
        if (!record?.url && !record?.stored_path) continue;
        records.push({ id: proofId, record });
      }
      return records;
    };

    const renderSectionSummaryPdf = async ({ title, subtitle, countLabel, proofCount, items }) => {
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      const pdfDoc = await PDFDocument.create();
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 48;
      const contentWidth = pageWidth - (margin * 2);
      const cover = pdfDoc.addPage([pageWidth, pageHeight]);

      drawPdfBox(cover, 0, 0, pageWidth, pageHeight, {
        fill: rgb(0.98, 0.99, 1),
        borderWidth: 0
      });
      drawPdfBox(cover, 0, pageHeight - 220, pageWidth, 220, {
        fill: rgb(0.1, 0.23, 0.38),
        borderWidth: 0
      });

      cover.drawText('CURRICULUM DE MERITOS', {
        x: margin,
        y: pageHeight - 86,
        size: 12,
        font: boldFont,
        color: rgb(0.84, 0.9, 0.97)
      });
      drawWrappedPdfText(cover, title, {
        x: margin,
        y: pageHeight - 138,
        maxWidth: contentWidth,
        font: boldFont,
        size: 28,
        lineHeight: 34,
        color: rgb(1, 1, 1)
      });

      drawPdfBox(cover, margin, pageHeight - 248, 220, 32, {
        fill: rgb(0.87, 0.92, 0.99),
        borderWidth: 0
      });
      cover.drawText(countLabel, {
        x: margin + 14,
        y: pageHeight - 236,
        size: 14,
        font: boldFont,
        color: rgb(0.1, 0.23, 0.38)
      });

      let coverY = pageHeight - 320;
      if (subtitle) {
        coverY = drawWrappedPdfText(cover, subtitle, {
          x: margin,
          y: coverY,
          maxWidth: contentWidth,
          font: regularFont,
          size: 13,
          lineHeight: 19,
          color: rgb(0.21, 0.3, 0.39)
        }) - 18;
      }
      coverY = drawWrappedPdfText(
        cover,
        proofCount > 0
          ? `Incluye ${proofCount} ${proofCount === 1 ? 'justificante PDF anexo' : 'justificantes PDF anexos'}.`
          : 'No hay justificantes PDF anexos en esta seccion.',
        {
          x: margin,
          y: coverY + 18,
          maxWidth: contentWidth,
          font: regularFont,
          size: 13,
          lineHeight: 19,
          color: rgb(0.21, 0.3, 0.39)
        }
      ) - 18;
      drawWrappedPdfText(
        cover,
        `Documento generado el ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}.`,
        {
          x: margin,
          y: coverY,
          maxWidth: contentWidth,
          font: regularFont,
          size: 12,
          lineHeight: 18,
          color: rgb(0.33, 0.4, 0.5)
        }
      );

      const blocks = buildSectionExportBlocks(items);
      let page = cover;
      let currentY = coverY - 44;

      for (const block of blocks) {
        const titleLines = wrapPdfText(block.lines[0] || '', boldFont, 13, contentWidth - 28);
        const detailLines = block.lines.slice(1).flatMap((line) => wrapPdfText(line, regularFont, 11.5, contentWidth - 28));
        const preparedLines = [
          ...titleLines.map((line) => ({ text: line, font: boldFont, size: 13, lineHeight: 18 })),
          ...detailLines.map((line) => ({ text: line, font: regularFont, size: 11.5, lineHeight: 15 }))
        ];
        const textHeight = preparedLines.reduce((sum, line) => sum + line.lineHeight, 0);
        const estimatedHeight = 24 + 18 + textHeight + 12;
        if (currentY - estimatedHeight < margin) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }

        drawPdfBox(page, margin, currentY - estimatedHeight + 6, contentWidth, estimatedHeight, {
          fill: rgb(1, 1, 1),
          border: rgb(0.82, 0.88, 0.94),
          borderWidth: 1
        });
        page.drawText(block.label, {
          x: margin + 14,
          y: currentY - 18,
          size: 11,
          font: boldFont,
          color: rgb(0.26, 0.39, 0.53)
        });

        let lineY = currentY - 40;
        preparedLines.forEach((line) => {
          page.drawText(line.text, {
            x: margin + 14,
            y: lineY,
            size: line.size,
            font: line.font,
            color: rgb(0.14, 0.21, 0.29)
          });
          lineY -= line.lineHeight;
        });

        currentY -= estimatedHeight + 12;
      }

      return pdfDoc.save();
    };

    const mergePdfBuffers = async (baseBuffer, proofRecords) => {
      const { PDFDocument } = window.PDFLib;
      const mergedPdf = await PDFDocument.load(baseBuffer);
      let mergedProofs = 0;

      for (const { id, record } of proofRecords) {
        try {
          const response = await fetch(getProofUrl(id, record), { cache: 'no-store' });
          if (!response.ok) continue;
          const contentType = (response.headers.get('content-type') || record.type || '').toLowerCase();
          if (!contentType.includes('pdf')) continue;
          const bytes = await response.arrayBuffer();
          const proofPdf = await PDFDocument.load(bytes);
          const copiedPages = await mergedPdf.copyPages(proofPdf, proofPdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
          mergedProofs += 1;
        } catch (_) {
          // ignore broken proof files during export
        }
      }

      return {
        bytes: await mergedPdf.save(),
        mergedProofs
      };
    };

    const downloadPdfBytes = (bytes, fileName) => {
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    const exportSectionToPdf = async (config, button) => {
      const items = config.items();
      const title = config.title();
      const subtitle = typeof config.subtitle === 'function'
        ? config.subtitle(items.length, items)
        : '';
      if (!items.length) {
        showProofToast(`No hay meritos visibles en ${title}.`);
        return;
      }
      if (!isPdfMergeLibraryReady()) {
        showProofToast('La descarga PDF no esta disponible ahora mismo.');
        return;
      }

      const countLabel = typeof config.countLabel === 'function'
        ? config.countLabel(items.length)
        : `${items.length} ${items.length === 1 ? 'merito' : 'meritos'}`;
      if (button) button.disabled = true;
      showProofToast(`Generando PDF de ${title}...`);

      try {
        const proofRecords = await getSectionProofRecords(config);
        const baseBuffer = await renderSectionSummaryPdf({
          title,
          subtitle,
          countLabel,
          proofCount: proofRecords.length,
          items
        });
        const { bytes, mergedProofs } = await mergePdfBuffers(baseBuffer, proofRecords);
        downloadPdfBytes(bytes, `${slugifyFileName(title)}.pdf`);
        if (mergedProofs > 0) {
          showProofToast(`PDF preparado: ${title} + ${mergedProofs} justificantes.`);
        } else {
          showProofToast(`PDF preparado: ${title}.`);
        }
      } catch (_) {
        showProofToast(`No se pudo generar el PDF de ${title}.`);
      } finally {
        if (button) button.disabled = false;
      }
    };

    const ensureSectionExportButtons = () => {
      getSectionExportConfigs().forEach((config) => {
        const host = config.host();
        if (!host || host.querySelector(`:scope > .section-export-slot[data-export-key="${config.key}"]`)) return;
        const anchor = config.anchor?.();
        const slot = document.createElement('div');
        slot.className = 'section-export-slot';
        slot.dataset.exportKey = config.key;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'section-export-btn';
        button.innerHTML = `${EXPORT_BUTTON_ICON}<span>Descargar PDF</span>`;
        button.addEventListener('click', () => {
          exportSectionToPdf(config, button);
        });
        slot.appendChild(button);
        if (anchor?.parentNode === host) {
          anchor.insertAdjacentElement('afterend', slot);
          return;
        }
        host.appendChild(slot);
      });
    };

    const publishLocalChanges = async () => {
      if (!isLocalProofHost()) {
        showPublishStatus('Publicar cambios solo funciona en la web local.');
        return;
      }
      if (!quickSettingsPublish) return;
      quickSettingsPublish.disabled = true;
      showPublishStatus('Publicando cambios...', true);
      try {
        const response = await fetch('/api/publish', { method: 'POST' });
        const payload = await response.json().catch(() => ({}));
        showPublishStatus(payload?.message || 'No se pudo publicar los cambios.');
      } catch (_) {
        showPublishStatus('No se pudo conectar con el publicador local.');
      } finally {
        quickSettingsPublish.disabled = false;
      }
    };
    let proofIndexCache = null;

    const normalizeProofStoredPath = (storedPath) =>
      String(storedPath || '')
        .replace(/\\/g, '/')
        .replace(/^\/+/, '')
        .replace(/^\.\/+/, '');

    const getPublishedProofUrl = (record) => {
      if (record?.url) {
        const directUrl = String(record.url).trim();
        if (/^(https?:)?\/\//i.test(directUrl) || directUrl.startsWith('/')) return directUrl;
      }
      const normalizedPath = normalizeProofStoredPath(record?.stored_path);
      if (!normalizedPath) return '';
      const cleanPath = normalizedPath.startsWith('justificantes/')
        ? normalizedPath.replace(/^justificantes\//, '')
        : normalizedPath;
      const encodedPath = cleanPath
        .split('/')
        .filter(Boolean)
        .map((part) => encodeURIComponent(part))
        .join('/');
      return `${PROOFS_STATIC_BASE}/${encodedPath}`;
    };

    const loadPublishedProofIndex = async () => {
      if (proofIndexCache) return proofIndexCache;
      try {
        const response = await fetch(PROOFS_STATIC_INDEX_URL, { cache: 'no-store' });
        if (!response.ok) return {};
        proofIndexCache = await response.json();
        return proofIndexCache;
      } catch (_) {
        return {};
      }
    };

    const getProofRecord = async (id) => {
      if (!id) return null;
      if (!isLocalProofHost()) {
        const index = await loadPublishedProofIndex();
        return index?.[id] || null;
      }
      try {
        const response = await fetch(`${PROOFS_API_BASE}/${encodeURIComponent(id)}`, { cache: 'no-store' });
        if (!response.ok) return null;
        return await response.json();
      } catch (_) {
        return null;
      }
    };

    const saveProofRecord = async (record) => {
      if (!record?.id || !record?.file) return null;
      if (!isLocalProofHost()) return { error: 'local-upload-only' };
      const formData = new FormData();
      formData.append('proofId', record.id);
      formData.append('section', record.section || 'general');
      formData.append('file', record.file, record.name || record.file.name || 'documento');
      try {
        const response = await fetch(`${PROOFS_API_BASE}/upload`, {
          method: 'POST',
          body: formData
        });
        if (!response.ok) return null;
        return await response.json();
      } catch (_) {
        return null;
      }
    };

    const deleteProofRecord = async (id) => {
      if (!id || !isLocalProofHost()) return false;
      try {
        const response = await fetch(`${PROOFS_API_BASE}/${encodeURIComponent(id)}`, { method: 'DELETE' });
        return response.ok;
      } catch (_) {
        return false;
      }
    };

    const getProofUrl = (id, record = null) => {
      if (!id) return '';
      if (isLocalProofHost()) return `${PROOFS_API_BASE}/${encodeURIComponent(id)}/file`;
      return getPublishedProofUrl(record);
    };

    const getCurrentProofId = () => currentEditingCardId || currentEditingSubjectId || '';

    const syncQuickProofPanel = async () => {
      const proofId = getCurrentProofId();
      const showPanel = false;
      if (quickProofPanel) quickProofPanel.hidden = !showPanel;
      if (!showPanel) {
        if (quickProofName) quickProofName.textContent = 'Sin justificante subido.';
        if (quickProofUpload) {
          quickProofUpload.textContent = 'Subir PDF o archivo';
          quickProofUpload.classList.remove('has-file');
        }
        if (quickProofOpen) {
          quickProofOpen.hidden = true;
          quickProofOpen.removeAttribute('href');
        }
        if (quickProofRemove) quickProofRemove.hidden = true;
        if (quickProofInput) quickProofInput.value = '';
        return;
      }

      const record = await getProofRecord(proofId);
      if (!record?.stored_path && !record?.url) {
        if (quickProofName) quickProofName.textContent = 'Sin justificante subido.';
        if (quickProofUpload) {
          quickProofUpload.textContent = 'Subir PDF o archivo';
          quickProofUpload.classList.remove('has-file');
          quickProofUpload.hidden = !isLocalProofHost();
        }
        if (quickProofOpen) {
          quickProofOpen.hidden = true;
          quickProofOpen.removeAttribute('href');
        }
        if (quickProofRemove) quickProofRemove.hidden = true;
        return;
      }

      if (quickProofName) quickProofName.textContent = record.name || 'Justificante adjunto';
      if (quickProofUpload) {
        quickProofUpload.textContent = 'Reemplazar justificante';
        quickProofUpload.classList.add('has-file');
        quickProofUpload.hidden = !isLocalProofHost();
      }
      if (quickProofOpen) {
        quickProofOpen.href = getProofUrl(proofId, record);
        quickProofOpen.hidden = false;
      }
      if (quickProofRemove) quickProofRemove.hidden = !isLocalProofHost();
    };

    const getProofHostId = (node) => node?.dataset.editId || node?.dataset.proofId || '';

    const getProofSection = (node) => {
      if (!node) return 'general';
      const proofId = getProofHostId(node);
      if (proofId.startsWith('group-')) return proofId.replace('group-', '');
      const academicColumn = getAcademicTrainingColumn();
      if (academicColumn?.contains(node)) return 'formacion-academica';
      if (node.closest('#publicaciones')) return 'publicaciones';
      if (node.closest('#congresos')) return 'congresos';
      if (node.closest('#proyectos')) return 'proyectos';
      if (node.closest('#docencia')) return 'docencia';
      if (node.closest('#tfg-stack')) return 'tfg';
      if (node.closest('#tfm-stack')) return 'tfm';
      if (node.closest('#trib-stack')) return 'tribunales';
      return 'general';
    };

    const shouldRenderInlineProof = (card) => {
      if (!card) return false;
      const academicColumn = getAcademicTrainingColumn();
      return Boolean(
        card.closest('#publicaciones') ||
        card.closest('#congresos') ||
        card.closest('#proyectos') ||
        academicColumn?.contains(card)
      );
    };

    const QUICK_DELETES_STORAGE_KEY = 'cvCardDeletesV1';
    const getCardDeletes = () => {
      try {
        const raw = localStorage.getItem(QUICK_DELETES_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (_) {
        return [];
      }
    };
    const saveCardDeletes = (deletes) => {
      try {
        localStorage.setItem(QUICK_DELETES_STORAGE_KEY, JSON.stringify(deletes));
      } catch (_) {
        // ignore storage errors
      }
    };

    const escapeHtml = (text) =>
      String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const setQuickFormMode = () => {
      const currentType = quickType.value;
      quickFields.forEach((group) => {
        const accepted = (group.dataset.types || '').split(',').map((s) => s.trim());
        const show = accepted.includes(currentType);
        group.hidden = !show;
      });

      const setRoleOptions = (type) => {
        if (!quickRole) return;
        const currentValue = quickRole.value;
        const options = type === 'tribunal'
          ? ['Presidente', 'Secretario', 'Vocal']
          : ['Director', 'Codirector'];
        quickRole.innerHTML = options.map((opt) => `<option value="${opt}">${opt}</option>`).join('');
        quickRole.value = options.includes(currentValue) ? currentValue : options[0];
      };

      setRoleOptions(currentType);

      if (quickTitleLabel) {
        quickTitleLabel.textContent = currentType === 'asignatura' ? 'Asignatura' : 'Título';
      }
      if (quickTitleWrap) {
        quickTitleWrap.hidden = currentType === 'contacto';
      }
      if (quickTitle) {
        quickTitle.required = currentType !== 'contacto';
      }
      if (quickStudentLabel) {
        quickStudentLabel.textContent = currentType === 'tribunal' ? 'Alumno/a' : 'Estudiante';
      }
    };

    const getProjectStacks = () => {
      const container = document.querySelector('#proyectos > .container.stack-2');
      if (!container) return {};
      const stacks = Array.from(container.children).filter((el) => el.classList.contains('stack-1'));
      return {
        investigacion: stacks[0],
        innovación: stacks[1],
        transferencia: stacks[2]
      };
    };

    const createCardNode = (entry) => {
      const rawType = entry.type;
      const type = (rawType === 'tfg' || rawType === 'tfm') ? 'trabajo' : rawType;
      const { title, desc, extra = {} } = entry;
      const legacyMeta = entry.meta || '';
      if (type === 'trabajo') {
        const card = document.createElement('article');
        card.className = 'card';
        const workKind = ((extra.workKind || rawType || 'tfg').toLowerCase() === 'tfm') ? 'tfm' : 'tfg';
        const tagClass = workKind;
        const roleLabel = escapeHtml(extra.role || 'Director');
        const student = escapeHtml(extra.student || 'Pendiente');
        const metaChunks = [
          extra.degree || '',
          extra.defense ? `Defensa: ${extra.defense}` : '',
          extra.course || '',
          extra.grade || ''
        ].filter(Boolean);
        card.innerHTML = `
          <span class="tag ${tagClass}">${workKind.toUpperCase()} · ${roleLabel}</span>
          <h3>${escapeHtml(title)}</h3>
          <p class="pub-authors"><strong>Estudiante:</strong> ${student}</p>
          ${(metaChunks.length || legacyMeta) ? `<p class="pub-meta">${escapeHtml(metaChunks.length ? metaChunks.join(' · ') : legacyMeta)}</p>` : ''}
        `;
        return card;
      }

      if (type === 'articulo') {
        const quartile = ['q1', 'q2', 'q3'].includes(extra.quartile) ? extra.quartile : 'q2';
        const card = document.createElement('article');
        card.className = 'card';
        card.style.borderLeftColor = quartile === 'q1' ? 'var(--q1)' : (quartile === 'q2' ? 'var(--q2)' : '#a855f7');
        const meta = [extra.journal || '', extra.year || '', extra.doi ? `doi:${extra.doi}` : '']
          .filter(Boolean)
          .join(' · ');
        card.innerHTML = `
          <h3>${escapeHtml(title)}</h3>
          <p class="pub-authors">${escapeHtml(extra.authors || 'Autores pendientes')}</p>
          <p class="pub-meta">${escapeHtml(meta || legacyMeta || 'Pendiente de completar metadatos.')}</p>
          ${desc ? `<p>${escapeHtml(desc)}</p>` : ''}
        `;
        return card;
      }

      if (type === 'tribunal') {
        const card = document.createElement('article');
        card.className = 'card';
        const metaChunks = [
          extra.degree || '',
          extra.defense ? `Defensa: ${extra.defense}` : '',
          extra.course || '',
          extra.grade || ''
        ].filter(Boolean);
        card.innerHTML = `
          <span class="pill acc">${escapeHtml(extra.role || 'Vocal')}</span>
          <h3>${escapeHtml(title)}</h3>
          <p class="pub-authors"><strong>Alumno:</strong> ${escapeHtml(extra.student || 'Pendiente')}</p>
          ${metaChunks.length ? `<p class="pub-meta">${escapeHtml(metaChunks.join(' · '))}</p>` : ''}
        `;
        return card;
      }

      if (type === 'proyecto') {
        const card = document.createElement('div');
        card.className = 'card';
        const cat = extra.projectCategory || 'investigacion';
        const tagClass = cat === 'transferencia' ? 'tra' : (cat === 'innovación' ? 'inn' : 'nat');
        const tagLabel = cat === 'transferencia' ? 'Transferencia' : (cat === 'innovación' ? 'Innovación' : 'Investigación');
        const metaBits = [extra.period || '', extra.funding ? `Financiación: ${extra.funding}` : '', extra.entity || ''].filter(Boolean);
        card.innerHTML = `
          <span class="tag ${tagClass}">${tagLabel}</span>
          <h3>${escapeHtml(title)}</h3>
          ${extra.projectYear ? `<p><strong>${escapeHtml(extra.projectYear)}</strong></p>` : ''}
          ${(metaBits.length || legacyMeta) ? `<p class="pub-meta">${escapeHtml(metaBits.length ? metaBits.join(' · ') : legacyMeta)}</p>` : ''}
        `;
        return card;
      }

      if (type === 'asignatura') {
        const card = document.createElement('article');
        card.className = 'card';
        const legacyHours = extra.subjectHours || '';
        const subjectHours = legacyHours || [extra.subjectHoursT ? `T: ${extra.subjectHoursT}` : '', extra.subjectHoursP ? `P: ${extra.subjectHoursP}` : '']
          .filter(Boolean)
          .join(' · ');
        const metaBits = [extra.subjectCourse || '', extra.subjectDegree || '', subjectHours].filter(Boolean);
        card.innerHTML = `
          <h3>${escapeHtml(title)}</h3>
          ${metaBits.length ? `<p class="pub-meta">${escapeHtml(metaBits.join(' · '))}</p>` : ''}
        `;
        return card;
      }

      if (type === 'contacto') {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.borderLeftColor = 'var(--pri)';
        card.innerHTML = `
          <div class="stack-1">
            <div class="item">
              <strong>Email:</strong>
              <a href="${escapeHtml(extra.contactEmailLink || 'mailto:')}">${escapeHtml(extra.contactEmailText || '')}</a>
            </div>
            <div class="item">
              <strong>Institución:</strong>
              ${escapeHtml(extra.contactInstitution || '')}
            </div>
            <div class="item">
              <strong>Perfiles académicos:</strong>
              <a href="${escapeHtml(extra.contactOrcid || '#')}" target="_blank" rel="noopener">ORCID</a> ·
              <a href="${escapeHtml(extra.contactScholar || '#')}" target="_blank" rel="noopener">Google Scholar</a> ·
              <a href="${escapeHtml(extra.contactRg || '#')}" target="_blank" rel="noopener">ResearchGate</a> ·
              <a href="${escapeHtml(extra.contactUja || '#')}" target="_blank" rel="noopener">Perfil UJA</a>
            </div>
          </div>
        `;
        return card;
      }

      const row = document.createElement('div');
      row.className = 'card row';
      row.style.borderLeftColor = 'var(--pri)';
      const metaLine = [extra.event || '', extra.location || '', extra.talkDate || '', extra.talkCategory ? `(${extra.talkCategory})` : '']
        .filter(Boolean)
        .join(' · ');
      row.innerHTML = `
        <div class="pill acc">${escapeHtml(extra.talkKind || 'Ponencia')}</div>
        <div>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(metaLine || legacyMeta || 'Entrada añadida manualmente')}</p>
        </div>
      `;
      return row;
    };

    const getInsertTarget = (entry) => {
      const type = (entry.type === 'tfg' || entry.type === 'tfm') ? 'trabajo' : entry.type;
      if (type === 'trabajo') {
        const workKind = (entry.extra?.workKind || entry.type || 'tfg').toLowerCase();
        return workKind === 'tfm' ? document.getElementById('tfm-stack') : document.getElementById('tfg-stack');
      }
      if (type === 'tribunal') return document.getElementById('trib-stack');
      if (type === 'articulo') return document.querySelector('#publicaciones .stack-1');
      if (type === 'proyecto') {
        const stacks = getProjectStacks();
        return stacks[entry.extra?.projectCategory || 'investigacion'] || stacks.investigacion;
      }
      if (type === 'asignatura') return document.getElementById('quick-subjects-stack');
      if (type === 'contacto') return document.querySelector('#contacto .card');
      return document.querySelector('#congresos .stack-1');
    };

    const editableCardSelector = [
      '#sobre-mi .card',
      '#publicaciones .stack-1 > article.card',
      '#congresos .stack-1 > .card',
      '#proyectos .stack-1 > .card',
      '#proyectos > .container.stack-2 > .card',
      '#tfg-stack .card',
      '#tfm-stack .card',
      '#trib-stack .card',
      '#contacto .card',
      '#quick-subjects-stack .card'
    ].join(', ');

    let currentEditingCard = null;
    let currentEditingCardId = null;
    let currentEditingSubjectRow = null;
    let currentEditingSubjectId = null;

    const inferTypeFromCard = (card) => {
      if (card.closest('#publicaciones')) return 'articulo';
      if (card.closest('#congresos')) return 'ponencia';
      if (card.closest('#proyectos')) return 'proyecto';
      if (card.closest('#trib-stack')) return 'tribunal';
      if (card.closest('#contacto')) return 'contacto';
      if (card.closest('#quick-subjects-stack')) return 'asignatura';
      if (card.closest('#tfg-stack') || card.closest('#tfm-stack')) return 'trabajo';
      return 'proyecto';
    };

    const parseMetaChunks = (text) => (text || '').split('·').map((s) => s.trim()).filter(Boolean);

    const readEntryFromCard = (card) => {
      const type = inferTypeFromCard(card);
      const title = (card.querySelector('h3, h4')?.textContent || '').trim();
      const entry = { type, title, desc: '', extra: {} };

      if (type === 'trabajo') {
        const tagTextRaw = (card.querySelector('.tag')?.textContent || '').trim();
        const tagText = tagTextRaw.toUpperCase();
        entry.extra.workKind = tagText.includes('TFM') ? 'tfm' : 'tfg';
        const roleRaw = (tagTextRaw.split('·')[1] || '').trim().toLowerCase();
        entry.extra.role = roleRaw.includes('codirect') ? 'Codirector' : 'Director';
        const studentText = (card.querySelector('.pub-authors')?.textContent || '').replace('Estudiante:', '').trim();
        entry.extra.student = studentText;
        const parts = parseMetaChunks(card.querySelector('.pub-meta')?.textContent || '');
        parts.forEach((part) => {
          if (part.startsWith('Defensa:')) entry.extra.defense = part.replace('Defensa:', '').trim();
          else if (/^\d{4}/.test(part)) entry.extra.course = part;
          else if (!entry.extra.degree) entry.extra.degree = part;
          else entry.extra.grade = part;
        });
        return entry;
      }

      if (type === 'tribunal') {
        entry.extra.role = (card.querySelector('.pill')?.textContent || 'Vocal').trim();
        const studentText = (card.querySelector('.pub-authors')?.textContent || '')
          .replace('Alumno:', '')
          .replace('Alumna:', '')
          .trim();
        entry.extra.student = studentText;
        const parts = parseMetaChunks(card.querySelector('.pub-meta')?.textContent || '');
        parts.forEach((part) => {
          if (part.startsWith('Defensa:')) entry.extra.defense = part.replace('Defensa:', '').trim();
          else if (/^\d{4}/.test(part)) entry.extra.course = part;
          else if (!entry.extra.degree) entry.extra.degree = part;
          else entry.extra.grade = part;
        });
        return entry;
      }

      if (type === 'articulo') {
        entry.extra.authors = (card.querySelector('.pub-authors')?.textContent || '').trim();
        const meta = parseMetaChunks(card.querySelector('.pub-meta')?.textContent || '');
        entry.extra.journal = meta[0] || '';
        entry.extra.year = meta[1] || '';
        const doiPart = meta.find((p) => p.toLowerCase().includes('doi:')) || '';
        entry.extra.doi = doiPart.replace(/doi:/i, '').trim();
        const style = card.getAttribute('style') || '';
        entry.extra.quartile = style.includes('var(--q1)') ? 'q1' : (style.includes('#a855f7') ? 'q3' : 'q2');
        return entry;
      }

      if (type === 'proyecto') {
        const tag = (card.querySelector('.tag')?.textContent || '').toLowerCase();
        entry.extra.projectCategory = tag.includes('transfer') ? 'transferencia' : (tag.includes('innov') ? 'innovación' : 'investigacion');
        entry.extra.projectYear = (card.querySelector('p strong')?.textContent || '').trim();
        const parts = parseMetaChunks(card.querySelector('.pub-meta')?.textContent || '');
        parts.forEach((part) => {
          const lower = part.toLowerCase();
          if (/^\d{4}/.test(part)) {
            entry.extra.period = part;
            return;
          }
          if (lower.includes('financi') || lower.includes('importe') || lower.includes('funding') || lower.includes('budget')) {
            entry.extra.funding = part
              .replace(/financiaci[oó]n:\s*/i, '')
              .replace(/importe:\s*/i, '')
              .replace(/funding:\s*/i, '')
              .replace(/budget:\s*/i, '')
              .trim();
            return;
          }
          if (!entry.extra.entity) entry.extra.entity = part;
        });
        return entry;
      }

      if (type === 'asignatura') {
        const parts = parseMetaChunks(card.querySelector('.pub-meta')?.textContent || '');
        parts.forEach((part) => {
          if (/^\d{4}/.test(part)) entry.extra.subjectCourse = part;
          else if (part.startsWith('T:') || part.startsWith('P:')) {
            const hours = parseMetaChunks(part);
            hours.forEach((h) => {
              if (h.startsWith('T:')) entry.extra.subjectHoursT = h.replace('T:', '').trim();
              if (h.startsWith('P:')) entry.extra.subjectHoursP = h.replace('P:', '').trim();
            });
          } else entry.extra.subjectDegree = part;
        });
        return entry;
      }

      if (type === 'contacto') {
        const items = Array.from(card.querySelectorAll('.item'));
        const emailLink = items[0]?.querySelector('a');
        entry.extra.contactEmailText = (emailLink?.textContent || '').trim();
        entry.extra.contactEmailLink = (emailLink?.getAttribute('href') || '').trim();
        entry.extra.contactInstitution = (items[1]?.textContent || '')
          .replace('Institución:', '')
          .trim();
        const links = Array.from(items[2]?.querySelectorAll('a') || []);
        entry.extra.contactOrcid = links[0]?.getAttribute('href') || '';
        entry.extra.contactScholar = links[1]?.getAttribute('href') || '';
        entry.extra.contactRg = links[2]?.getAttribute('href') || '';
        entry.extra.contactUja = links[3]?.getAttribute('href') || '';
        return entry;
      }

      entry.extra.talkKind = (card.querySelector('.pill')?.textContent || '').trim();
      const talkMeta = parseMetaChunks(card.querySelector('p')?.textContent || '');
      entry.extra.event = talkMeta[0] || '';
      entry.extra.location = talkMeta[1] || '';
      entry.extra.talkDate = talkMeta[2] || '';
      const category = (talkMeta.find((p) => p.startsWith('(') && p.endsWith(')')) || '').replace(/[()]/g, '');
      entry.extra.talkCategory = category || '';
      return entry;
    };

    const fillQuickFormFromEntry = (entry) => {
      quickType.value = entry.type || 'proyecto';
      setQuickFormMode();
      quickTitle.value = entry.title || '';
      quickWorkKind.value = entry.extra?.workKind || 'tfg';
      quickStudent.value = entry.extra?.student || '';
      quickRole.value = entry.extra?.role || 'Director';
      quickDegree.value = entry.extra?.degree || '';
      quickDefense.value = entry.extra?.defense || '';
      quickCourse.value = entry.extra?.course || '';
      quickGrade.value = entry.extra?.grade || '';
      quickAuthors.value = entry.extra?.authors || '';
      quickJournal.value = entry.extra?.journal || '';
      quickYear.value = entry.extra?.year || '';
      quickDoi.value = entry.extra?.doi || '';
      quickQuartile.value = entry.extra?.quartile || 'q2';
      quickProjectCat.value = entry.extra?.projectCategory || 'investigacion';
      quickPeriod.value = entry.extra?.period || '';
      quickProjectYear.value = entry.extra?.projectYear || '';
      quickFunding.value = entry.extra?.funding || '';
      quickEntity.value = entry.extra?.entity || '';
      quickTalkKind.value = entry.extra?.talkKind || 'Oral';
      quickEvent.value = entry.extra?.event || '';
      quickLocation.value = entry.extra?.location || '';
      quickTalkDate.value = entry.extra?.talkDate || '';
      quickTalkCat.value = entry.extra?.talkCategory || 'Internacional';
      quickSubjectDegree.value = entry.extra?.subjectDegree || '';
      const normalizedHours = normalizeSubjectHoursForForm(entry.extra?.subjectHoursT || '', entry.extra?.subjectHoursP || '');
      quickSubjectHoursT.value = normalizedHours.t;
      quickSubjectHoursP.value = normalizedHours.p;
      quickSubjectCourse.value = entry.extra?.subjectCourse || '';
      quickContactEmailText.value = entry.extra?.contactEmailText || '';
      quickContactEmailLink.value = entry.extra?.contactEmailLink || '';
      quickContactInstitution.value = entry.extra?.contactInstitution || '';
      quickContactOrcid.value = entry.extra?.contactOrcid || '';
      quickContactScholar.value = entry.extra?.contactScholar || '';
      quickContactRg.value = entry.extra?.contactRg || '';
      quickContactUja.value = entry.extra?.contactUja || '';
    };

    const ensureInlineEditButton = (card) => {
      if (!card || card.querySelector(':scope > .inline-edit-btn')) return;
      card.classList.add('has-inline-edit');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'inline-edit-btn';
      btn.textContent = 'Editar';
      btn.addEventListener('click', () => {
        currentEditingCard = card;
        currentEditingCardId = card.dataset.editId || null;
        const savedEdits = getCardEdits();
        const entry = (currentEditingCardId && savedEdits[currentEditingCardId] && savedEdits[currentEditingCardId].type)
          ? savedEdits[currentEditingCardId]
          : readEntryFromCard(card);
        fillQuickFormFromEntry(entry);
        document.getElementById('quick-add-title').textContent = 'Editar entrada';
        quickAddForm.querySelector('button[type="submit"]').textContent = 'Guardar cambios';
        openQuickModal();
      });
      card.appendChild(btn);
    };

    const deleteCard = (card) => {
      if (!card) return;
      const editId = card.dataset.editId;
      const deletes = getCardDeletes();
      if (editId && !deletes.includes(editId)) {
        deletes.push(editId);
        saveCardDeletes(deletes);
        deleteProofRecord(editId);
      }

      if (card.dataset.quickAdded === 'true' && card.dataset.quickEntryId) {
        const entryId = String(card.dataset.quickEntryId);
        const entries = getQuickEntries().filter((entry) => String(entry.id) !== entryId);
        saveQuickEntries(entries);
      }

      card.remove();
    };

    const ensureInlineDeleteButton = (card) => {
      if (!card || card.querySelector(':scope > .inline-delete-btn')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'inline-delete-btn';
      btn.textContent = 'Eliminar';
      card.appendChild(btn);
    };

    const removeInlineProofControls = (host) => {
      if (!host) return;
      host.classList.remove('has-inline-proof');
      host.querySelectorAll(':scope > .inline-proof-wrap').forEach((node) => node.remove());
    };

    const updateProofControls = async (host) => {
      if (!host) return;
      const proofId = getProofHostId(host);
      const wrap = host.querySelector(':scope > .inline-proof-wrap');
      if (!wrap) return;
      const main = wrap.querySelector('.inline-proof-main');
      const nameNode = wrap.querySelector('.inline-proof-name');
      const openLink = wrap.querySelector('.inline-proof-link');
      const removeBtn = wrap.querySelector('.inline-proof-remove');
      const uploadBtn = wrap.querySelector('.inline-proof-btn');
      const record = await getProofRecord(proofId);
      if (!record?.stored_path && !record?.url) {
        wrap.classList.remove('has-visible-open');
        wrap.classList.add('has-visible-empty');
        main?.classList.remove('has-file');
        main?.classList.add('no-file');
        if (nameNode) nameNode.textContent = 'Sin justificante subido';
        if (openLink) {
          openLink.hidden = true;
          openLink.removeAttribute('href');
        }
        if (removeBtn) removeBtn.hidden = true;
        if (uploadBtn) {
          uploadBtn.title = 'Subir justificante';
          uploadBtn.hidden = !isLocalProofHost();
        }
        if (!isLocalProofHost()) wrap.hidden = true;
        return;
      }

      wrap.hidden = false;
      wrap.classList.add('has-visible-open');
      wrap.classList.remove('has-visible-empty');
      main?.classList.remove('no-file');
      main?.classList.add('has-file');
      if (nameNode) nameNode.textContent = record.name || 'Justificante adjunto';
      if (openLink) {
        openLink.href = getProofUrl(proofId, record);
        openLink.hidden = false;
      }
      if (removeBtn) removeBtn.hidden = !isLocalProofHost();
      if (uploadBtn) {
        uploadBtn.title = 'Cambiar justificante';
        uploadBtn.hidden = !isLocalProofHost();
      }
    };

    const ensureInlineProofControls = (card) => {
      if (!card) return;
      if (!shouldRenderInlineProof(card)) {
        removeInlineProofControls(card);
        return;
      }
      if (card.querySelector(':scope > .inline-proof-wrap')) return;
      card.classList.add('has-inline-proof');
      const wrap = document.createElement('div');
      wrap.className = 'inline-proof-wrap has-visible-empty';
      wrap.innerHTML = `
        <div class="inline-proof-main no-file">
          <button type="button" class="inline-proof-btn" title="Subir justificante" aria-label="Subir justificante">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 16V4"></path>
              <path d="m7 9 5-5 5 5"></path>
              <path d="M20 16v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3"></path>
            </svg>
            <span class="inline-proof-status" aria-hidden="true"></span>
          </button>
          <a class="inline-proof-link" href="#" target="_blank" rel="noopener" title="Abrir justificante" aria-label="Abrir justificante" hidden>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 3h7v7"></path>
              <path d="M10 14 21 3"></path>
              <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"></path>
            </svg>
          </a>
          <button type="button" class="inline-proof-remove" title="Quitar justificante" aria-label="Quitar justificante" hidden>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M8 6V4h8v2"></path>
              <path d="m19 6-1 14H6L5 6"></path>
              <path d="M10 11v6"></path>
              <path d="M14 11v6"></path>
            </svg>
          </button>
          <input type="file" class="inline-proof-input" hidden />
        </div>
        <span class="inline-proof-name">Sin justificante subido</span>
      `;

      const input = wrap.querySelector('.inline-proof-input');
      const uploadBtn = wrap.querySelector('.inline-proof-btn');
      const removeBtn = wrap.querySelector('.inline-proof-remove');

      uploadBtn?.addEventListener('click', () => {
        if (!isLocalProofHost()) {
          showLocalProofUploadMessage();
          return;
        }
        input?.click();
      });

      input?.addEventListener('change', async (event) => {
        const file = event.target?.files?.[0];
        const proofId = getProofHostId(card);
        if (!file || !proofId) return;
        const currentRecord = await getProofRecord(proofId);
        if (currentRecord?.url && !window.confirm('Este justificante ya existe. ¿Quieres reemplazarlo?')) {
          input.value = '';
          return;
        }
        const savedRecord = await saveProofRecord({
          id: proofId,
          section: getProofSection(card),
          name: file.name,
          type: file.type || '',
          updatedAt: Date.now(),
          file
        });
        if (savedRecord?.error === 'local-upload-only') {
          showLocalProofUploadMessage();
          input.value = '';
          return;
        }
        if (!savedRecord?.url) {
          showProofToast('No se pudo guardar el justificante');
          input.value = '';
          return;
        }
        await updateProofControls(card);
        showProofToast(`Justificante subido: ${file.name}`);
        input.value = '';
      });

      removeBtn?.addEventListener('click', async () => {
        const proofId = getProofHostId(card);
        if (!proofId) return;
        if (!window.confirm('¿Quieres eliminar este justificante?')) return;
        await deleteProofRecord(proofId);
        await updateProofControls(card);
        showProofToast('Justificante eliminado');
      });

      card.appendChild(wrap);
      updateProofControls(card);
    };

    const ensureGroupProofControls = () => {
      const groups = [
        { selector: '#tfg-title-block', proofId: 'group-tfg' },
        { selector: '#tfm-title-block', proofId: 'group-tfm' },
        { selector: '#trib-title-block', proofId: 'group-tribunales' },
        { selector: '#docencia-title-block', proofId: 'group-docencia' }
      ];

      groups.forEach(({ selector, proofId }) => {
        const block = document.querySelector(selector);
        if (!block || block.querySelector(':scope > .inline-proof-wrap')) return;
        block.dataset.proofId = proofId;
        const wrap = document.createElement('div');
        wrap.className = 'inline-proof-wrap is-group-control has-visible-empty';
        wrap.innerHTML = `
          <div class="inline-proof-main no-file">
            <button type="button" class="inline-proof-btn" title="Subir justificante" aria-label="Subir justificante">
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 16V4"></path>
                <path d="m7 9 5-5 5 5"></path>
                <path d="M20 16v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3"></path>
              </svg>
              <span class="inline-proof-status" aria-hidden="true"></span>
            </button>
            <a class="inline-proof-link" href="#" target="_blank" rel="noopener" title="Abrir justificante" aria-label="Abrir justificante" hidden>
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 3h7v7"></path>
                <path d="M10 14 21 3"></path>
                <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"></path>
              </svg>
            </a>
            <button type="button" class="inline-proof-remove" title="Quitar justificante" aria-label="Quitar justificante" hidden>
              <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M8 6V4h8v2"></path>
                <path d="m19 6-1 14H6L5 6"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
              </svg>
            </button>
            <input type="file" class="inline-proof-input" hidden />
          </div>
          <span class="inline-proof-name">Sin justificante subido</span>
        `;

        const input = wrap.querySelector('.inline-proof-input');
        const uploadBtn = wrap.querySelector('.inline-proof-btn');
        const removeBtn = wrap.querySelector('.inline-proof-remove');

        uploadBtn?.addEventListener('click', () => {
          if (!isLocalProofHost()) {
            showLocalProofUploadMessage();
            return;
          }
          input?.click();
        });

        input?.addEventListener('change', async (event) => {
          const file = event.target?.files?.[0];
          if (!file) return;
          const currentRecord = await getProofRecord(proofId);
          if (currentRecord?.url && !window.confirm('Este justificante ya existe. ¿Quieres reemplazarlo?')) {
            input.value = '';
            return;
          }
          const savedRecord = await saveProofRecord({
            id: proofId,
            section: getProofSection(block),
            name: file.name,
            type: file.type || '',
            updatedAt: Date.now(),
            file
          });
          if (savedRecord?.error === 'local-upload-only') {
            showLocalProofUploadMessage();
            input.value = '';
            return;
          }
          if (!savedRecord?.url) {
            showProofToast('No se pudo guardar el justificante');
            input.value = '';
            return;
          }
          await updateProofControls(block);
          showProofToast(`Justificante subido: ${file.name}`);
          input.value = '';
        });

        removeBtn?.addEventListener('click', async () => {
          if (!window.confirm('¿Quieres eliminar este justificante?')) return;
          await deleteProofRecord(proofId);
          await updateProofControls(block);
          showProofToast('Justificante eliminado');
        });

        block.appendChild(wrap);
        updateProofControls(block);
      });
    };

    const ensureAcademicMainProofControl = () => {
      const block = document.getElementById('acad-title-block');
      if (!block || block.querySelector(':scope > .inline-proof-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'inline-proof-wrap is-group-control has-visible-empty';
      wrap.hidden = true;
      wrap.innerHTML = `
        <div class="inline-proof-main no-file">
          <button type="button" class="inline-proof-btn" title="Subir justificante" aria-label="Subir justificante">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 16V4"></path>
              <path d="m7 9 5-5 5 5"></path>
              <path d="M20 16v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3"></path>
            </svg>
            <span class="inline-proof-status" aria-hidden="true"></span>
          </button>
          <a class="inline-proof-link" href="#" target="_blank" rel="noopener" title="Abrir justificante" aria-label="Abrir justificante" hidden>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 3h7v7"></path>
              <path d="M10 14 21 3"></path>
              <path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"></path>
            </svg>
          </a>
          <button type="button" class="inline-proof-remove" title="Quitar justificante" aria-label="Quitar justificante" hidden>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M8 6V4h8v2"></path>
              <path d="m19 6-1 14H6L5 6"></path>
              <path d="M10 11v6"></path>
              <path d="M14 11v6"></path>
            </svg>
          </button>
          <input type="file" class="inline-proof-input" hidden />
        </div>
      `;

      const input = wrap.querySelector('.inline-proof-input');
      const uploadBtn = wrap.querySelector('.inline-proof-btn');
      const removeBtn = wrap.querySelector('.inline-proof-remove');

      uploadBtn?.addEventListener('click', () => {
        if (!isLocalProofHost()) {
          showLocalProofUploadMessage();
          return;
        }
        input?.click();
      });

      input?.addEventListener('change', async (event) => {
        const file = event.target?.files?.[0];
        const proofId = block.dataset.proofId || '';
        if (!proofId || !file) return;
        const currentRecord = await getProofRecord(proofId);
        if (currentRecord?.url && !window.confirm('Este justificante ya existe. ¿Quieres reemplazarlo?')) {
          input.value = '';
          return;
        }
        const savedRecord = await saveProofRecord({
          id: proofId,
          name: file.name,
          type: file.type || '',
          updatedAt: Date.now(),
          file
        });
        if (savedRecord?.error === 'local-upload-only') {
          showLocalProofUploadMessage();
          input.value = '';
          return;
        }
        if (!savedRecord?.url) {
          showProofToast('No se pudo guardar el justificante');
          input.value = '';
          return;
        }
        await updateProofControls(block);
        showProofToast(`Justificante subido: ${file.name}`);
        input.value = '';
      });

      removeBtn?.addEventListener('click', async () => {
        const proofId = block.dataset.proofId || '';
        if (!proofId) return;
        if (!window.confirm('¿Quieres eliminar este justificante?')) return;
        await deleteProofRecord(proofId);
        await updateProofControls(block);
        showProofToast('Justificante eliminado');
      });

      block.appendChild(wrap);
    };

    const syncAcademicProofControls = (filter) => {
      const mainBlock = document.getElementById('acad-title-block');
      const tfgBlock = document.getElementById('tfg-title-block');
      const tfmBlock = document.getElementById('tfm-title-block');
      const tribBlock = document.getElementById('trib-title-block');
      ensureAcademicMainProofControl();

      const mainWrap = mainBlock?.querySelector(':scope > .inline-proof-wrap');
      const setWrapVisible = (host, visible) => {
        const wrap = host?.querySelector(':scope > .inline-proof-wrap');
        if (wrap) wrap.hidden = !visible;
      };

      if (filter === 'tfg') {
        if (mainBlock) mainBlock.dataset.proofId = 'group-tfg';
        if (mainWrap) {
          mainWrap.hidden = false;
          updateProofControls(mainBlock);
        }
        setWrapVisible(tfgBlock, false);
        setWrapVisible(tfmBlock, false);
        setWrapVisible(tribBlock, false);
        return;
      }

      if (filter === 'tfm') {
        if (mainBlock) mainBlock.dataset.proofId = 'group-tfm';
        if (mainWrap) {
          mainWrap.hidden = false;
          updateProofControls(mainBlock);
        }
        setWrapVisible(tfgBlock, false);
        setWrapVisible(tfmBlock, false);
        setWrapVisible(tribBlock, false);
        return;
      }

      if (filter === 'tribunales') {
        if (mainBlock) mainBlock.dataset.proofId = 'group-tribunales';
        if (mainWrap) {
          mainWrap.hidden = false;
          updateProofControls(mainBlock);
        }
        setWrapVisible(tfgBlock, false);
        setWrapVisible(tfmBlock, false);
        setWrapVisible(tribBlock, false);
        return;
      }

      if (mainWrap) mainWrap.hidden = true;
      setWrapVisible(tfgBlock, true);
      setWrapVisible(tfmBlock, true);
      setWrapVisible(tribBlock, true);
    };

    const refreshEditableCards = () => {
      const cards = Array.from(document.querySelectorAll(editableCardSelector));
      cards.forEach((card, idx) => {
        if (!card.dataset.editId) {
          const section = card.closest('section')?.id || 'section';
          card.dataset.editId = `${section}-${idx + 1}`;
        }
        ensureInlineEditButton(card);
        ensureInlineDeleteButton(card);
        ensureInlineProofControls(card);
      });

      const edits = getCardEdits();
      const deletes = new Set(getCardDeletes());
      cards.forEach((card) => {
        const editId = card.dataset.editId;
        if (editId && deletes.has(editId)) {
          card.remove();
          return;
        }
        if (!editId || !edits[editId] || !edits[editId].type) return;
        const rendered = createCardNode(edits[editId]);
        card.innerHTML = rendered.innerHTML;
        ensureInlineEditButton(card);
        ensureInlineDeleteButton(card);
        ensureInlineProofControls(card);
      });

      const subjectStack = document.getElementById('quick-subjects-stack');
      if (quickSubjectsBlock && subjectStack && !subjectStack.querySelector('.card')) {
        quickSubjectsBlock.classList.add('is-hidden');
      }
      ensureGroupProofControls();
      syncAcademicProofControls('all');
      ensurePublicationProofControls();
      refreshPublicationQ3Visibility();
    };

    const parseHours = (value) => {
      const txt = String(value || '');
      const tMatch = txt.match(/T:\s*([0-9]+)/i);
      const pMatch = txt.match(/P:\s*([0-9]+)/i);
      return {
        t: tMatch ? tMatch[1] : '',
        p: pMatch ? pMatch[1] : ''
      };
    };

    const buildHours = (t, p) => {
      const parts = [];
      if (t) parts.push(`T: ${t}`);
      if (p) parts.push(`P: ${p}`);
      return parts.join(' · ');
    };

    const normalizeSubjectHoursForForm = (t, p) => {
      const tVal = String(t || '').trim();
      const pVal = String(p || '').trim();
      if (tVal && !pVal) return { t: tVal, p: '0' };
      if (!tVal && pVal) return { t: '0', p: pVal };
      return { t: tVal, p: pVal };
    };

    const ensureSubjectRowControls = () => {
      const rows = Array.from(document.querySelectorAll('#docencia .subject-table tbody tr'));
      rows.forEach((row, idx) => {
        if (!row.dataset.subjectRowId) {
          row.dataset.subjectRowId = `doc-subject-${idx + 1}`;
        }

        const cells = row.querySelectorAll('td');
        if (cells.length < 3) return;
        const hoursCell = cells[2];
        let hoursValue = hoursCell.querySelector('.subject-hours-value');
        if (!hoursValue) {
          const raw = hoursCell.textContent.trim();
          hoursCell.textContent = '';
          hoursValue = document.createElement('span');
          hoursValue.className = 'subject-hours-value';
          hoursValue.textContent = raw;
          hoursCell.appendChild(hoursValue);
        }

        if (!hoursCell.querySelector('.subject-actions')) {
          const wrap = document.createElement('span');
          wrap.className = 'subject-actions';
          wrap.innerHTML = `
            <button type="button" class="subject-edit-btn">Editar</button>
            <button type="button" class="subject-delete-btn">Eliminar</button>
          `;
          hoursCell.appendChild(wrap);
        }
      });

      const deletedIds = new Set(getCardDeletes());
      const edits = getCardEdits();
      rows.forEach((row) => {
        const rowId = row.dataset.subjectRowId || '';
        if (deletedIds.has(rowId)) {
          row.remove();
          return;
        }
        const saved = edits[rowId];
        if (!saved || saved.type !== 'asignatura') return;
        const cells = row.querySelectorAll('td');
        if (cells.length < 3) return;
        cells[0].textContent = saved.title || cells[0].textContent;
        cells[1].textContent = saved.extra?.subjectDegree || cells[1].textContent;
        const hoursCell = cells[2];
        const hoursValue = hoursCell.querySelector('.subject-hours-value');
        const merged = buildHours(saved.extra?.subjectHoursT || '', saved.extra?.subjectHoursP || '');
        if (hoursValue && merged) hoursValue.textContent = merged;
      });
    };

    const appendQuickEntry = (entry) => {
      const target = getInsertTarget(entry);
      if (!target) return;
      const type = (entry.type === 'tfg' || entry.type === 'tfm') ? 'trabajo' : entry.type;
      const node = createCardNode(entry);
      if (type === 'contacto' && target.matches('#contacto .card')) {
        target.innerHTML = node.innerHTML;
        refreshEditableCards();
        return;
      }
      node.dataset.quickAdded = 'true';
      node.dataset.quickEntryId = String(entry.id || '');
      if (entry.id) node.dataset.editId = `quick-${entry.id}`;
      target.prepend(node);
      if (type === 'asignatura' && quickSubjectsBlock) {
        quickSubjectsBlock.classList.remove('is-hidden');
      }
      refreshEditableCards();
    };

    const openQuickModal = () => {
      const isEditing = Boolean(currentEditingCard || currentEditingSubjectRow);
      if (quickTypeWrap) quickTypeWrap.hidden = isEditing;
      if (quickType) quickType.disabled = isEditing;
      quickAddModal.removeAttribute('hidden');
      setQuickFormMode();
      syncQuickProofPanel();
      quickTitle.focus();
    };

    const closeQuickModal = () => {
      quickAddModal.setAttribute('hidden', '');
      quickAddForm.reset();
      if (quickTypeWrap) quickTypeWrap.hidden = false;
      if (quickType) quickType.disabled = false;
      setQuickFormMode();
      currentEditingCard = null;
      currentEditingCardId = null;
      currentEditingSubjectRow = null;
      currentEditingSubjectId = null;
      document.getElementById('quick-add-title').textContent = 'Añadir nueva entrada';
      quickAddForm.querySelector('button[type="submit"]').textContent = 'Guardar';
      syncQuickProofPanel();
    };

    quickType?.addEventListener('change', setQuickFormMode);

    quickProofUpload?.addEventListener('click', () => {
      if (!isLocalProofHost()) {
        showLocalProofUploadMessage();
        return;
      }
      quickProofInput?.click();
    });

    quickProofInput?.addEventListener('change', async (event) => {
      const proofId = getCurrentProofId();
      const file = event.target?.files?.[0];
      if (!proofId || !file) return;
      const currentRecord = await getProofRecord(proofId);
      if (currentRecord?.url && !window.confirm('Este justificante ya existe. ¿Quieres reemplazarlo?')) {
        quickProofInput.value = '';
        return;
      }
      const savedRecord = await saveProofRecord({
        id: proofId,
        section: getProofSection(currentEditingCard || currentEditingSubjectRow),
        name: file.name,
        type: file.type || '',
        updatedAt: Date.now(),
        file
      });
      if (savedRecord?.error === 'local-upload-only') {
        showLocalProofUploadMessage();
        quickProofInput.value = '';
        return;
      }
      if (!savedRecord?.url) {
        showProofToast('No se pudo guardar el justificante');
        quickProofInput.value = '';
        return;
      }
      await syncQuickProofPanel();
      await updateProofControls(currentEditingCard);
      showProofToast(`Justificante subido: ${file.name}`);
      quickProofInput.value = '';
    });

    quickProofRemove?.addEventListener('click', async () => {
      const proofId = getCurrentProofId();
      if (!proofId) return;
      if (!window.confirm('¿Quieres eliminar este justificante?')) return;
      await deleteProofRecord(proofId);
      await syncQuickProofPanel();
      await updateProofControls(currentEditingCard);
      showProofToast('Justificante eliminado');
    });

    const updateSettingsActiveStates = () => {
      quickSettingsEdit?.classList.toggle('is-active', document.body.classList.contains('edit-mode'));
    };

    quickSettingsMain?.addEventListener('click', () => {
      if (!quickSettingsMenu) return;
      if (quickSettingsMenu.hasAttribute('hidden')) quickSettingsMenu.removeAttribute('hidden');
      else quickSettingsMenu.setAttribute('hidden', '');
    });

    document.addEventListener('click', (e) => {
      if (!quickSettings || !quickSettingsMenu) return;
      if (quickSettings.contains(e.target)) return;
      quickSettingsMenu.setAttribute('hidden', '');
    });

    document.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.inline-delete-btn');
      if (!deleteBtn) return;
      e.preventDefault();
      const card = deleteBtn.closest('.card');
      if (!card) return;
      deleteCard(card);
      refreshEditableCards();
    });

    document.addEventListener('click', (e) => {
      const subjectEditBtn = e.target.closest('.subject-edit-btn');
      if (!subjectEditBtn) return;
      e.preventDefault();
      const row = subjectEditBtn.closest('tr');
      if (!row) return;
      const cells = row.querySelectorAll('td');
      if (cells.length < 3) return;
      const hoursText = (cells[2].querySelector('.subject-hours-value')?.textContent || '').trim();
      const hours = parseHours(hoursText);
      const normalizedHours = normalizeSubjectHoursForForm(hours.t, hours.p);
      currentEditingSubjectRow = row;
      currentEditingSubjectId = row.dataset.subjectRowId || null;
      currentEditingCard = null;
      currentEditingCardId = null;

      const savedEdits = getCardEdits();
      if (currentEditingSubjectId && savedEdits[currentEditingSubjectId] && savedEdits[currentEditingSubjectId].type === 'asignatura') {
        fillQuickFormFromEntry(savedEdits[currentEditingSubjectId]);
      } else {
        quickType.value = 'asignatura';
        setQuickFormMode();
        quickTitle.value = (cells[0].textContent || '').trim();
        quickSubjectDegree.value = (cells[1].textContent || '').trim();
        quickSubjectHoursT.value = normalizedHours.t;
        quickSubjectHoursP.value = normalizedHours.p;
        quickSubjectCourse.value = (row.closest('.year-card')?.querySelector('.year-head h4')?.textContent || '')
          .replace('Curso', '')
          .trim();
      }
      document.getElementById('quick-add-title').textContent = 'Editar asignatura';
      quickAddForm.querySelector('button[type="submit"]').textContent = 'Guardar cambios';
      openQuickModal();
    });

    document.addEventListener('click', (e) => {
      const subjectDeleteBtn = e.target.closest('.subject-delete-btn');
      if (!subjectDeleteBtn) return;
      e.preventDefault();
      const row = subjectDeleteBtn.closest('tr');
      if (!row) return;
      const rowId = row.dataset.subjectRowId;
      const deletes = getCardDeletes();
      if (rowId && !deletes.includes(rowId)) {
        deletes.push(rowId);
        saveCardDeletes(deletes);
      }
      row.remove();
      ensureSubjectRowControls();
    });

    quickSettingsAdd?.addEventListener('click', () => {
      quickSettingsMenu?.setAttribute('hidden', '');
      currentEditingCard = null;
      currentEditingCardId = null;
      currentEditingSubjectRow = null;
      currentEditingSubjectId = null;
      quickAddForm.reset();
      document.getElementById('quick-add-title').textContent = 'Añadir nueva entrada';
      quickAddForm.querySelector('button[type="submit"]').textContent = 'Guardar';
      openQuickModal();
    });

    quickSettingsEdit?.addEventListener('click', () => {
      document.body.classList.toggle('edit-mode');
      updateSettingsActiveStates();
      quickSettingsMenu?.setAttribute('hidden', '');
    });

    quickSettingsPublish?.addEventListener('click', async () => {
      quickSettingsMenu?.setAttribute('hidden', '');
      await publishLocalChanges();
    });

    quickAddClose?.addEventListener('click', closeQuickModal);
    quickAddCancel?.addEventListener('click', closeQuickModal);
    quickAddModal?.addEventListener('click', (e) => {
      if (e.target === quickAddModal) closeQuickModal();
    });

    quickAddForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (quickTitle.value || '').trim();
      if (!title) return;
      const type = quickType.value;
      const extra = {};

      if (type === 'trabajo') {
        extra.workKind = (quickWorkKind.value || 'tfg').trim();
        extra.student = (quickStudent.value || '').trim();
        extra.role = (quickRole.value || '').trim();
        extra.degree = (quickDegree.value || '').trim();
        extra.defense = (quickDefense.value || '').trim();
        extra.course = (quickCourse.value || '').trim();
        extra.grade = (quickGrade.value || '').trim();
      } else if (type === 'tribunal') {
        extra.student = (quickStudent.value || '').trim();
        extra.role = (quickRole.value || '').trim();
        extra.degree = (quickDegree.value || '').trim();
        extra.defense = (quickDefense.value || '').trim();
        extra.course = (quickCourse.value || '').trim();
        extra.grade = (quickGrade.value || '').trim();
      } else if (type === 'articulo') {
        extra.authors = (quickAuthors.value || '').trim();
        extra.journal = (quickJournal.value || '').trim();
        extra.year = (quickYear.value || '').trim();
        extra.doi = (quickDoi.value || '').trim();
        extra.quartile = (quickQuartile.value || 'q2').trim();
      } else if (type === 'proyecto') {
        extra.projectCategory = (quickProjectCat.value || 'investigacion').trim();
        extra.period = (quickPeriod.value || '').trim();
        extra.projectYear = (quickProjectYear.value || '').trim();
        extra.funding = (quickFunding.value || '').trim();
        extra.entity = (quickEntity.value || '').trim();
      } else if (type === 'asignatura') {
        extra.subjectDegree = (quickSubjectDegree.value || '').trim();
        extra.subjectHoursT = (quickSubjectHoursT.value || '').trim();
        extra.subjectHoursP = (quickSubjectHoursP.value || '').trim();
        extra.subjectCourse = (quickSubjectCourse.value || '').trim();
      } else if (type === 'contacto') {
        extra.contactEmailText = (quickContactEmailText.value || '').trim();
        extra.contactEmailLink = (quickContactEmailLink.value || '').trim();
        extra.contactInstitution = (quickContactInstitution.value || '').trim();
        extra.contactOrcid = (quickContactOrcid.value || '').trim();
        extra.contactScholar = (quickContactScholar.value || '').trim();
        extra.contactRg = (quickContactRg.value || '').trim();
        extra.contactUja = (quickContactUja.value || '').trim();
      } else {
        extra.talkKind = (quickTalkKind.value || '').trim();
        extra.event = (quickEvent.value || '').trim();
        extra.location = (quickLocation.value || '').trim();
        extra.talkDate = (quickTalkDate.value || '').trim();
        extra.talkCategory = (quickTalkCat.value || '').trim();
      }

      const entry = {
        id: Date.now(),
        type,
        title,
        desc: '',
        extra
      };
      if (currentEditingSubjectRow) {
        const cells = currentEditingSubjectRow.querySelectorAll('td');
        if (cells.length >= 3) {
          cells[0].textContent = title;
          cells[1].textContent = extra.subjectDegree || '';
          const hoursCell = cells[2];
          const hoursValue = hoursCell.querySelector('.subject-hours-value');
          const mergedHours = buildHours(extra.subjectHoursT, extra.subjectHoursP);
          if (hoursValue) hoursValue.textContent = mergedHours;
        }

        if (currentEditingSubjectId) {
          const edits = getCardEdits();
          edits[currentEditingSubjectId] = entry;
          saveCardEdits(edits);
        }

        ensureSubjectRowControls();
        closeQuickModal();
        return;
      }

      if (currentEditingCard) {
        const rendered = createCardNode(entry);
        currentEditingCard.innerHTML = rendered.innerHTML;
        const editId = currentEditingCardId || currentEditingCard.dataset.editId;
        if (editId) {
          currentEditingCard.dataset.editId = editId;
          const edits = getCardEdits();
          edits[editId] = entry;
          saveCardEdits(edits);
        }

        if (currentEditingCard.dataset.quickAdded === 'true' && currentEditingCard.dataset.quickEntryId) {
          const entryId = String(currentEditingCard.dataset.quickEntryId);
          const entries = getQuickEntries();
          const idx = entries.findIndex((item) => String(item.id) === entryId);
          if (idx >= 0) {
            entries[idx] = { ...entry, id: entries[idx].id };
            saveQuickEntries(entries);
          }
        }

        ensureInlineEditButton(currentEditingCard);
        ensureInlineDeleteButton(currentEditingCard);
        ensureInlineProofControls(currentEditingCard);
        refreshPublicationQ3Visibility();
        closeQuickModal();
        return;
      }

      const entries = getQuickEntries();
      entries.push(entry);
      saveQuickEntries(entries);
      appendQuickEntry(entry);
      closeQuickModal();
    });

    setQuickFormMode();
    getQuickEntries().forEach(appendQuickEntry);
    refreshEditableCards();
    ensureSubjectRowControls();
    updateSettingsActiveStates();
    ensureSectionExportButtons();

    const withCachedCategory = (item, key, resolver) => {
      if (!item.dataset[key]) item.dataset[key] = resolver(item);
      return item.dataset[key];
    };

    const setupFilterGroup = (containerId, itemSelector, key, resolver) => {
      const wrap = document.getElementById(containerId);
      if (!wrap) return;
      const buttons = Array.from(wrap.querySelectorAll('button[data-filter]'));
      if (!buttons.length) return;

      const apply = (filter) => {
        const items = Array.from(document.querySelectorAll(itemSelector));
        if (!items.length) return;
        items.forEach((item) => {
          const category = withCachedCategory(item, key, resolver);
          const show = filter === 'all' || category === filter;
          item.classList.toggle('is-hidden', !show);
        });
      };

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          buttons.forEach((b) => b.classList.remove('is-active'));
          button.classList.add('is-active');
          apply(button.dataset.filter || 'all');
        });
      });

      apply('all');
    };

    function ensurePublicationProofControls() {
      document.querySelectorAll('#publicaciones .stack-1 > article.card').forEach((card) => {
        ensureInlineProofControls(card);
      });
    }

    function refreshPublicationQ3Visibility() {
      const pubCards = Array.from(document.querySelectorAll('#publicaciones .stack-1 > article.card'));
      const q3Count = pubCards.filter((card) => (card.getAttribute('style') || '').includes('#a855f7')).length;
      const showQ3 = q3Count > 0;

      if (pubQ3Btn) pubQ3Btn.classList.toggle('is-hidden', !showQ3);
      if (pubQ3Summary) {
        pubQ3Summary.classList.toggle('is-hidden', !showQ3);
        if (showQ3) pubQ3Summary.textContent = `Q3 ${q3Count} ·`;
      }

      if (!showQ3 && pubQ3Btn?.classList.contains('is-active')) {
        pubAllBtn?.click();
      }
    }

    setupFilterGroup(
      'pub-filters',
      '#publicaciones .stack-1 > article.card',
      'pub',
      (item) => {
        const style = item.getAttribute('style') || '';
        if (style.includes('var(--q1)')) return 'q1';
        if (style.includes('#a855f7')) return 'q3';
        return 'q2';
      }
    );
    refreshPublicationQ3Visibility();

    setupFilterGroup(
      'cong-filters',
      '#congresos .stack-1 > .card',
      'cong',
      (item) => {
        const txt = item.textContent.toLowerCase();
        if (txt.includes('(internacional)')) return 'int';
        if (txt.includes('(nacional)')) return 'nac';
        return 'oth';
      }
    );

    const projectFilterWrap = document.getElementById('proj-filters');
    const projectContainer = document.querySelector('#proyectos > .container.stack-2');
    if (projectFilterWrap && projectContainer) {
      const projectMainTitle = document.getElementById('projects-main-title');
      const projectMainSubtitle = document.getElementById('projects-main-subtitle');
      const projectButtons = Array.from(projectFilterWrap.querySelectorAll('button[data-filter]'));
      const directChildren = Array.from(projectContainer.children);
      const titles = directChildren.filter((el) => el.classList.contains('title'));
      const stacks = directChildren.filter((el) => el.classList.contains('stack-1'));

      const innovationTitle = titles[1];
      const transferTitle = titles[2];
      const researchStack = stacks[0];
      const innovationStack = stacks[1];
      const transferStack = stacks[2];

      const transferExtras = [];
      if (transferStack) {
        let next = transferStack.nextElementSibling;
        while (next && next.classList.contains('card')) {
          transferExtras.push(next);
          next = next.nextElementSibling;
        }
      }

      const setVisibility = (el, show) => {
        if (!el) return;
        el.classList.toggle('is-hidden', !show);
      };

      const applyProjectFilter = (filter) => {
        const showResearch = filter === 'all' || filter === 'investigacion';
        const showInnovation = filter === 'all' || filter === 'innovación';
        const showTransfer = filter === 'all' || filter === 'transferencia';
        const onlyOneType = filter !== 'all';

        setVisibility(researchStack, showResearch);
        setVisibility(innovationTitle, false);
        setVisibility(innovationStack, showInnovation);
        setVisibility(transferTitle, false);
        setVisibility(transferStack, showTransfer);
        transferExtras.forEach((card) => setVisibility(card, showTransfer));

        if (projectMainTitle && projectMainSubtitle) {
          if (filter === 'investigacion') {
            projectMainTitle.textContent = 'Proyectos de Investigación';
            projectMainSubtitle.textContent = '8 proyectos competitivos: 1 internacional, 5 nacionales y 2 autonómicos';
          } else if (filter === 'innovación') {
            projectMainTitle.textContent = 'Proyectos de Innovación Docente';
            projectMainSubtitle.textContent = '2 proyectos de innovación docente vigentes y finalizados';
          } else if (filter === 'transferencia') {
            projectMainTitle.textContent = 'Proyectos de Transferencia de Conocimiento';
            projectMainSubtitle.textContent = '4 contratos art. 60 LOSU con entidades públicas y privadas';
          } else {
            projectMainTitle.textContent = 'Proyectos';
            projectMainSubtitle.textContent = '14 proyectos en total: 8 de investigación, 2 de innovación docente y 4 de transferencia.';
          }
        }
      };

      projectButtons.forEach((button) => {
        button.addEventListener('click', () => {
          projectButtons.forEach((b) => b.classList.remove('is-active'));
          button.classList.add('is-active');
          applyProjectFilter(button.dataset.filter || 'all');
        });
      });

      applyProjectFilter('all');
    }

    const acadFilterWrap = document.getElementById('acad-filters');
    const acadMainTitle = document.getElementById('acad-main-title');
    const acadMainSubtitle = document.getElementById('acad-main-subtitle');
    const acadKpis = document.getElementById('acad-kpis');
    const acadKpiItems = acadKpis ? Array.from(acadKpis.querySelectorAll('.mini[data-kind]')) : [];
    const tfgTitleBlock = document.getElementById('tfg-title-block');
    const tfmTitleBlock = document.getElementById('tfm-title-block');
    const tribTitleBlock = document.getElementById('trib-title-block');
    const tfgStack = document.getElementById('tfg-stack');
    const tfmStack = document.getElementById('tfm-stack');
    const tribStack = document.getElementById('trib-stack');
    if (acadFilterWrap && acadMainTitle && acadMainSubtitle) {
      const acadButtons = Array.from(acadFilterWrap.querySelectorAll('button[data-filter]'));
      const setVisibility = (el, show) => {
        if (!el) return;
        el.classList.toggle('is-hidden', !show);
      };

      const applyAcademicFilter = (filter) => {
        const showTFG = filter === 'all' || filter === 'tfg';
        const showTFM = filter === 'all' || filter === 'tfm';
        const showTrib = filter === 'all' || filter === 'tribunales';
        const singleType = filter !== 'all';

        setVisibility(tfgTitleBlock, showTFG && !singleType);
        setVisibility(tfgStack, showTFG);
        setVisibility(tfmTitleBlock, showTFM && !singleType);
        setVisibility(tfmStack, showTFM);
        setVisibility(tribTitleBlock, showTrib && !singleType);
        setVisibility(tribStack, showTrib);

        if (acadKpis) {
          setVisibility(acadKpis, filter === 'all');
          acadKpiItems.forEach((item) => {
            setVisibility(item, true);
          });
        }

        if (filter === 'tfg') {
          acadMainTitle.textContent = 'Dirección de TFG';
          acadMainSubtitle.textContent = '6 trabajos dirigidos con defensas entre 2023 y 2025.';
        } else if (filter === 'tfm') {
          acadMainTitle.textContent = 'Dirección de TFM';
          acadMainSubtitle.textContent = '3 trabajos de máster dirigidos entre 2024 y 2025.';
        } else if (filter === 'tribunales') {
          acadMainTitle.textContent = 'Participación en Tribunales';
          acadMainSubtitle.textContent = '10 participaciones registradas en defensas de 2023-24 y 2024-25.';
        } else {
          acadMainTitle.textContent = 'Dirección de TFG, TFM y Tribunales';
          acadMainSubtitle.textContent = 'Datos actualizados según certificados de TFGs, TFMs y Tribunales (febrero 2026).';
        }
      };

      acadButtons.forEach((button) => {
        button.addEventListener('click', () => {
          acadButtons.forEach((b) => b.classList.remove('is-active'));
          button.classList.add('is-active');
          applyAcademicFilter(button.dataset.filter || 'all');
        });
      });

      applyAcademicFilter('all');
    }

    const normalizeTitle = (text) =>
      (text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

    const tfgCards = Array.from(document.querySelectorAll('#tfg-stack .card'));
    const tfmCards = Array.from(document.querySelectorAll('#tfm-stack .card'));
    const tribCards = Array.from(document.querySelectorAll('#trib-stack .card'));
    const directedCards = [...tfgCards, ...tfmCards];

    const directedTitleSet = new Set(
      directedCards
        .map((card) => normalizeTitle(card.querySelector('h3')?.textContent || ''))
        .filter(Boolean)
    );
    const tribunalTitleSet = new Set(
      tribCards
        .map((card) => normalizeTitle(card.querySelector('h3')?.textContent || ''))
        .filter(Boolean)
    );

    tribCards.forEach((card) => {
      const title = normalizeTitle(card.querySelector('h3')?.textContent || '');
      if (!title || !directedTitleSet.has(title)) return;
      if (card.querySelector('.cross-role-note')) return;
      const note = document.createElement('p');
      note.className = 'cross-role-note';
      note.textContent = 'Tambien en TFG/TFM (direccion o codireccion).';
      card.appendChild(note);
    });

    directedCards.forEach((card) => {
      const title = normalizeTitle(card.querySelector('h3')?.textContent || '');
      if (!title || !tribunalTitleSet.has(title)) return;
      if (card.querySelector('.cross-role-note')) return;
      const note = document.createElement('p');
      note.className = 'cross-role-note';
      note.textContent = 'Tambien en tribunales.';
      card.appendChild(note);
    });

    const revealTargets = document.querySelectorAll('.hero-copy, .hero-media, .impact-card, .title, .card');
    revealTargets.forEach((el) => el.classList.add('reveal-in'));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((el) => revealObserver.observe(el));

    const countUp = (el, endValue, duration = 1100) => {
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(endValue * progress);
        el.textContent = value.toLocaleString('es-ES');
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        countUp(el, target);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => counterObserver.observe(el));
  