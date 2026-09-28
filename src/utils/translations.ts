export type Language = 'en' | 'es' | 'ur' | 'hi' | 'ar' | 'fr' | 'de';

export interface TranslationDict {
  // Navigation & Sections
  appName: string;
  appTagline: string;
  dashboard: string;
  myWorks: string;
  programs: string;
  abstracts: string;
  aiParser: string;
  calendar: string;
  notifications: string;
  analytics: string;
  authorsReviewers: string;
  settings: string;
  feedbackImprovement: string;

  // Header & Stats
  top5Upcoming: string;
  masterRegister: string;
  totalPrograms: string;
  approachingSoon: string;
  onlinePrograms: string;
  offlinePrograms: string;
  newProgram: string;
  parseDocument: string;

  // Modes & Status
  online: string;
  offline: string;
  scheduled: string;
  concluded: string;
  imminentAlert: string;

  // Actions & Buttons
  expandDetails: string;
  edit: string;
  delete: string;
  save: string;
  cancel: string;
  close: string;
  copyText: string;
  exportMarkdown: string;
  searchPlaceholder: string;
  filterAll: string;
  filterOnline: string;
  filterOffline: string;
  dateEarliest: string;
  dateLatest: string;

  // Auth Section
  login: string;
  signup: string;
  logout: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  institutionRole: string;
  forgotPassword: string;
  resetPassword: string;
  sendResetLink: string;
  backToLogin: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  demoLogin: string;
  signedInAs: string;
  resetEmailSent: string;

  // Feedback Section
  leaveFeedbackTitle: string;
  leaveFeedbackDesc: string;
  feedbackCategory: string;
  feedbackRating: string;
  feedbackMessage: string;
  submitFeedback: string;
  feedbackSubmitted: string;
  uiux: string;
  featureRequest: string;
  bugReport: string;
  generalIdea: string;

  // Abstract & AI Parser
  structuredAbstract: string;
  extractedFindings: string;
  finalNotes: string;
  dropDocumentHere: string;
  saveToRegistry: string;
  wordCount: string;
  charCount: string;
  programNameLabel: string;
  programDateLabel: string;
  timeWindowLabel: string;
  modeLabel: string;
  locationPlatformLabel: string;
  themesTopicsLabel: string;
  abstractLabel: string;
  keySummariesLabel: string;
  finalNotesLabel: string;
  scanningOcrText: string;
  metadataExtractingText: string;
  abstractValidatingText: string;
  synthesizingFieldsText: string;
  browseLocal: string;
  orTestSample: string;
  loadedBadge: string;
  exceedsBoundaryLimit: string;
  addTheme: string;
  addPoint: string;

  // Theme & Mode
  themeColor: string;
  dayNightMode: string;
  lightMode: string;
  darkMode: string;
  midnightMode: string;
  language: string;

  // Header & Landing Spec Keys
  portalTitle: string;
  mainHeadline: string;
  subDescription: string;

  // Primary Actions
  btnListProgram: string;
  btnBrowsePrograms: string;
  btnQuickLogin: string;

  // Demo Profiles
  roleScholar: string;
  roleChair: string;
  roleAdmin: string;

  // Dashboard Panels & Labels
  titleRegister: string;
  titleAbstracts: string;
  titleParser: string;
  labelWorking: string;
  labelDone: string;

  // Form Fields & Placeholders
  formName: string;
  formDate: string;
  formTime: string;
  formLocation: string;
  formPlaceholder: string;

  // Header & Card labels
  eventsLabel: string;
  aiPoweredLabel: string;
  adminModeActiveLabel: string;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    appName: 'Academic Hub',
    appTagline: 'Discover academic events, track your submissions, and extract document details automatically.',
    dashboard: 'Dashboard',
    myWorks: 'My Works',
    programs: 'Programs',
    abstracts: 'Abstracts',
    aiParser: 'Upload',
    calendar: 'Calendar',
    notifications: 'Notifications',
    analytics: 'Analytics',
    authorsReviewers: 'Authors & Reviewers',
    settings: 'Settings',
    feedbackImprovement: 'Feedback & Ideas',

    top5Upcoming: 'Upcoming Events',
    masterRegister: 'Academic Programs',
    totalPrograms: 'Total Events',
    approachingSoon: 'Coming Soon',
    onlinePrograms: 'Online',
    offlinePrograms: 'In-Person',
    newProgram: 'New Program',
    parseDocument: 'Upload Document',

    online: 'Online',
    offline: 'In-Person',
    scheduled: 'Scheduled',
    concluded: 'Past',
    imminentAlert: 'Happening in ≤ 3 Days',

    expandDetails: 'View Details',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    copyText: 'Copy',
    exportMarkdown: 'Export Markdown',
    searchPlaceholder: 'Search events, topics, or venues...',
    filterAll: 'All Formats',
    filterOnline: 'Online Only',
    filterOffline: 'In-Person Only',
    dateEarliest: 'Earliest First',
    dateLatest: 'Latest First',

    login: 'Sign In',
    signup: 'Create Account',
    logout: 'Sign Out',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    institutionRole: 'Institution / Title',
    forgotPassword: 'Forgot password?',
    resetPassword: 'Reset Password',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to Sign In',
    dontHaveAccount: "Don't have an account? Sign Up",
    alreadyHaveAccount: 'Already have an account? Sign In',
    demoLogin: 'Try a Demo Profile',
    signedInAs: 'Signed in as',
    resetEmailSent: 'Password reset link sent to your email.',

    leaveFeedbackTitle: 'Send Feedback',
    leaveFeedbackDesc: 'Share your thoughts, report issues, or suggest features to help us improve.',
    feedbackCategory: 'Category',
    feedbackRating: 'Rating',
    feedbackMessage: 'Your Message',
    submitFeedback: 'Submit',
    feedbackSubmitted: 'Thank you! Your feedback has been received.',
    uiux: 'Visual Design & Usability',
    featureRequest: 'Feature Request',
    bugReport: 'Bug Report',
    generalIdea: 'General Idea',

