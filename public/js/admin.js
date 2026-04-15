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
        { key: 'link', label: 'Project Link' }
      ]
    },
    volunteerWork: {
      containerId: 'volunteerWorkContainer',
      hiddenId: 'volunteerWorkJson',
      fields: [
        { key: 'organization', label: 'Organization' },
        { key: 'role', label: 'Role' },
        { key: 'dates', label: 'Dates' },
        { key: 'description', label: 'Description', type: 'textarea' }
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
    }
  };

  const state = {
    toc: Array.isArray(initialData.toc) ? initialData.toc : [],
    education: Array.isArray(initialData.education) ? initialData.education : [],
    workExperience: Array.isArray(initialData.workExperience) ? initialData.workExperience : [],
    projects: Array.isArray(initialData.projects) ? initialData.projects : [],
    volunteerWork: Array.isArray(initialData.volunteerWork) ? initialData.volunteerWork : [],
    weeks: Array.isArray(initialData.weeks) ? initialData.weeks : []
  };

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
        .map((field) => {
          const value = field.type === 'textarea' ? textareaValue(item[field.key]) : item[field.key] || '';

          if (field.type === 'textarea') {
            return `
              <label>
                <span>${field.label}</span>
                <textarea rows="5" data-key="${field.key}" data-index="${index}" data-group="${key}">${escapeHtml(value)}</textarea>
              </label>
            `;
          }

          return `
            <label>
              <span>${field.label}</span>
              <input type="text" value="${escapeHtml(value)}" data-key="${field.key}" data-index="${index}" data-group="${key}" />
            </label>
          `;
        })
        .join('');

      card.innerHTML = `
        <div class="repeater-card-top">
          <strong>Item ${index + 1}</strong>
          <button type="button" class="remove-item" data-group="${key}" data-index="${index}">Remove</button>
        </div>
        <div class="admin-grid two-col-form">
          ${fieldsMarkup}
        </div>
      `;

      container.appendChild(card);
    });
  }

  function addItem(key) {
    const config = repeaterConfig[key];
    const emptyItem = {};
    config.fields.forEach((field) => {
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
    const fieldConfig = config.fields.find((field) => field.key === key);

    if (!state[group] || Number.isNaN(index)) return;

    if (fieldConfig && fieldConfig.serializeAsList) {
      state[group][index][key] = target.value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    } else {
      state[group][index][key] = target.value;
    }
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
    const button = event.target.closest('.remove-item');
    if (!button) return;

    const group = button.dataset.group;
    const index = Number(button.dataset.index);

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
