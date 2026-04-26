const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;
const DATA_PATH = path.join(__dirname, 'data', 'content.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const base = path
      .basename(file.originalname || 'file', ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'upload';

    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 95 * 1024 * 1024 // 90MB
  }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true, limit: '90mb' }));
app.use(express.json({ limit: '90mb' }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'jennifer-portfolio-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);
app.use(express.static(path.join(__dirname, 'public')));

function loadContent() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (error) {
    console.error('Unable to load content:', error);
    return {
      site: {},
      introStatement: '',
      toc: [],
      education: [],
      workExperience: [],
      skills: [],
      projects: [],
      accomplishments: [],
      volunteerWork: [],
      certifications: [],
      photoGallery: [],
      weeks: [],
      references: [],
      recommendationLetters: [],
      blogPosts: [],
      careerPlanning: {
        targetCareerFieldTitle: 'Target Career Field',
        targetCareerFieldSummary: '',
        jobOutlook: '',
        requiredQualifications: [],
        potentialEmployers: [],
        shortTermTitle: 'Short-Term Career Plan (1–3 Years)',
        shortTermText: '',
        shortTermMilestones: [],
        longTermTitle: 'Long-Term Career Plan (5–10 Years)',
        longTermText: '',
        longTermMilestones: []
      }
    };
  }
}

function saveContent(content) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(content, null, 2), 'utf8');
}

function isAdmin(req) {
  return Boolean(req.session && req.session.isAdmin);
}

function requireAdmin(req, res, next) {
  if (!isAdmin(req)) {
    return res.redirect('/login');
  }
  return next();
}

function cleanText(value = '') {
  return String(value).trim();
}

function parseJsonField(value, fallback = []) {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (_error) {
    return fallback;
  }
}

function cleanListFromTextarea(value = '') {
  return String(value)
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanItemArray(items, shape) {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      const cleaned = {};
      let hasValue = false;

      shape.forEach((field) => {
        cleaned[field] = cleanText(item?.[field] || '');
        if (cleaned[field]) hasValue = true;
      });

      return hasValue ? cleaned : null;
    })
    .filter(Boolean);
}

function getUploadedPath(files, fieldName) {
  const match = (Array.isArray(files) ? files : []).find((file) => file.fieldname === fieldName);
  if (!match) return '';
  return `/uploads/${match.filename}`;
}
function cleanMultilineText(value = '') {
  return String(value || '').trim();
}