    structuredAbstract: 'Event Abstract',
    extractedFindings: 'Key Takeaways',
    finalNotes: 'Important Notes',
    dropDocumentHere: 'Drop your PDF or image here',
    saveToRegistry: 'Save to Programs',
    wordCount: 'words',
    charCount: 'characters',
    programNameLabel: 'Event Name',
    programDateLabel: 'Date',
    timeWindowLabel: 'Time',
    modeLabel: 'Format',
    locationPlatformLabel: 'Location or Link',
    themesTopicsLabel: 'Topics',
    abstractLabel: 'Abstract',
    keySummariesLabel: 'Key Highlights',
    finalNotesLabel: 'Notes & Deadlines',
    scanningOcrText: 'Scanning document text...',
    metadataExtractingText: 'Finding event dates and format...',
    abstractValidatingText: 'Reviewing abstract and takeaways...',
    synthesizingFieldsText: 'Filling form fields...',
    browseLocal: 'Choose File',
    orTestSample: 'Or test with a sample document:',
    loadedBadge: 'Loaded',
    exceedsBoundaryLimit: 'Exceeds maximum limit',
    addTheme: 'Add Topic',
    addPoint: 'Add Point',

    themeColor: 'Color Theme',
    dayNightMode: 'Display Mode',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    midnightMode: 'High Contrast',
    language: 'Language',

    portalTitle: 'Academic Hub',
    mainHeadline: 'Discover and Share Academic Events',
    subDescription: 'Find upcoming symposiums, track your submissions, and upload brochures to extract event details instantly.',
    btnListProgram: 'Submit an Opportunity',
    btnBrowsePrograms: 'Browse Programs',
    btnQuickLogin: 'Sign In / Register',
    roleScholar: 'Dr. Sarah Lin (Scholar)',
    roleChair: 'Prof. Elena Vance (Program Chair)',
    roleAdmin: 'Dr. Tariq Al-Mansoor (Admin)',
    titleRegister: 'Academic Programs',
    titleAbstracts: 'Research Abstracts',
    titleParser: 'Document Scanner',
    labelWorking: 'In Progress',
    labelDone: 'Completed',
    formName: 'Event Name',
    formDate: 'Date',
    formTime: 'Time',
    formLocation: 'Location or Online Link',
    formPlaceholder: 'e.g. International Symposium on Machine Learning',

