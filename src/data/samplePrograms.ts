import { AcademicProgram } from '../types';

export const INITIAL_PROGRAMS: AcademicProgram[] = [
  {
    id: 'prog-islamic-ai',
    name: 'AI Ethics in Islamic Jurisprudence',
    date: '2026-09-20', // Sun, Sep 20, 2026
    dayOfWeek: 'Sunday',
    time: '10:00 AM - 04:00 PM EST',
    submissionDeadline: 'Sat, Sep 12, 2026',
    formatType: 'Webinar',
    mode: 'Online',
    location: 'Zoom Webinar',
    themes: ['AI Ethics', 'Fiqh', 'Technology'],
    abstract: 'This international academic webinar investigates the intersection of artificial intelligence governance, automated legal reasoning, and classical Islamic jurisprudence (fiqh). Key discussions address algorithmic accountability, moral agency in autonomous systems, data privacy principles, and maqasid al-shariah (higher objectives of Islamic law) as an ethical framework for global AI policy.',
    maxAbstractWords: 250,
    extractedSummary: [
      'Evaluation of algorithmic fatwa generative models and epistemic reliability.',
      'Applying Maqasid al-Shariah principles to autonomous system liability and user harm mitigation.',
      'International consensus drafting for faith-grounded AI governance benchmarks.'
    ],
    finalNotes: 'Zoom credentials and interactive whiteboard links will be dispatched 24 hours prior to the keynote.',
    organizerOrChair: 'Centre for Digital Fiqh',
    registrationUrl: 'https://digitalfiqh.org/ai-ethics-2026',
    documentSource: 'AI_Ethics_Islamic_Jurisprudence_Call.pdf',
    createdAt: '2026-09-08T10:00:00Z',
    colorTheme: 'blue'
  },
  {
    id: 'prog-1',
    name: 'International Quantum Computing & Neural Algorithms Symposium',
    date: '2026-09-19', // Tomorrow (Approaching -> Blinking Red)
    dayOfWeek: 'Saturday',
    time: '09:00 AM - 05:30 PM EST',
    submissionDeadline: 'Fri, Sep 11, 2026',
    formatType: 'Symposium',
    mode: 'Online',
    location: 'Virtual Auditorium Alpha & Discord Stage',
    themes: ['Quantum ML', 'Fault-Tolerant Qubits', 'Neural Superposition'],
    abstract: 'Recent breakthroughs in topological qubit error suppression have unlocked hybrid quantum-classical heuristics for ultra-high-dimensional tensor contraction. This symposium convenes global theorists and software engineers to investigate quantum variational eigensolvers (VQE), decoherence mitigation techniques, and benchmark evaluations on NISQ hardware architectures.',
    maxAbstractWords: 300,
    extractedSummary: [
      'Topological qubit error suppression yields 40% fidelity improvement on 128-qubit lattice benchmarks.',
      'Hybrid VQE models demonstrating quadratic convergence speedups in quantum chemistry simulations.',
      'Keynote spotlight by Prof. Aris Thorne on multi-node fault-tolerant superconducting networks.'
    ],
    finalNotes: 'Paper submission deadline closed. Registered attendees can access virtual breakout nodes and Jupyter notebook repositories via Slack workspace #qc-symposium-2026.',
    organizerOrChair: 'Prof. Elena Rostova & Dr. Nathan Chen',
    registrationUrl: 'https://quantum-symposium2026.edu/live',
    documentSource: 'Quantum_Symposium_Call_For_Abstracts.pdf',
    createdAt: '2026-09-10T10:00:00Z',
    colorTheme: 'blue'
  },
  {
    id: 'prog-2',
    name: 'Global Bioethics, CRISPR-Cas14 & Gene Editing Summit',
    date: '2026-09-20', // In 2 days (Approaching -> Blinking Red)
    dayOfWeek: 'Sunday',
    time: '10:00 AM - 06:00 PM CET',
    submissionDeadline: 'Thu, Sep 10, 2026',
    formatType: 'Summit',
    mode: 'Offline',
    location: 'Geneva Bio-Innovation Hub, Hall B, Switzerland',
    themes: ['CRISPR Off-Target Control', 'Epigenetic Therapeutics', 'Global Bio-Governance'],
    abstract: 'As precision gene therapy progresses into somatic in vivo trials, international regulatory harmonization and bioethical safety protocols remain paramount. This summit examines high-fidelity endonuclease targeting mechanisms, Cas14 structural biology, synthetic guide RNA optimizations, and equitable global access frameworks for life-saving genetic interventions.',
    maxAbstractWords: 250,
    extractedSummary: [
      'Comprehensive review of Cas14 ribonucleoprotein complexes for single-base epigenetic modulation.',
      'Protocol guidelines drafted by the WHO Bioethics Advisory Council for germline edit moratoriums.',
      'Live wet-lab demonstration of automated microfluidic electroporation pipelines.'
    ],
    finalNotes: 'Physical ID verification required at security gate. Poster session takes place in Garden Gallery from 03:30 PM.',
    organizerOrChair: 'Dr. Marcus Vance (Institute for Molecular Medicine)',
    registrationUrl: 'https://geneva-bioethics-summit.org/passes',
    documentSource: 'CRISPR_Ethics_Briefing_2026.pdf',
    createdAt: '2026-09-08T14:30:00Z',
    colorTheme: 'mint'
  },
  {
    id: 'prog-3',
    name: 'Next-Gen AI in Pedagogy & Cognitive Learning Systems Workshop',
    date: '2026-09-21', // In 3 days (Approaching -> Blinking Red)
    dayOfWeek: 'Monday',
    time: '01:00 PM - 07:00 PM BST',
    mode: 'Online',
    location: 'Cambridge Virtual Learning Matrix (Zoom Room 8)',
    themes: ['Adaptive Tutoring', 'Cognitive Load Modeling', 'Multi-Modal Pedagogy'],
    abstract: 'This hands-on workshop evaluates adaptive dialogue systems and multi-modal attention architectures deployed across K-12 and tertiary STEM classrooms. Participants explore real-time knowledge-tracing models, metacognitive scaffolding prompts, and ethical guardrails against algorithmic bias in automated diagnostic assessments.',
    maxAbstractWords: 300,
    extractedSummary: [
      'Demonstrated 28% increase in conceptual retention utilizing real-time Bayesian knowledge tracing.',
      'Open-source pedagogical prompt evaluation suite released for university instructors.',
      'Interactive breakout sessions building custom formative rubric generators.'
    ],
    finalNotes: 'Prerequisite setup: Python 3.11 with PyTorch or JAX environment for the afternoon collaborative hackathon.',
    organizerOrChair: 'Dr. Sarah Lin (EdTech Research Lab)',
    registrationUrl: 'https://cambridge-ai-pedagogy.ac.uk/register',
    documentSource: 'AI_Pedagogy_Workshop_Guide.png',
    createdAt: '2026-09-12T09:15:00Z',
    colorTheme: 'yellow'
  },
  {
    id: 'prog-4',
    name: 'Sustainable Clean Energy & Perovskite Photovoltaics Colloquium',
    date: '2026-09-25', // In 7 days (Upcoming -> Normal pastel theme)
    dayOfWeek: 'Friday',
    time: '08:30 AM - 04:30 PM PST',
    mode: 'Offline',
    location: 'Stanford Energy Institute, Kresge Auditorium, CA',
    themes: ['Tandem Solar Cells', 'Halide Degradation Mitigation', 'Grid-Scale Storage'],
    abstract: 'Perovskite-silicon tandem solar cells have recently exceeded 34% certified power conversion efficiency in laboratory cells. This colloquium investigates scalable slot-die coating manufacturing, moisture-impermeable 2D/3D capping layers, and life-cycle carbon accounting for utility-scale renewable generation deployments.',
    maxAbstractWords: 300,
    extractedSummary: [
      'Industrial slot-die roll-to-roll perovskite synthesis achieving 98.4% layer homogeneity.',
      'Accelerated aging tests demonstrating >25-year operational stability in humid climates.',
      'Roundtable on venture funding and Department of Energy grant allocations.'
    ],
    finalNotes: 'Parking permits will be emailed 48 hours prior to the event. Networking cocktail reception follows at 05:00 PM.',
    organizerOrChair: 'Prof. Julian Alvarez & Dr. Maya Patel',
    registrationUrl: 'https://energy.stanford.edu/colloquium-2026',
    documentSource: 'Perovskite_Clean_Energy_Abstract.pdf',
    createdAt: '2026-09-05T11:20:00Z',
    colorTheme: 'mint'
  },
  {
    id: 'prog-5',
    name: 'International Conference on Autonomous Robotics & Swarm Intelligence',
    date: '2026-10-02', // In 14 days (Upcoming -> Normal pastel theme)
    dayOfWeek: 'Friday',
    time: '09:00 AM - 06:00 PM JST',
    mode: 'Offline',
    location: 'Tokyo International Forum, Hall C, Japan',
    themes: ['Decentralized Swarms', 'Visual SLAM', 'Aerial Coordination'],
    abstract: 'Decentralized multi-agent robotic systems enable robust disaster response, planetary exploration, and ecological monitoring. This flagship conference features peer-reviewed papers on asynchronous consensus protocols, bio-inspired flocking dynamics, obstacle-avoidance graph neural networks, and edge neuromorphic vision chips.',
    maxAbstractWords: 350,
    extractedSummary: [
      'Sub-millisecond visual-inertial odometry on micro-UAVs using neuromorphic event cameras.',
      'Decentralized Voronoi coverage optimization for search-and-rescue quadrotor swarms.',
      'Live arena demonstration with 50 autonomous micro-rovers navigating rugged obstacle terrain.'
    ],
    finalNotes: 'Translation audio headsets (Japanese/English) available at the lobby check-in desk.',
    organizerOrChair: 'Prof. Kenji Takahashi (Tokyo Robotics Society)',
    registrationUrl: 'https://ic-swarm-robotics.org/tokyo2026',
    documentSource: 'Robotics_Swarm_CFP.pdf',
    createdAt: '2026-09-01T08:00:00Z',
    colorTheme: 'purple'
  },
  {
    id: 'prog-6',
    name: 'Advanced Computational Linguistics & LLM Reasoning Frontiers',
    date: '2026-10-14', // Upcoming
    dayOfWeek: 'Wednesday',
    time: '11:00 AM - 05:00 PM EST',
    mode: 'Online',
    location: 'Virtual Global Stream & Live Q&A Portal',
    themes: ['Chain-of-Thought Verification', 'Mechanistic Interpretability', 'Neurosymbolic AI'],
    abstract: 'An in-depth exploration of transformer attention circuit discovery, internal belief representation probes, and test-time search algorithms for formal mathematical proofs and symbolic logic solvers.',
    maxAbstractWords: 250,
    extractedSummary: [
      'Mechanistic probing of induction heads across deep residual stream layers.',
      'Automated theorem proving integration via Lean 4 interactive proof assistant.',
      'Safety alignment benchmarks evaluating out-of-distribution reasoning faithfulness.'
    ],
    finalNotes: 'Recording and annotated slide decks will be distributed to all registered academic attendees.',
    organizerOrChair: 'Dr. Clara Beauchamp (NLP Open Alliance)',
    registrationUrl: 'https://frontiers-computational-ling.org',
    documentSource: 'Computational_Linguistics_Abstract.pdf',
    createdAt: '2026-09-02T16:00:00Z',
    colorTheme: 'blue'
  },
  {
    id: 'prog-7',
    name: 'Symposium on Neuroscience of Working Memory & Synaptic Plasticity',
    date: '2026-09-10', // Expired / Past (Solid Red)
    dayOfWeek: 'Thursday',
    time: '09:00 AM - 04:00 PM EST',
    mode: 'Offline',
    location: 'Boston Brain Institute, Amphitheater 3, MA',
    themes: ['Prefrontal Microcircuits', 'Long-Term Potentiation', 'Optogenetics'],
    abstract: 'This closed symposium brought together neurobiologists and computational neuroscientists to discuss two-photon calcium imaging of dendritic spines during active delayed-response spatial working memory tasks in murine models.',
    maxAbstractWords: 200,
    extractedSummary: [
      'Optogenetic silencing of parvalbumin-positive interneurons disrupted memory consolidation by 65%.',
      'Computational modeling of persistent attractor states in layer 2/3 cortical networks.',
      'Conference proceedings archived in the Boston Neuroscience Open Access Repository.'
    ],
    finalNotes: 'Event concluded. Post-symposium survey and archived video recordings are now accessible in the attendee portal.',
    organizerOrChair: 'Prof. David K. Sterling',
    registrationUrl: 'https://boston-brain-symposium.org/archive',
    documentSource: 'Neuroscience_Plasticity_Report.pdf',
    createdAt: '2026-08-20T10:00:00Z',
    colorTheme: 'rose'
  },
  {
    id: 'prog-8',
    name: 'Workshop on Deep Sea Oceanography & Benthic Hydrothermal Vents',
    date: '2026-08-28', // Expired / Past (Solid Red)
    dayOfWeek: 'Friday',
    time: '10:00 AM - 03:30 PM PST',
    mode: 'Online',
    location: 'Oceanic Research Network (Webinar Hub)',
    themes: ['Chemosynthetic Ecosystems', 'Abyssal Geochemistry', 'Submersible ROVs'],
    abstract: 'Examined metagenomic sequencing of extremophile archaea sampled at 4,000 meters depth in the Mariana Trench, focusing on metabolic sulfur-oxidation pathways under extreme barometric pressure.',
    maxAbstractWords: 220,
    extractedSummary: [
      'Identification of 14 novel thermophilic bacterial strains exhibiting heat shock resistance up to 121°C.',
      'Autonomous benthic rover teleoperation telemetry analysis during 45-day continuous submersion.',
      'Policy recommendations for high-seas marine protected area demarcations.'
    ],
    finalNotes: 'Completed program. Dataset published to Pangaea Ocean Data repository.',
    organizerOrChair: 'Dr. Rebecca Fontaine',
    registrationUrl: 'https://deepsea-oceanography-2026.net/archive',
    documentSource: 'Benthic_Vents_Abstract_Summary.png',
    createdAt: '2026-08-15T12:00:00Z',
    colorTheme: 'blue'
  }
];