function slugify(value = '') {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildUniqueSlug(value, usedSlugs) {
  const base = slugify(value) || 'post';
  let candidate = base;
  let counter = 2;

  while (usedSlugs.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }

  usedSlugs.add(candidate);
  return candidate;
}

function stripHtml(value = '') {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

app.get('/', (req, res) => {
  const content = loadContent();
  res.render('home', {
    content,
    isAdmin: isAdmin(req)
  });
});

app.get('/login', (req, res) => {
  if (isAdmin(req)) {
    return res.redirect('/admin');
  }
  const content = loadContent();

  return res.render('login', {
        content,
            isAdmin: isAdmin(req),

    error: req.query.error || ''
  });
});

app.post('/login', (req, res) => {
  const username = cleanText(req.body.username);
  const password = cleanText(req.body.password);
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'change-me';

  if (username === adminUsername && password === adminPassword) {
    req.session.isAdmin = true;
    return res.redirect('/admin?message=Welcome%20back!');
  }

  return res.redirect('/login?error=Invalid%20username%20or%20password.');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/admin', requireAdmin, (req, res) => {
  const content = loadContent();
  
  res.render('admin', {
    content,
                isAdmin: isAdmin(req),

    message: req.query.message || '',
    error: req.query.error || ''
  });
});

app.post('/admin/save', requireAdmin, upload.any(), (req, res) => {
  try {
    const current = loadContent();
    const files = Array.isArray(req.files) ? req.files : [];

    const updatedSite = {
      ownerName: cleanText(req.body.ownerName) || current.site.ownerName,
      siteTitle: cleanText(req.body.siteTitle) || current.site.siteTitle,
      heroTitle: cleanText(req.body.heroTitle) || current.site.heroTitle,
      tagline: cleanText(req.body.tagline) || current.site.tagline,
      subtitle: cleanText(req.body.subtitle) || current.site.subtitle,
      program: cleanText(req.body.program) || current.site.program,
      professionalTitle: cleanText(req.body.professionalTitle) || current.site.professionalTitle,
      email: cleanText(req.body.email) || current.site.email,
      phone: cleanText(req.body.phone) || current.site.phone,
      linkedinUrl: cleanText(req.body.linkedinUrl) || current.site.linkedinUrl,
      resumeUrl:
        getUploadedPath(files, 'resumeFile') ||
        cleanText(req.body.resumeUrl) ||
        current.site.resumeUrl,

      coverLetterUrl:
        getUploadedPath(files, 'coverLetterFile') ||
        cleanText(req.body.coverLetterUrl) ||
        current.site.coverLetterUrl,
      footerNote: cleanText(req.body.footerNote) || current.site.footerNote,
      heroVideo:
        getUploadedPath(files, 'heroVideoFile') ||
        cleanText(req.body.heroVideo) ||
        current.site.heroVideo,
      heroPoster:
        getUploadedPath(files, 'heroPosterFile') ||
        cleanText(req.body.heroPoster) ||
        current.site.heroPoster,
      profileImage:
        getUploadedPath(files, 'profileImageFile') ||
        cleanText(req.body.profileImage) ||
        current.site.profileImage,
      featureBackground:
        getUploadedPath(files, 'featureBackgroundFile') ||
        cleanText(req.body.featureBackground) ||
        current.site.featureBackground
    };

    const education = cleanItemArray(
      parseJsonField(req.body.educationJson, current.education),
      ['degree', 'school', 'year', 'description']
    );

    const workExperience = cleanItemArray(
      parseJsonField(req.body.workExperienceJson, current.workExperience),
      ['role', 'employer', 'dates', 'description']
    );

    const projectsInput = parseJsonField(req.body.projectsJson, current.projects);

    const projects = (Array.isArray(projectsInput) ? projectsInput : [])
      .map((item, index) => ({
        title: cleanText(item?.title),
        description: cleanText(item?.description),
        link: cleanText(item?.link),
        fileUrl:
          getUploadedPath(files, `projects_projectFile_${index}`) ||
          cleanText(item?.fileUrl)
      }))
      .filter((item) => item.title || item.description || item.link || item.fileUrl);
    const volunteerWorkInput = parseJsonField(req.body.volunteerWorkJson, current.volunteerWork);

    const volunteerWork = (Array.isArray(volunteerWorkInput) ? volunteerWorkInput : [])
      .map((item, index) => ({
        organization: cleanText(item?.organization),
        role: cleanText(item?.role),
        dates: cleanText(item?.dates),
        description: cleanText(item?.description),
        logoUrl:
          getUploadedPath(files, `volunteerWork_logoFile_${index}`) ||
          cleanText(item?.logoUrl)
      }))
      .filter((item) => item.organization || item.role || item.dates || item.description || item.logoUrl);

    const references = cleanItemArray(
      parseJsonField(req.body.referencesJson, current.references),
      ['name', 'organization', 'role', 'connection', 'email', 'phone', 'linkedinUrl', 'notes']
    );

    const recommendationLettersInput = parseJsonField(
      req.body.recommendationLettersJson,
      current.recommendationLetters
    );

    const recommendationLetters = (Array.isArray(recommendationLettersInput) ? recommendationLettersInput : [])
      .map((item, index) => ({
        title: cleanText(item?.title),
        recommenderName: cleanText(item?.recommenderName),
        relationship: cleanText(item?.relationship),
        description: cleanText(item?.description),
        pdfUrl:
          getUploadedPath(files, `recommendationLetters_pdfFile_${index}`) ||
          cleanText(item?.pdfUrl)
      }))
      .filter((item) => item.title || item.recommenderName || item.relationship || item.description || item.pdfUrl);

    const blogPostsInput = parseJsonField(req.body.blogPostsJson, current.blogPosts);
    const usedSlugs = new Set();

    const blogPosts = (Array.isArray(blogPostsInput) ? blogPostsInput : [])
      .map((item, index) => {
        const body = cleanMultilineText(item?.body);
        const excerpt = cleanText(item?.excerpt) || stripHtml(body).slice(0, 180);

        return {
          title: cleanText(item?.title),
          slug: buildUniqueSlug(cleanText(item?.title) || `post-${index + 1}`, usedSlugs),
          author: cleanText(item?.author) || updatedSite.ownerName,
          category: cleanText(item?.category),
          publishDate: cleanText(item?.publishDate),
          excerpt,
          body,
          imageUrl:
            getUploadedPath(files, `blogPosts_imageFile_${index}`) ||
            cleanText(item?.imageUrl),
          videoUrl:
            getUploadedPath(files, `blogPosts_videoFile_${index}`) ||
            cleanText(item?.videoUrl)
        };
      })
      .filter((item) => item.title || item.excerpt || item.body || item.imageUrl || item.videoUrl);

    const weeksInput = parseJsonField(req.body.weeksJson, current.weeks);
    const weeks = (Array.isArray(weeksInput) ? weeksInput : [])
      .map((week) => ({
        title: cleanText(week?.title),
        summary: cleanText(week?.summary),
        details: Array.isArray(week?.details)
          ? week.details.map((detail) => cleanText(detail)).filter(Boolean)
          : cleanListFromTextarea(week?.details || '')
      }))
      .filter((week) => week.title || week.summary || week.details.length);

    const photoGalleryDraft = cleanItemArray(
      parseJsonField(req.body.photoGalleryJson, current.photoGallery),
      ['title', 'caption', 'image']
    );

    const galleryFromCurrent = Array.isArray(current.photoGallery) ? current.photoGallery : [];
    const mergedGallery = [0, 1, 2].map((index) => {
      const fromForm = photoGalleryDraft[index] || {};
      const fromCurrent = galleryFromCurrent[index] || {};
      const uploadedPath = getUploadedPath(files, `galleryImage${index}`);
      const manualImage = cleanText(req.body[`galleryImageUrl${index}`]);

      return {
        title: cleanText(fromForm.title || fromCurrent.title),
        caption: cleanText(fromForm.caption || fromCurrent.caption),
        image: uploadedPath || manualImage || cleanText(fromForm.image || fromCurrent.image)
      };
    });

    const updatedCareerPlanning = {
      targetCareerFieldTitle: cleanText(req.body.careerFieldTitle) || 'Target Career Field',
      targetCareerFieldSummary: cleanMultilineText(req.body.careerFieldSummary),
      jobOutlook: cleanMultilineText(req.body.careerJobOutlook),
      requiredQualifications: cleanListFromTextarea(req.body.careerRequiredQualifications),
      potentialEmployers: cleanListFromTextarea(req.body.careerPotentialEmployers),
      shortTermTitle: cleanText(req.body.careerShortTermTitle) || 'Short-Term Career Plan (1–3 Years)',
      shortTermText: cleanMultilineText(req.body.careerShortTermText),
      shortTermMilestones: cleanListFromTextarea(req.body.careerShortTermMilestones),
      longTermTitle: cleanText(req.body.careerLongTermTitle) || 'Long-Term Career Plan (5–10 Years)',
      longTermText: cleanMultilineText(req.body.careerLongTermText),
      longTermMilestones: cleanListFromTextarea(req.body.careerLongTermMilestones)
    };

    const updatedContent = {
      ...current,
      site: updatedSite,
      introStatement: cleanText(req.body.introStatement) || current.introStatement,
      toc: cleanItemArray(parseJsonField(req.body.tocJson, current.toc), ['title', 'anchor']),
      education,
      workExperience,
      skills: cleanListFromTextarea(req.body.skillsText),
      projects,
      accomplishments: cleanListFromTextarea(req.body.accomplishmentsText),
      volunteerWork,
      certifications: cleanListFromTextarea(req.body.certificationsText),
      photoGallery: mergedGallery,
      weeks,
      references,
      recommendationLetters,
      blogPosts,
      careerPlanning: updatedCareerPlanning
    };

    saveContent(updatedContent);
    return res.redirect('/admin?message=Changes%20saved%20successfully.');
  } catch (error) {
    console.error(error);
    return res.redirect('/admin?error=Something%20went%20wrong%20while%20saving.');
  }
});


app.get('/blog/:slug', (req, res) => {
  const content = loadContent();
  const post = (content.blogPosts || []).find((item) => item.slug === req.params.slug);

  if (!post) {
    return res.status(404).render('login', {
      error: 'Blog post not found.'
    });
  }

  return res.render('blog-post', {
    content,
    post,
    isAdmin: isAdmin(req)
  });
});

app.use((_req, res) => {
  res.status(404).render('login', {
    error: 'Page not found. Use the navigation to continue.'
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Jennifer portfolio app is running on http://localhost:${PORT}`);
});