    eventsLabel: 'Events',
    aiPoweredLabel: 'AI Powered',
    adminModeActiveLabel: 'Admin Active',
  },

  es: {
    appName: 'Academic Hub',
    appTagline: 'Organice simposios, cure resúmenes y analice documentos con extracción instantánea por IA.',
    dashboard: 'Panel de Control',
    myWorks: 'Mis Trabajos',
    programs: 'Programas',
    abstracts: 'Resúmenes',
    aiParser: 'Analizador IA',
    calendar: 'Calendario',
    notifications: 'Notificaciones',
    analytics: 'Analítica',
    authorsReviewers: 'Autores y Revisores',
    settings: 'Configuración',
    feedbackImprovement: 'Mejoras y Sugerencias',

    top5Upcoming: 'Top 5 Programas Próximos',
    masterRegister: 'Registro Maestro de Programas Académicos',
    totalPrograms: 'Total de Programas',
    approachingSoon: 'Próximos a Iniciar',
    onlinePrograms: 'Modalidad Online',
    offlinePrograms: 'Modalidad Presencial',
    newProgram: 'Nuevo Programa',
    parseDocument: 'Analizador de Documentos IA',

    online: 'Online',
    offline: 'Presencial',
    scheduled: 'Programado',
    concluded: 'Concluido',
    imminentAlert: 'Próximo a iniciar (≤ 3 Días)',

    expandDetails: 'Ver Detalles',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar Cambios',
    cancel: 'Cancelar',
    close: 'Cerrar',
    copyText: 'Copiar Texto',
    exportMarkdown: 'Exportar .MD',
    searchPlaceholder: 'Buscar programas, temas, resúmenes, sedes...',
    filterAll: 'Todas las Modalidades',
    filterOnline: 'Solo Online',
    filterOffline: 'Solo Presencial',
    dateEarliest: 'Más Temprano',
    dateLatest: 'Más Reciente',

    login: 'Iniciar Sesión',
    signup: 'Crear Cuenta',
    logout: 'Cerrar Sesión',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    fullName: 'Nombre Completo',
    institutionRole: 'Institución / Cargo',
    forgotPassword: '¿Olvidó su contraseña?',
    resetPassword: 'Restablecer Contraseña',
    sendResetLink: 'Enviar Enlace',
    backToLogin: 'Volver a Iniciar Sesión',
    dontHaveAccount: '¿No tiene cuenta? Regístrese',
    alreadyHaveAccount: '¿Ya tiene cuenta? Inicie sesión',
    demoLogin: 'Inicio Demo Rápido',
    signedInAs: 'Sesión iniciada como',
    resetEmailSent: '¡Enlace de restablecimiento enviado a su correo!',

    leaveFeedbackTitle: 'Sugerir una Mejora',
    leaveFeedbackDesc: 'Ayúdenos a perfeccionar la plataforma académica con sus ideas.',
    feedbackCategory: 'Categoría',
    feedbackRating: 'Calificación de Experiencia',
    feedbackMessage: 'Su Mensaje / Recomendación',
    submitFeedback: 'Enviar Mensaje',
    feedbackSubmitted: '¡Gracias! Su sugerencia ha sido guardada.',
    uiux: 'Diseño UI / UX',
    featureRequest: 'Solicitud de Función',
    bugReport: 'Reporte de Error',
    generalIdea: 'Mejora General',

    structuredAbstract: 'Resumen Estructurado',
    extractedFindings: 'Puntos Clave y Conclusiones Extraídas',
    finalNotes: 'Notas Finales y Notificaciones',
    dropDocumentHere: 'Arrastre y suelte documento PDF o Imagen aquí',
    saveToRegistry: 'Guardar en Programas Académicos',
    wordCount: 'palabras',
    charCount: 'caracteres',
    programNameLabel: 'Nombre del Programa',
    programDateLabel: 'Día y Fecha del Programa',
    timeWindowLabel: 'Ventana de Horario',
    modeLabel: 'Modalidad',
    locationPlatformLabel: 'Ubicación / Plataforma',
    themesTopicsLabel: 'Ejes Temáticos y Tópicos',
    abstractLabel: 'Resumen Académico',
    keySummariesLabel: 'Texto Extraído Clave / Resumen',
    finalNotesLabel: 'Notas Finales y Avisos',
    scanningOcrText: 'Escaneando Diseño, Tipografías y Tokens OCR...',
    metadataExtractingText: 'Identificando Fechas, Modalidad y Temas...',
    abstractValidatingText: 'Validando Límites de Palabras y Conclusiones...',
    synthesizingFieldsText: 'Sintetizando Campos Formateados...',
    browseLocal: 'Explorar Equipo Local',
    orTestSample: 'O pruebe de inmediato con un documento de muestra:',
    loadedBadge: 'Cargado',
    exceedsBoundaryLimit: '¡Supera el límite permitido!',
    addTheme: 'Añadir Tema',
    addPoint: 'Añadir Punto',

    themeColor: 'Tema de Color Visual',
    dayNightMode: 'Modo Día / Noche',
    lightMode: 'Día (Cristal Claro)',
    darkMode: 'Noche (Cristal Oscuro)',
    midnightMode: 'Medianoche (Cíber Neón)',
    language: 'Idioma',

    portalTitle: 'Academic Hub',
    mainHeadline: 'Elevando la Sinergia Académica y la Gobernanza de Simposios',
    subDescription: 'Academic Hub conecta la investigación avanzada con la coordinación de eventos, ofreciendo ciclos ágiles de resúmenes, métricas inteligentes y programación dinámica.',
    btnListProgram: 'Publicar Programa',
    btnBrowsePrograms: 'Explorar Programas',
    btnQuickLogin: 'Iniciar Sesión Rápido',
    roleScholar: 'Prof. Dr. (Académico)',
    roleChair: 'Prof. Elena (Presidenta de Programa)',
    roleAdmin: 'Prof. Dr. Tariq Al-Mansoor (Super Administrador)',
    titleRegister: 'Registro Maestro de Programas Académicos',
    titleAbstracts: 'Resúmenes de Investigación Curados',
    titleParser: 'Analizador de Documentos IA',
    labelWorking: 'En Progreso',
    labelDone: 'Completado',
    formName: 'Nombre del Programa',
    formDate: 'Día y Fecha',
    formTime: 'Ventana de Tiempo',
    formLocation: 'Ubicación / Sede / URL',
    formPlaceholder: 'ej. Coloquio Internacional sobre Sistemas Cuánticos',

    eventsLabel: 'Eventos',
    aiPoweredLabel: 'Potenciado por IA',
    adminModeActiveLabel: 'Modo Admin Activo',
  },

  ur: {
    appName: 'اکیڈمک اور خلاصہ مینیجر',
    appTagline: 'سیمینارز منظم کریں، تجریدی خلاصے مرتب کریں اور مصنوعی ذہانت کے ذریعے دستاویزات نکالیں۔',
    dashboard: 'ڈیش بورڈ',
    myWorks: 'میری کاوشیں',
    programs: 'پروگرامز',
    abstracts: 'خلاصہ جات',
    aiParser: 'اے آئی پارسر',
    calendar: 'کیلنڈر',
    notifications: 'اطلاعات',
    analytics: 'تجزیات',
    authorsReviewers: 'مصنفین اور مبصرین',
    settings: 'ترتیبات',
    feedbackImprovement: 'بہتری اور رائے',

    top5Upcoming: 'سرفہرست 5 آنے والے پروگرام',
    masterRegister: 'ماسٹر اکیڈمک پروگرام رجسٹر',
    totalPrograms: 'کل پروگرامز',
    approachingSoon: 'جلد آنے والا',
    onlinePrograms: 'آن لائن موڈ',
    offlinePrograms: 'آف لائن / آن سائٹ',
    newProgram: 'نیا پروگرام',
    parseDocument: 'دستاویز پارسر',

    online: 'آن لائن',
    offline: 'آف لائن',
    scheduled: 'طے شدہ',
    concluded: 'مکمل شدہ',
    imminentAlert: 'جلد آنے والا (3 دن یا کم)',

    expandDetails: 'تفصیلات دیکھیں',
    edit: 'ترمیم کریں',
    delete: 'حذف کریں',
    save: 'محفوظ کریں',
    cancel: 'منسوخ کریں',
    close: 'بند کریں',
    copyText: 'متن کاپی کریں',
    exportMarkdown: 'مارک ڈاؤن ایکسپورٹ',
    searchPlaceholder: 'پروگرام، عنوان، خلاصہ تلاش کریں...',
    filterAll: 'تمام موڈز',
    filterOnline: 'صرف آن لائن',
    filterOffline: 'صرف آف لائن',
    dateEarliest: 'پہلے سے شروع',
    dateLatest: 'تازہ ترین پہلے',

    login: 'لاگ ان کریں',
    signup: 'اکاؤنٹ بنائیں',
    logout: 'لاگ آؤٹ',
    email: 'ای میل پتہ',
    password: 'پاس ورڈ',
    confirmPassword: 'پاس ورڈ کی تصدیق کریں',
    fullName: 'پورا نام',
    institutionRole: 'ادارہ / عہدہ',
    forgotPassword: 'پاس ورڈ بھول گئے؟',
    resetPassword: 'پاس ورڈ ری سیٹ کریں',
    sendResetLink: 'ری سیٹ لنک بھیجیں',
    backToLogin: 'لاگ ان کی طرف واپس',
    dontHaveAccount: 'اکاؤنٹ نہیں ہے؟ سائن اپ کریں',
    alreadyHaveAccount: 'پہلے سے اکاؤنٹ ہے؟ لاگ ان کریں',
    demoLogin: 'ڈیمو لاگ ان',
    signedInAs: 'لاگ ان بطور',
    resetEmailSent: 'پاس ورڈ ری سیٹ لنک آپ کے ای میل پر بھیج دیا گیا ہے!',

    leaveFeedbackTitle: 'بہتری کے لیے پیغام چھوڑیں',
    leaveFeedbackDesc: 'اپنے خیالات اور تجاویز کے ساتھ پلیٹ فارم کو مزید بہتر بنانے میں مدد کریں۔',
    feedbackCategory: 'قسم',
    feedbackRating: 'تجربے کی درجہ بندی',
    feedbackMessage: 'آپ کا پیغام / تجویز',
    submitFeedback: 'پیغام بھیجیں',
    feedbackSubmitted: 'شکریہ! آپ کی رائے موصول ہو گئی ہے۔',
    uiux: 'یو آئی / ڈیزائن',
    featureRequest: 'نئی خصوصیت کی درخواست',
    bugReport: 'مسئلہ / خرابی کی اطلاع',
    generalIdea: 'عمومی بہتری',

    structuredAbstract: 'ساختی خلاصہ',
    extractedFindings: 'اہم نکات اور نتائج',
    finalNotes: 'حتمی نوٹس اور اطلاعات',
    dropDocumentHere: 'پی ڈی ایف یا تصویر دستاویز یہاں چھوڑیں',
    saveToRegistry: 'پروگرام محفوظ کریں',
    wordCount: 'الفاظ',
    charCount: 'حروف',
    programNameLabel: 'پروگرام کا نام',
    programDateLabel: 'پروگرام کا دن اور تاریخ',
    timeWindowLabel: 'وقت کا دورانیہ',
    modeLabel: 'طریقہ کار (موڈ)',
    locationPlatformLabel: 'مقام / پلیٹ فارم',
    themesTopicsLabel: 'موضوعات اور اہم نکات',
    abstractLabel: 'خلاصہ',
    keySummariesLabel: 'اہم نکات اور اخراجات',
    finalNotesLabel: 'حتمی نوٹس اور ہدایات',
    scanningOcrText: 'لے آؤٹ اور او سی آر اسکین ہو رہا ہے...',
    metadataExtractingText: 'تاریخ اور موضوعات کی شناخت...',
    abstractValidatingText: 'الفاظ کی حد کی توثیق ہو رہی ہے...',
    synthesizingFieldsText: 'فارم فیلڈز مکمل کی جا رہی ہیں...',
    browseLocal: 'کمپیوٹر سے منتخب کریں',
    orTestSample: 'یا نمونہ دستاویز سے فوری ٹیسٹ کریں:',
    loadedBadge: 'لوڈ ہو گیا',
    exceedsBoundaryLimit: 'الفاظ کی حد سے تجاوز!',
    addTheme: 'موضوع شامل کریں',
    addPoint: 'نکتہ شامل کریں',

    themeColor: 'تھیم رنگ',
    dayNightMode: 'دن / رات موڈ',
    lightMode: 'دن (لائٹ گلاس)',
    darkMode: 'رات (ڈارک گلاس)',
    midnightMode: 'مڈ نائٹ (نیین سائبر)',
    language: 'زبان',

    portalTitle: 'اکیڈمک ہب',
    mainHeadline: 'علمی ہم آہنگی اور سمپوزیم نظم و نسق کو فروغ دینا',
    subDescription: 'اکیڈمک ہب اعلیٰ تحقیق اور کانفرنس کے انعقاد کے درمیان ایک پل کا کام کرتا ہے، جو محققین کو خلاصہ جمع کرانے، ذہین میٹرکس اور متحرک شیڈولنگ فراہم کرتا ہے۔',
    btnListProgram: 'پروگرام کی فہرست بنائیں',
    btnBrowsePrograms: 'پروگرامز دیکھیں',
    btnQuickLogin: 'فوری لاگ ان / سائن اپ',
    roleScholar: 'پروفیسر ڈاکٹر (محقق)',
    roleChair: 'پروفیسر ایلینا (چیئرپرسن)',
    roleAdmin: 'پروفیسر ڈاکٹر طارق المنصور (سپر ایڈمن)',
    titleRegister: 'ماسٹر اکیڈمک پروگرام رجسٹر',
    titleAbstracts: 'منتخب تحقیقی خلاصہ جات',
    titleParser: 'اے آئی دستاویز پارسر',
    labelWorking: 'جاری ہے',
    labelDone: 'مکمل',
    formName: 'پروگرام کا نام',
    formDate: 'دن اور تاریخ',
    formTime: 'وقت کا دورانیہ',
    formLocation: 'مقام / پلیٹ فارم / لنک',
    formPlaceholder: 'مثال: کوانٹم سسٹمز پر بین الاقوامی سمپوزیم',

    eventsLabel: 'پروگرامز',
    aiPoweredLabel: 'مصنوعی ذہانت سے لیس',
    adminModeActiveLabel: 'ایڈمن موڈ فعال',
  },

  hi: {
    appName: 'अकादमिक एवं सारांश प्रबंधक',
    appTagline: 'संगोष्ठियों को व्यवस्थित करें, शोध सारांश संकलित करें और एआई द्वारा तुरंत जानकारी निकालें।',
    dashboard: 'डैशबोर्ड',
    myWorks: 'मेरी कृतियां',
    programs: 'कार्यक्रम',
    abstracts: 'शोध सारांश',
    aiParser: 'एआई पार्सर',
    calendar: 'कैलेंडर',
    notifications: 'सूचनाएं',
    analytics: 'एनालिटिक्स',
    authorsReviewers: 'लेखक एवं समीक्षक',
    settings: 'सेटिंग्स',
    feedbackImprovement: 'सुधार एवं प्रतिक्रिया',

    top5Upcoming: 'शीर्ष 5 आगामी कार्यक्रम',
    masterRegister: 'मास्टर अकादमिक कार्यक्रम रजिस्टर',
    totalPrograms: 'कुल कार्यक्रम',
    approachingSoon: 'जल्द आने वाला',
    onlinePrograms: 'ऑनलाइन मोड',
    offlinePrograms: 'ऑफलाइन / परिसर',
    newProgram: 'नया कार्यक्रम',
    parseDocument: 'दस्तावेज़ पार्सर',

    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    scheduled: 'निर्धारित',
    concluded: 'समाप्त',
    imminentAlert: 'शीघ्र आने वाला (≤ 3 दिन)',

    expandDetails: 'विवरण देखें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    copyText: 'टेक्स्ट कॉपी करें',
    exportMarkdown: 'मार्कडाउन निर्यात',
    searchPlaceholder: 'कार्यक्रम, विषय, सारांश खोजें...',
    filterAll: 'सभी मोड',
    filterOnline: 'केवल ऑनलाइन',
    filterOffline: 'केवल ऑफलाइन',
    dateEarliest: 'आरंभिक पहले',
    dateLatest: 'नवीनतम पहले',

    login: 'लॉग इन करें',
    signup: 'खाता बनाएं',
    logout: 'लॉग आउट',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    fullName: 'पूरा नाम',
    institutionRole: 'संस्थान / पद',
    forgotPassword: 'पासवर्ड भूल गए?',
    resetPassword: 'पासवर्ड रीसेट करें',
    sendResetLink: 'रीसेट लिंक भेजें',
    backToLogin: 'लॉग इन पर वापस जाएं',
    dontHaveAccount: 'खाता नहीं है? साइन अप करें',
    alreadyHaveAccount: 'पहले से खाता है? लॉग इन करें',
    demoLogin: 'डेमो लॉग इन',
    signedInAs: 'के रूप में लॉग इन',
    resetEmailSent: 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है!',

    leaveFeedbackTitle: 'सुधार के लिए संदेश छोड़ें',
    leaveFeedbackDesc: 'अपने विचारों और सुझावों से इस अकादमिक मंच को बेहतर बनाने में मदद करें।',
    feedbackCategory: 'श्रेणी',
    feedbackRating: 'अनुभव रेटिंग',
    feedbackMessage: 'आपका संदेश / सुझाव',
    submitFeedback: 'संदेश सबमिट करें',
    feedbackSubmitted: 'धन्यवाद! आपकी प्रतिक्रिया दर्ज कर ली गई है।',
    uiux: 'यूआई / यूएक्स डिज़ाइन',
    featureRequest: 'नई सुविधा का अनुरोध',
    bugReport: 'त्रुटि रिपोर्ट',
    generalIdea: 'सामान्य सुधार',

    structuredAbstract: 'संरचित सारांश',
    extractedFindings: 'मुख्य निष्कर्ष एवं बिंदु',
    finalNotes: 'अंतिम नोट्स और सूचनाएं',
    dropDocumentHere: 'पीडीएफ या छवि दस्तावेज़ यहां छोड़ें',
    saveToRegistry: 'कार्यक्रम सहेजें',
    wordCount: 'शब्द',
    charCount: 'वर्ण',
    programNameLabel: 'कार्यक्रम का नाम',
    programDateLabel: 'कार्यक्रम का दिन व दिनांक',
    timeWindowLabel: 'समय सीमा',
    modeLabel: 'मोड',
    locationPlatformLabel: 'स्थान / मंच',
    themesTopicsLabel: 'विषय और उप-विषय',
    abstractLabel: 'शोध सारांश',
    keySummariesLabel: 'महत्वपूर्ण निष्कर्ष व मुख्य सारांश',
    finalNotesLabel: 'अंतिम निर्देश व सूचनाएं',
    scanningOcrText: 'लेआउट व ओसीआर स्कैनिंग प्रगति पर...',
    metadataExtractingText: 'दिनांक, मोड व विषयों की पहचान...',
    abstractValidatingText: 'शब्द सीमा व निष्कर्षों की पुष्टि...',
    synthesizingFieldsText: 'फील्ड्स को व्यवस्थित किया जा रहा है...',
    browseLocal: 'लोकल कंप्यूटर से चुनें',
    orTestSample: 'या 1-क्लिक नमूना दस्तावेज़ से जांचें:',
    loadedBadge: 'लोड हुआ',
    exceedsBoundaryLimit: 'शब्द सीमा पार हो गई!',
    addTheme: 'विषय जोड़ें',
    addPoint: 'बिंदु जोड़ें',

    themeColor: 'थीम का रंग',
    dayNightMode: 'दिन / रात मोड',
    lightMode: 'दिन (लाइट ग्लास)',
    darkMode: 'रात (डार्क ग्लास)',
    midnightMode: 'मध्यरात्रि (साइबर ग्लो)',
    language: 'भाषा',

    portalTitle: 'एकेडेमिक हब',
    mainHeadline: 'अकादमिक तालमेल और संगोष्ठी प्रबंधन को नया आयाम',
    subDescription: 'एकेडेमिक हब उन्नत शोध और संगोष्ठी आयोजन के बीच समन्वय स्थापित करता है, शोधकर्ताओं को निर्बाध सारांश प्रविष्टि, स्मार्ट मेट्रिक्स और गतिशील शेड्यूलिंग उपकरण प्रदान करता है।',
    btnListProgram: 'कार्यक्रम सूचीबद्ध करें',
    btnBrowsePrograms: 'कार्यक्रम देखें',
    btnQuickLogin: 'त्वरित लॉगिन / साइन अप',
    roleScholar: 'प्रो. डॉ. (विद्वान / स्कॉलर)',
    roleChair: 'प्रो. एलेना (कार्यक्रम अध्यक्ष)',
    roleAdmin: 'प्रो. डॉ. तारिक अल-मंसूर (सुपर एडमिन)',
    titleRegister: 'मास्टर अकादमिक कार्यक्रम रजिस्टर',
    titleAbstracts: 'शोध सारांश संकलन',
    titleParser: 'एआई दस्तावेज़ पार्सर',
    labelWorking: 'प्रगति पर',
    labelDone: 'पूर्ण',
    formName: 'कार्यक्रम का नाम',
    formDate: 'दिन व दिनांक',
    formTime: 'समय सीमा',
    formLocation: 'स्थान / मंच / यूआरएल',
    formPlaceholder: 'उदा. क्वांटम सिस्टम पर अंतर्राष्ट्रीय संगोष्ठी',

    eventsLabel: 'कार्यक्रम',
    aiPoweredLabel: 'एआई संचालित',
    adminModeActiveLabel: 'एडमिन मोड सक्रिय',
  },

  ar: {
    appName: 'مدير البرامج والأبحاث الأكاديمية',
    appTagline: 'تنظيم الندوات والمؤتمرات وتلخيص المستندات الأكاديمية بالذكاء الاصطناعي.',
    dashboard: 'لوحة القيادة',
    myWorks: 'أعمالي المختارة',
    programs: 'البرامج',
    abstracts: 'الملخصات الأكاديمية',
    aiParser: 'محلل المستندات AI',
    calendar: 'التقويم الذكي',
    notifications: 'الإشعارات',
    analytics: 'التحليلات والإحصائيات',
    authorsReviewers: 'المؤلفون والمحكمون',
    settings: 'الإعدادات',
    feedbackImprovement: 'تحسين ومقترحات',

    top5Upcoming: 'أهم 5 برامج قادمة',
    masterRegister: 'السجل الأكاديمي الرئيسي',
    totalPrograms: 'إجمالي البرامج',
    approachingSoon: 'يقترب موعده',
    onlinePrograms: 'عبر الإنترنت',
    offlinePrograms: 'حضوري / في الموقع',
    newProgram: 'برنامج جديد',
    parseDocument: 'تحليل مستند ذكي',

    online: 'عبر الإنترنت',
    offline: 'حضوري',
    scheduled: 'مجدول',
    concluded: 'منتهي',
    imminentAlert: 'يقترب موعده (≤ 3 أيام)',

    expandDetails: 'عرض التفاصيل',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ التغييرات',
    cancel: 'إلغاء',
    close: 'إغلاق',
    copyText: 'نسخ النص',
    exportMarkdown: 'تصدير Markdown',
    searchPlaceholder: 'البحث عن البرامج، الأبحاث، القاعات...',
    filterAll: 'جميع الأنماط',
    filterOnline: 'عبر الإنترنت فقط',
    filterOffline: 'حضوري فقط',
    dateEarliest: 'الأقدم أولاً',
    dateLatest: 'الأحدث أولاً',

    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب جديد',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    institutionRole: 'المؤسسة / الصفة الأكاديمية',
    forgotPassword: 'نسيت كلمة المرور؟',
    resetPassword: 'إعادة تعيين كلمة المرور',
    sendResetLink: 'إرسال رابط الاستعادة',
    backToLogin: 'العودة لتسجيل الدخول',
    dontHaveAccount: 'ليس لديك حساب؟ سجل الآن',
    alreadyHaveAccount: 'لديك حساب بالفعل؟ سجل الدخول',
    demoLogin: 'تسجيل دخول تجريبي',
    signedInAs: 'مسجل الدخول باسم',
    resetEmailSent: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني!',

    leaveFeedbackTitle: 'اترك مقترحاً للتحسين',
    leaveFeedbackDesc: 'ساعدنا في تطوير المنصة الأكاديمية بأفكارك ومقترحاتك القيّمة.',
    feedbackCategory: 'التصنيف',
    feedbackRating: 'تقييم التجربة',
    feedbackMessage: 'رسالتك / مقترحك',
    submitFeedback: 'إرسال الرسالة',
    feedbackSubmitted: 'شكراً لك! تم استلام مقترحك بنجاح.',
    uiux: 'تصميم الواجهة UI/UX',
    featureRequest: 'طلب ميزة جديدة',
    bugReport: 'الإبلاغ عن خلل',
    generalIdea: 'تحسين عام',

    structuredAbstract: 'الملخص الهيكلي',
    extractedFindings: 'النتائج والاستنتاجات الرئيسية',
    finalNotes: 'الملاحظات والإشعارات النهائية',
    dropDocumentHere: 'اسحب وأفلت ملف PDF أو صورة هنا',
    saveToRegistry: 'حفظ في السجل الأكاديمي',
    wordCount: 'كلمة',
    charCount: 'حرف',
    programNameLabel: 'اسم البرنامج الأكاديمي',
    programDateLabel: 'اليوم والتاريخ',
    timeWindowLabel: 'الفترة الزمنية',
    modeLabel: 'النمط',
    locationPlatformLabel: 'المكان / المنصة',
    themesTopicsLabel: 'المحاور والموضوعات',
    abstractLabel: 'الملخص الأكاديمي',
    keySummariesLabel: 'أهم الاستنتاجات والنقاط المستخلصة',
    finalNotesLabel: 'ملاحظات نهائية وإشعارات',
    scanningOcrText: 'جاري مسح التصميم والرموز بالذكاء الاصطناعي...',
    metadataExtractingText: 'تحديد التواريخ، النمط، والمحاور...',
    abstractValidatingText: 'التحقق من عدد الكلمات والمخرجات...',
    synthesizingFieldsText: 'تعبئة الحقول بصورة منهجية...',
    browseLocal: 'تصفح جهاز الكمبيوتر',
    orTestSample: 'أو اختبر فوراً بمستند تجريبي بنقرة واحدة:',
    loadedBadge: 'تم التحميل',
    exceedsBoundaryLimit: 'تجاوز الحد المسموح للكلمات!',
    addTheme: 'إضافة محور',
    addPoint: 'إضافة نقطة',

    themeColor: 'السمة اللونية',
    dayNightMode: 'وضع النهار / الليل',
    lightMode: 'النهار (زجاجي مضيء)',
    darkMode: 'الليل (زجاجي داكن)',
    midnightMode: 'منتصف الليل (توهج سيبراني)',
    language: 'اللغة',

    portalTitle: 'المركز الأكاديمي',
    mainHeadline: 'الارتقاء بالتكامل الأكاديمي وإدارة الندوات والمؤتمرات',
    subDescription: 'يربط المركز الأكاديمي بين البحث العلمي المتقدم وإدارة الفعاليات، مقدماً للباحثين دورات تقديم ملخصات سلسة، ومقاييس تتبع ذكية، وأدوات جدولة مرنة.',
    btnListProgram: 'إدراج برنامج',
    btnBrowsePrograms: 'تصفح البرامج',
    btnQuickLogin: 'تسجيل دخول سريع',
    roleScholar: 'أ. د. (باحث أكاديمي)',
    roleChair: 'أ. إيلينا (رئيسة البرنامج)',
    roleAdmin: 'أ. د. طارق المنصور (المدير العام)',
    titleRegister: 'سجل البرامج الأكاديمية العام',
    titleAbstracts: 'الملخصات البحثية المحكمة',
    titleParser: 'محلل المستندات الذكي',
    labelWorking: 'قيد التنفيذ',
    labelDone: 'مكتمل',
    formName: 'اسم البرنامج',
    formDate: 'اليوم والتاريخ',
    formTime: 'الفترة الزمنية',
    formLocation: 'الموقع / القاعة / الرابط',
    formPlaceholder: 'مثال: المؤتمر الدولي لنظم الكوانتوم والحوسبة',

    eventsLabel: 'فعاليات',
    aiPoweredLabel: 'مدعوم بالذكاء الاصطناعي',
    adminModeActiveLabel: 'وضع المدير نشط',
  },

  fr: {
    appName: 'Academic Hub',
    appTagline: 'Organisez des colloques, structurez les résumés et extrayez les documents via IA.',
    dashboard: 'Tableau de bord',
    myWorks: 'Mes Travaux',
    programs: 'Programmes',
    abstracts: 'Résumés',
    aiParser: 'Analyseur IA',
    calendar: 'Calendrier',
    notifications: 'Notifications',
    analytics: 'Statistiques',
    authorsReviewers: 'Auteurs & Réviseurs',
    settings: 'Paramètres',
    feedbackImprovement: 'Améliorations & Retours',

    top5Upcoming: 'Top 5 Programmes à Venir',
    masterRegister: 'Registre Général des Programmes Académiques',
    totalPrograms: 'Total des Programmes',
    approachingSoon: 'Approche Imminente',
    onlinePrograms: 'Mode En Ligne',
    offlinePrograms: 'Sur Site / Campus',
    newProgram: 'Nouveau Programme',
    parseDocument: 'Analyseur de Document IA',

    online: 'En Ligne',
    offline: 'Sur Site',
    scheduled: 'Planifié',
    concluded: 'Terminé',
    imminentAlert: 'Imminent (≤ 3 Jours)',

    expandDetails: 'Voir Détails',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    copyText: 'Copier',
    exportMarkdown: 'Exporter .MD',
    searchPlaceholder: 'Rechercher programmes, thèmes, résumés...',
    filterAll: 'Tous les Modes',
    filterOnline: 'En Ligne Uniquement',
    filterOffline: 'Sur Site Uniquement',
    dateEarliest: 'Plus Proche',
    dateLatest: 'Plus Éloigné',

    login: 'Se Connecter',
    signup: 'Créer un Compte',
    logout: 'Se Déconnecter',
    email: 'Adresse E-mail',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer Mot de passe',
    fullName: 'Nom Complet',
    institutionRole: 'Institution / Titre',
    forgotPassword: 'Mot de passe oublié ?',
    resetPassword: 'Réinitialiser',
    sendResetLink: 'Envoyer Lien',
    backToLogin: 'Retour Connexion',
    dontHaveAccount: 'Pas de compte ? Inscrivez-vous',
    alreadyHaveAccount: 'Déjà un compte ? Connectez-vous',
    demoLogin: 'Connexion Démo',
    signedInAs: 'Connecté en tant que',
    resetEmailSent: 'Lien de réinitialisation envoyé !',

    leaveFeedbackTitle: 'Proposer une Amélioration',
    leaveFeedbackDesc: 'Aidez-nous à perfectionner la plateforme académique.',
    feedbackCategory: 'Catégorie',
    feedbackRating: 'Note Expérience',
    feedbackMessage: 'Votre Message / Suggestion',
    submitFeedback: 'Envoyer Message',
    feedbackSubmitted: 'Merci ! Votre retour a bien été enregistré.',
    uiux: 'Design UI / UX',
    featureRequest: 'Nouvelle Fonctionnalité',
    bugReport: 'Signaler un Bug',
    generalIdea: 'Amélioration Générale',

    structuredAbstract: 'Résumé Structuré',
    extractedFindings: 'Points Clés et Découvertes Extraites',
    finalNotes: 'Notes Finales et Notifications',
    dropDocumentHere: 'Glissez-déposez le PDF ou l’Image ici',
    saveToRegistry: 'Enregistrer dans les Programmes Académiques',
    wordCount: 'mots',
    charCount: 'caractères',
    programNameLabel: 'Nom du Programme',
    programDateLabel: 'Jour et Date du Programme',
    timeWindowLabel: 'Créneau Horaire',
    modeLabel: 'Mode',
    locationPlatformLabel: 'Lieu / Plateforme',
    themesTopicsLabel: 'Thématiques & Sujets',
    abstractLabel: 'Résumé Académique',
    keySummariesLabel: 'Texte Extrait Important / Synthèses',
    finalNotesLabel: 'Notes Finales & Consignes',
    scanningOcrText: 'Numérisation du document et analyse OCR...',
    metadataExtractingText: 'Identification des dates, du mode et des thèmes...',
    abstractValidatingText: 'Validation des limites de mots et conclusions...',
    synthesizingFieldsText: 'Génération des champs structurés...',
    browseLocal: 'Parcourir les Fichiers',
    orTestSample: 'Ou testez immédiatement avec un document échantillon :',
    loadedBadge: 'Chargé',
    exceedsBoundaryLimit: 'Dépasse la limite autorisée !',
    addTheme: 'Ajouter Thème',
    addPoint: 'Ajouter Point',

    themeColor: 'Thème Visuel',
    dayNightMode: 'Mode Jour / Nuit',
    lightMode: 'Jour (Verre Clair)',
    darkMode: 'Nuit (Verre Sombre)',
    midnightMode: 'Minuit (Cyber Néon)',
    language: 'Langue',

    portalTitle: 'Academic Hub',
    mainHeadline: 'Élever la Synergie Académique et la Gouvernance des Colloques',
    subDescription: 'Academic Hub fait le pont entre la recherche de pointe et la gestion d’événements, offrant aux chercheurs des soumissions fluides de résumés, des métriques intelligentes et des calendriers dynamiques.',
    btnListProgram: 'Publier un Programme',
    btnBrowsePrograms: 'Explorer les Programmes',
    btnQuickLogin: 'Connexion Rapide',
    roleScholar: 'Prof. Dr. (Chercheur)',
    roleChair: 'Prof. Elena (Présidente de Session)',
    roleAdmin: 'Prof. Dr. Tariq Al-Mansoor (Super Administrateur)',
    titleRegister: 'Registre Général des Programmes Académiques',
    titleAbstracts: 'Résumés de Recherche Validés',
    titleParser: 'Analyseur Intelligent de Documents IA',
    labelWorking: 'En cours',
    labelDone: 'Terminé',
    formName: 'Nom du Programme',
    formDate: 'Jour et Date',
    formTime: 'Créneau Horaire',
    formLocation: 'Lieu / Salle / Lien',
    formPlaceholder: 'ex. Colloque International sur les Systèmes Quantiques',

    eventsLabel: 'Événements',
    aiPoweredLabel: 'Propulsé par IA',
    adminModeActiveLabel: 'Mode Admin Actif',
  },

  de: {
    appName: 'Academic Hub',
    appTagline: 'Symposien organisieren, Abstracts kuratieren und Dokumente mit KI extrahieren.',
    dashboard: 'Dashboard',
    myWorks: 'Meine Arbeiten',
    programs: 'Programme',
    abstracts: 'Abstracts',
    aiParser: 'KI-Parser',
    calendar: 'Kalender',
    notifications: 'Benachrichtigungen',
    analytics: 'Analysen',
    authorsReviewers: 'Autoren & Gutachter',
    settings: 'Einstellungen',
    feedbackImprovement: 'Feedback & Vorschläge',

    top5Upcoming: 'Top 5 Bevorstehende Programme',
    masterRegister: 'Hauptregister für Akademische Programme',
    totalPrograms: 'Gesamtprogramme',
    approachingSoon: 'Demnächst Beginnen',
    onlinePrograms: 'Online-Modus',
    offlinePrograms: 'Präsenz / Vor Ort',
    newProgram: 'Neues Programm',
    parseDocument: 'KI-Dokumenten-Parser',

    online: 'Online',
    offline: 'Präsenz',
    scheduled: 'Geplant',
    concluded: 'Abgeschlossen',
    imminentAlert: 'Bevorstehend (≤ 3 Tage)',

    expandDetails: 'Details anzeigen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    close: 'Schließen',
    copyText: 'Kopieren',
    exportMarkdown: 'Exportieren (.MD)',
    searchPlaceholder: 'Programme, Themen, Abstracts suchen...',
    filterAll: 'Alle Modi',
    filterOnline: 'Nur Online',
    filterOffline: 'Nur Präsenz',
    dateEarliest: 'Früheste zuerst',
    dateLatest: 'Neueste zuerst',

    login: 'Anmelden',
    signup: 'Konto erstellen',
    logout: 'Abmelden',
    email: 'E-Mail-Adresse',
    password: 'Passwort',
    confirmPassword: 'Passwort bestätigen',
    fullName: 'Vollständiger Name',
    institutionRole: 'Institution / Funktion',
    forgotPassword: 'Passwort vergessen?',
    resetPassword: 'Passwort zurücksetzen',
    sendResetLink: 'Link senden',
    backToLogin: 'Zurück zur Anmeldung',
    dontHaveAccount: 'Kein Konto? Jetzt registrieren',
    alreadyHaveAccount: 'Bereits registriert? Anmelden',
    demoLogin: 'Schnell-Demo-Login',
    signedInAs: 'Angemeldet als',
    resetEmailSent: 'Link zum Zurücksetzen gesendet!',

    leaveFeedbackTitle: 'Verbesserung vorschlagen',
    leaveFeedbackDesc: 'Helfen Sie uns, die akademische Plattform zu optimieren.',
    feedbackCategory: 'Kategorie',
    feedbackRating: 'Bewertung',
    feedbackMessage: 'Ihre Nachricht / Empfehlung',
    submitFeedback: 'Nachricht senden',
    feedbackSubmitted: 'Vielen Dank! Ihr Feedback wurde gespeichert.',
    uiux: 'UI / UX Design',
    featureRequest: 'Funktionsanfrage',
    bugReport: 'Fehlerbericht',
    generalIdea: 'Allgemeine Verbesserung',

    structuredAbstract: 'Strukturiertes Abstract',
    extractedFindings: 'Wichtigste Erkenntnisse & Extrahierte Punkte',
    finalNotes: 'Abschließende Hinweise & Mitteilungen',
    dropDocumentHere: 'PDF oder Bilddokument hierher ziehen',
    saveToRegistry: 'In Akademische Programme speichern',
    wordCount: 'Wörter',
    charCount: 'Zeichen',
    programNameLabel: 'Programmname',
    programDateLabel: 'Tag und Datum des Programms',
    timeWindowLabel: 'Zeitfenster',
    modeLabel: 'Modus',
    locationPlatformLabel: 'Ort / Plattform',
    themesTopicsLabel: 'Themen & Schwerpunkte',
    abstractLabel: 'Akademisches Abstract',
    keySummariesLabel: 'Wichtiger Extrahierter Text / Kernaussagen',
    finalNotesLabel: 'Abschließende Notizen & Hinweise',
    scanningOcrText: 'Dokumentenlayout und OCR-Zeichen werden gescannt...',
    metadataExtractingText: 'Termine, Modus und Themen werden ermittelt...',
    abstractValidatingText: 'Wortgrenzen und Kernaussagen werden geprüft...',
    synthesizingFieldsText: 'Formatierte Felder werden generiert...',
    browseLocal: 'Auf Computer durchsuchen',
    orTestSample: 'Oder sofort mit einem Beispieldokument testen:',
    loadedBadge: 'Geladen',
    exceedsBoundaryLimit: 'Überschreitet Wortgrenze!',
    addTheme: 'Thema hinzufügen',
    addPoint: 'Punkt hinzufügen',

    themeColor: 'Farbschema',
    dayNightMode: 'Tag / Nacht Modus',
    lightMode: 'Tag (Helles Glas)',
    darkMode: 'Nacht (Dunkles Glas)',
    midnightMode: 'Mitternacht (Cyber Neon)',
    language: 'Sprache',

    portalTitle: 'Academic Hub',
    mainHeadline: 'Wissenschaftliche Synergien und Tagungsmanagement auf neuem Niveau',
    subDescription: 'Academic Hub verbindet Spitzenforschung mit professioneller Veranstaltungsorganisation durch nahtlose Abstract-Einreichung, intelligente Metriken und flexible Terminplanung.',
    btnListProgram: 'Programm veröffentlichen',
    btnBrowsePrograms: 'Programme durchsuchen',
    btnQuickLogin: 'Schnell-Login / Registrierung',
    roleScholar: 'Prof. Dr. (Wissenschaftler)',
    roleChair: 'Prof. Elena (Tagungsvorsitzende)',
    roleAdmin: 'Prof. Dr. Tariq Al-Mansoor (Super-Administrator)',
    titleRegister: 'Hauptregister Akademischer Programme',
    titleAbstracts: 'Kuratierte Forschungs-Abstracts',
    titleParser: 'Intelligenter KI-Dokumenten-Parser',
    labelWorking: 'In Bearbeitung',
    labelDone: 'Abgeschlossen',
    formName: 'Programmname',
    formDate: 'Tag & Datum',
    formTime: 'Zeitfenster',
    formLocation: 'Ort / Hörsaal / Link',
    formPlaceholder: 'z.B. Internationales Kolloquium über Quantensysteme',

    eventsLabel: 'Veranstaltungen',
    aiPoweredLabel: 'KI-Gestützt',
    adminModeActiveLabel: 'Admin-Modus Aktiv',
  }
};