export const SAMPLE_PARSE_PRESETS = [
  {
    id: 'preset-quantum',
    name: 'Quantum Optics & Entanglement Call For Papers (PDF)',
    fileName: 'Quantum_Optics_CFP_2026.pdf',
    fileType: 'pdf' as const,
    fileSize: '1.8 MB',
    extractedData: {
      programName: 'International Conference on Quantum Optics & Non-Linear Metrology',
      date: '2026-09-28',
      dayOfWeek: 'Monday',
      time: '09:30 AM - 05:00 PM CET',
      mode: 'Offline' as const,
      location: 'Max Planck Institute for Quantum Optics, Munich, Germany',
      themes: ['Squeezed Light', 'Continuous Variable Entanglement', 'Atomic Clocks'],
      abstract: 'High-precision optical atomic clocks and squeezed states of light are redefining fundamental limits of measurement in gravitational wave astronomy and relativistic geodesy. This international conference brings together experimentalists to explore cavity quantum electrodynamics, photon-number-resolving superconducting detectors, and scalable quantum repeaters for intercontinental entanglement distribution.',
      extractedSummary: [
        'Squeezed vacuum injection achieved a 6.2 dB noise reduction below the standard quantum limit.',
        'Strontium optical lattice clock demonstrated fractional frequency inaccuracy below 1x10^-18.',
        'Keynote session by Nobel laureate Dr. Hans Vogel on macroscopic quantum superposition.'
      ],
      finalNotes: 'Full paper camera-ready copy due by September 24, 2026. Travel stipends available for doctoral researchers.'
    }
  },
  {
    id: 'preset-climate',
    name: 'Global Climate Modeling & Cryosphere Analysis (Image/Scan)',
    fileName: 'Cryosphere_Climate_Forum_Scan.png',
    fileType: 'image' as const,
    fileSize: '3.4 MB',
    extractedData: {
      programName: 'Symposium on Polar Cryosphere Dynamics & Global Sea-Level Projection',
      date: '2026-09-20', // Approaching soon
      dayOfWeek: 'Sunday',
      time: '10:00 AM - 04:30 PM UTC',
      mode: 'Online' as const,
      location: 'Virtual Climate Matrix / Antarctic Research Hub',
      themes: ['Ice Sheet Instability', 'Satellite Radar Altimetry', 'Ocean-Thermal Coupling'],
      abstract: 'Sub-shelf basal melting of West Antarctic ice shelves presents critical tipping-point risks for 21st-century coastal infrastructure. This virtual symposium evaluates coupled ice-ocean numerical models, ICESat-2 laser altimetry time series, and stochastic parameterization of grounding line retreat under varying IPCC radiative forcing pathways.',
      extractedSummary: [
        'Coupled GCM simulations project accelerated Thwaites Glacier grounding line retreat over the next decade.',
        'High-resolution satellite interferometry reveals tidal modulation of subglacial water routing.',
        'Working group drafting the 2026 Cryosphere Action Consensus Statement for COP31.'
      ],
      finalNotes: 'Interactive GIS portal access will be granted to all participants. Poster sessions hosted in SpatialChat room #glacier-2.'
    }
  },
  {
    id: 'preset-neural',
    name: 'Computational Neuroscience & Brain-Computer Interfaces (PDF)',
    fileName: 'BCI_Neural_Engineering_Brief.pdf',
    fileType: 'pdf' as const,
    fileSize: '2.1 MB',
    extractedData: {
      programName: 'Summit on High-Bandwidth Neural Interfaces & Intracortical Decoding',
      date: '2026-10-08',
      dayOfWeek: 'Thursday',
      time: '08:30 AM - 06:00 PM PST',
      mode: 'Online' as const,
      location: 'Silicon Valley Neurotech Forum & Zoom Stream 1',
      themes: ['Flexible Electrode Arrays', 'Spike Sorting AI', 'Restorative Neuroprosthetics'],
      abstract: 'Direct neural interfaces bridging biological motor cortex circuits with external robotic limbs and synthetic speech synthesizers have achieved unprecedented decoding accuracy. This summit analyzes ultra-flexible 10,000-channel microelectrode arrays, wireless power telemetry, and low-latency transformer decoders for paralyzed patients.',
      extractedSummary: [
        'Real-time phoneme decoding achieves 94% conversational accuracy at 120 words per minute.',
        'Biocompatible polymer substrate reduces chronic foreign body response by 75% at 12 months.',
        'Panel debate on neuro-data privacy rights and commercial BCI ethical charters.'
      ],
      finalNotes: 'Demo session at 03:00 PM featuring live non-human primate motor decoding playback. FDA regulatory liaison present.'
    }
  }
];
