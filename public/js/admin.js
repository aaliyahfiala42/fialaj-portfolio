(function () {
  const form = document.getElementById('portfolioForm');
  const dataElement = document.getElementById('admin-data');

  if (!form || !dataElement) return;

  const initialData = JSON.parse(dataElement.textContent || '{}');

  const repeaterConfig = {
    toc: {
      containerId: 'tocContainer',
      hiddenId: 'tocJson',
      fields: [
        { key: 'title', label: 'Link Title' },
        { key: 'anchor', label: 'Anchor ID' }
      ]
    },
    education: {
      containerId: 'educationContainer',
      hiddenId: 'educationJson',
      fields: [
        { key: 'degree', label: 'Degree' },
        { key: 'school', label: 'School' },
        { key: 'year', label: 'Year' },
        { key: 'description', label: 'Description', type: 'textarea' }
      ]
    },
    workExperience: {
      containerId: 'workExperienceContainer',
      hiddenId: 'workExperienceJson',
      fields: [
        { key: 'role', label: 'Role' },
        { key: 'employer', label: 'Employer' },
        { key: 'dates', label: 'Dates' },
        { key: 'description', label: 'Description', type: 'textarea' }
      ]
    },
projects: {
  containerId: 'projectsContainer',
  hiddenId: 'projectsJson',
  fields: [
    { key: 'title', label: 'Project Title' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'link', label: 'Project Link', type: 'url' },
    {
      key: 'imageUrl',
      label: 'Project Cover Photo URL',
      type: 'text',
      placeholder: '/uploads/project-cover.jpg'
    },
    {
      key: 'imageFile',
      label: 'Upload Project Cover Photo',
      type: 'file',
      accept: 'image/png,image/jpeg,image/jpg,image/webp,image/gif,image/*',
      previewKey: 'imageUrl',
      previewLabel: 'Open current cover photo',
      previewType: 'image'
    },
    {
      key: 'fileUrl',
      label: 'Project File URL',
      type: 'text',
      placeholder: '/uploads/example-project.pdf'
    },
    {
      key: 'projectFile',
      label: 'Upload Project File',
      type: 'file',
      accept: '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.mp4,.mov,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*,video/*',
      previewKey: 'fileUrl',
      previewLabel: 'Open current project file'
    }
  ]
},
    volunteerWork: {
      containerId: 'volunteerWorkContainer',
      hiddenId: 'volunteerWorkJson',
      fields: [
        { key: 'organization', label: 'Organization' },
        { key: 'role', label: 'Role' },
        { key: 'dates', label: 'Dates' },
        { key: 'description', label: 'Description', type: 'textarea' },
        {
          key: 'logoUrl',
          label: 'Logo URL',
          type: 'text',
          placeholder: '/uploads/example-logo.png'
        },
        {
          key: 'logoFile',
          label: 'Upload Logo',
          type: 'file',
          accept: 'image/png,image/jpeg,image/webp,image/svg+xml',
          previewKey: 'logoUrl',
          previewLabel: 'Open current logo',
          previewType: 'image'
        }
      ]
    },
    weeks: {
      containerId: 'weeksContainer',
      hiddenId: 'weeksJson',
      fields: [
        { key: 'title', label: 'Week Title' },
        { key: 'summary', label: 'Summary', type: 'textarea' },
        {
          key: 'details',
          label: 'Details (one per line)',
          type: 'textarea',
          serializeAsList: true
        }
      ]
    },
    references: {
      containerId: 'referencesContainer',
      hiddenId: 'referencesJson',
      fields: [
        { key: 'name', label: 'Reference Name' },
        { key: 'organization', label: 'Organization' },
        { key: 'role', label: 'Role / Title' },
        { key: 'connection', label: 'Connection to Them' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'phone', label: 'Phone' },
        { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
        { key: 'notes', label: 'Notes', type: 'textarea' }
      ]
    },
    recommendationLetters: {
      containerId: 'recommendationLettersContainer',
      hiddenId: 'recommendationLettersJson',
      fields: [
        { key: 'title', label: 'Letter Title' },
        { key: 'recommenderName', label: 'Recommender Name' },
        { key: 'relationship', label: 'Relationship' },
        { key: 'description', label: 'Description', type: 'textarea' },
        {
          key: 'pdfFile',
          label: 'Upload PDF',
          type: 'file',
          accept: '.pdf,application/pdf',
          previewKey: 'pdfUrl',
          previewLabel: 'Open current PDF'
        }
      ]
    },
    blogPosts: {
      containerId: 'blogPostsContainer',
      hiddenId: 'blogPostsJson',
      fields: [
        { key: 'title', label: 'Post Title' },
        { key: 'author', label: 'Author' },
        { key: 'category', label: 'Category' },
        { key: 'publishDate', label: 'Publish Date', type: 'date' },
        { key: 'excerpt', label: 'Card Excerpt', type: 'textarea' },
        {
          key: 'imageUrl',
          label: 'Featured Image URL',
          type: 'text',
          placeholder: '/uploads/example-featured-image.jpg'
        },
        {
          key: 'imageFile',
          label: 'Upload Featured Photo',
          type: 'file',
          accept: 'image/*',
          previewKey: 'imageUrl',
          previewLabel: 'Open current featured photo',
          previewType: 'image'
        },
        {
          key: 'imageUrls',
          label: 'All Blog Image URLs (one per line)',
          type: 'textarea',
          serializeAsList: true
        },
        {
          key: 'imageFiles',
          label: 'Upload Additional Blog Photos',
          type: 'file',
          accept: 'image/*',
          multiple: true,
          previewKey: 'imageUrls',
          previewLabel: 'Current blog photos',
          previewType: 'image'
        },
        {
          key: 'videoFile',
          label: 'Upload Video',
          type: 'file',
          accept: 'video/*',
          previewKey: 'videoUrl',
          previewLabel: 'Open current video'
        },
        { key: 'body', label: 'Full Blog Post', type: 'richtext' }
      ]
    }
  };

  const state = {};

  Object.keys(repeaterConfig).forEach((key) => {
    state[key] = Array.isArray(initialData[key]) ? initialData[key] : [];
  });

  function textareaValue(value) {
    if (Array.isArray(value)) return value.join('\n');
    return value || '';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getInputType(field) {
    if (!field.type || ['textarea', 'richtext', 'file'].includes(field.type)) return 'text';
    return field.type;
  }

  function renderFilePreview(field, currentValue, item) {
    const values = Array.isArray(currentValue)
      ? currentValue.filter(Boolean)
      : String(currentValue || '')
          .split(/\r?\n|,/)
          .map((value) => value.trim())
          .filter(Boolean);

    if (!values.length) return '';

    const safeAlt = escapeHtml(
      item.organization ||
        item.title ||
        item.name ||
        field.previewLabel ||
        'Current uploaded file'
    );

    if (field.previewType === 'image') {
      const images = values
        .map((value) => {
          const safeUrl = escapeHtml(value);
          return `
            <a class="admin-file-preview-tile" href="${safeUrl}" target="_blank" rel="noreferrer">
              <img src="${safeUrl}" alt="${safeAlt}" class="admin-logo-preview" />
            </a>
          `;
        })
        .join('');

      return `
        <div class="admin-file-preview admin-file-preview-grid">
          ${images}
          <small>${field.previewLabel || 'Open current image'}</small>
        </div>
      `;
    }

    return values
      .map((value) => {
        const safeUrl = escapeHtml(value);
        return `
          <a class="text-link" href="${safeUrl}" target="_blank" rel="noreferrer">
            ${field.previewLabel || 'Open current file'}
          </a>
        `;
      })
      .join('');
  }

  function renderFieldMarkup(group, field, item, index) {
    const value =
      field.type === 'textarea' || field.type === 'richtext'
        ? textareaValue(item[field.key])
        : item[field.key] || '';

    if (field.type === 'file') {
      const currentValue = field.previewKey ? item[field.previewKey] || '' : '';

      return `
        <label style="grid-column: 1 / -1;">
          <span>${field.label}</span>
          ${renderFilePreview(field, currentValue, item)}
          <input type="file" name="${group}_${field.key}_${index}" accept="${field.accept || '*/*'}" ${field.multiple ? 'multiple' : ''} />
        </label>
      `;
    }

    if (field.type === 'richtext') {
      return `
        <label style="grid-column: 1 / -1;">
          <span>${field.label}</span>
          <div class="button-cluster" style="margin-bottom: 0.75rem;">
            <button type="button" class="button button-secondary editor-action" data-action="bold">Bold</button>
            <button type="button" class="button button-secondary editor-action" data-action="italic">Italic</button>
            <button type="button" class="button button-secondary editor-action" data-action="paragraph">Paragraph Break</button>
          </div>
          <textarea rows="12" data-key="${field.key}" data-index="${index}" data-group="${group}" class="richtext-input">${escapeHtml(value)}</textarea>
          <small>Whitespace is preserved. Use the toolbar to wrap selected text in bold or italic.</small>
        </label>
      `;
    }

    if (field.type === 'textarea') {
      return `
        <label ${field.serializeAsList ? 'style="grid-column: 1 / -1;"' : ''}>
          <span>${field.label}</span>
          <textarea rows="5" data-key="${field.key}" data-index="${index}" data-group="${group}">${escapeHtml(value)}</textarea>
        </label>
      `;
    }

    return `
      <label>
        <span>${field.label}</span>
        <input
          type="${getInputType(field)}"
          value="${escapeHtml(value)}"
          data-key="${field.key}"
          data-index="${index}"
          data-group="${group}"
          ${field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : ''}
        />
      </label>
    `;
  }

  function renderRepeater(key) {
    const config = repeaterConfig[key];
    const container = document.getElementById(config.containerId);
    if (!container) return;

    container.innerHTML = '';

    if (!state[key].length) {
      addItem(key);
      return;
    }

    state[key].forEach((item, index) => {
      const card = document.createElement('article');
      card.className = 'repeater-card';

      const fieldsMarkup = config.fields
        .map((field) => renderFieldMarkup(key, field, item, index))
        .join('');

      card.innerHTML = `
        <div class="repeater-card-top">
          <strong>${getRepeaterTitle(key, item, index)}</strong>
          <button type="button" class="remove-item" data-group="${key}" data-index="${index}">Remove</button>
        </div>
        <div class="admin-grid two-col-form">
          ${fieldsMarkup}
        </div>
      `;

      container.appendChild(card);
    });
  }

  function getRepeaterTitle(key, item, index) {
    if (key === 'volunteerWork' && item.organization) return escapeHtml(item.organization);
    if (key === 'blogPosts' && item.title) return escapeHtml(item.title);
    if (key === 'projects' && item.title) return escapeHtml(item.title);
    if (key === 'references' && item.name) return escapeHtml(item.name);
    if (key === 'education' && item.degree) return escapeHtml(item.degree);
    if (key === 'workExperience' && item.role) return escapeHtml(item.role);
    return `Item ${index + 1}`;
  }

  function addItem(key) {
    const config = repeaterConfig[key];
    const emptyItem = {};

    config.fields.forEach((field) => {
      if (field.type === 'file') return;
      emptyItem[field.key] = field.serializeAsList ? [] : '';
    });

    state[key].push(emptyItem);
    renderRepeater(key);
  }

  function syncField(target) {
    const group = target.dataset.group;
    const index = Number(target.dataset.index);
    const key = target.dataset.key;
    const config = repeaterConfig[group];

    if (!state[group] || Number.isNaN(index) || !config) return;

    const fieldConfig = config.fields.find((field) => field.key === key);

    if (fieldConfig && fieldConfig.serializeAsList) {
      state[group][index][key] = target.value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    } else {
      state[group][index][key] = target.value;
    }
  }

  function wrapSelection(textarea, before, after) {
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selected = textarea.value.slice(start, end);
    const replacement = `${before}${selected}${after}`;

    textarea.setRangeText(replacement, start, end, 'end');
    textarea.focus();
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function insertText(textarea, text) {
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;

    textarea.setRangeText(text, start, end, 'end');
    textarea.focus();
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  Object.keys(repeaterConfig).forEach((key) => {
    renderRepeater(key);
  });

  document.querySelectorAll('.add-item').forEach((button) => {
    button.addEventListener('click', () => {
      addItem(button.dataset.target);
    });
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (!target.matches('[data-group][data-index][data-key]')) return;
    syncField(target);
  });

  document.addEventListener('click', (event) => {
    const editorButton = event.target.closest('.editor-action');

    if (editorButton) {
      const wrapper = editorButton.closest('label');
      const textarea = wrapper ? wrapper.querySelector('textarea') : null;
      if (!textarea) return;

      const action = editorButton.dataset.action;

      if (action === 'bold') {
        wrapSelection(textarea, '<strong>', '</strong>');
      } else if (action === 'italic') {
        wrapSelection(textarea, '<em>', '</em>');
      } else if (action === 'paragraph') {
        insertText(textarea, '\n\n');
      }

      return;
    }

    const button = event.target.closest('.remove-item');
    if (!button) return;

    const group = button.dataset.group;
    const index = Number(button.dataset.index);

    if (!state[group] || Number.isNaN(index)) return;

    state[group].splice(index, 1);
    renderRepeater(group);
  });

  function collectGalleryData() {
    const cards = document.querySelectorAll('.admin-gallery-grid .media-card');

    return Array.from(cards).map((card, index) => ({
      title: card.querySelector(`.gallery-title[data-index="${index}"]`)?.value || '',
      caption: card.querySelector(`.gallery-caption[data-index="${index}"]`)?.value || '',
      image: card.querySelector(`.gallery-image-url[data-index="${index}"]`)?.value || ''
    }));
  }

  form.addEventListener('submit', () => {
    Object.entries(repeaterConfig).forEach(([key, config]) => {
      const hidden = document.getElementById(config.hiddenId);

      if (hidden) {
        hidden.value = JSON.stringify(state[key]);
      }
    });

    const galleryHidden = document.getElementById('photoGalleryJson');

    if (galleryHidden) {
      galleryHidden.value = JSON.stringify(collectGalleryData());
    }
  });
})();