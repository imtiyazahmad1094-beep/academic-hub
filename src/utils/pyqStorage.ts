import { DhiuQuestionPaper, DhiuSubjectName } from '../types';
import { getDhiuQuestionPapers, getDhiuClass10VivaPapers } from '../data/dhiuPyqData';

const STORAGE_KEY = 'dhiu_custom_pyq_papers_v1';

// Retrieve all custom uploaded papers from local storage
export function getCustomPyqPapers(): DhiuQuestionPaper[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading custom PYQ papers from localStorage:', e);
    return [];
  }
}

// Save a newly uploaded or edited PYQ paper
export function saveCustomPyqPaper(paper: DhiuQuestionPaper): DhiuQuestionPaper[] {
  try {
    const current = getCustomPyqPapers();
    // Remove if existing with same id
    const filtered = current.filter(p => p.id !== paper.id);
    const updated = [paper, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving custom PYQ paper to localStorage:', e);
    return [];
  }
}

// Delete a custom uploaded paper
export function deleteCustomPyqPaper(id: string): DhiuQuestionPaper[] {
  try {
    const current = getCustomPyqPapers();
    const updated = current.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error deleting custom PYQ paper:', e);
    return [];
  }
}

// Get combined papers for a specific class, semester, and subject
export function getCombinedPyqPapers(
  classId: number,
  semesterId: number,
  subject: DhiuSubjectName
): DhiuQuestionPaper[] {
  const custom = getCustomPyqPapers().filter(
    p => p.classId === classId && p.semesterId === semesterId && p.subject === subject
  );

  let base: DhiuQuestionPaper[] = [];
  // For Aqeeda, base is empty initially so the empty state and uploaded papers stand out clearly
  if (subject !== 'Aqeeda') {
    base = getDhiuQuestionPapers(classId, semesterId, subject);
  }

  // Combine custom papers with base, removing any duplicate ids, and sort descending by year
  const customIds = new Set(custom.map(p => p.id));
  const baseFiltered = base.filter(p => !customIds.has(p.id));
  const combined = [...custom, ...baseFiltered];

  return combined.sort((a, b) => b.year - a.year);
}

// Get combined Viva Voce papers for Class 10
export function getCombinedVivaPapers(): DhiuQuestionPaper[] {
  const custom = getCustomPyqPapers().filter(
    p => p.classId === 10 && (p.isViva || p.subject === 'Viva Voce' || p.semesterId === 3)
  );

  const base = getDhiuClass10VivaPapers();
  const customIds = new Set(custom.map(p => p.id));
  const baseFiltered = base.filter(p => !customIds.has(p.id));
  const combined = [...custom, ...baseFiltered];

  return combined.sort((a, b) => b.year - a.year);
}

// Get accurate paper counts across all subjects
export function getSubjectPaperCount(subject: DhiuSubjectName): number {
  const custom = getCustomPyqPapers().filter(p => p.subject === subject);
  if (subject === 'Aqeeda') {
    return custom.length;
  }
  // Standard base subject count (25 base years * 2 semesters) + custom
  return 50 + custom.length;
}

export interface VivaResourceLink {
  id: string;
  title: string;
  url: string;
  category?: string;
  createdAt: number;
}

const RESOURCE_LINKS_KEY = 'dhiu_viva_resource_links_v1';

const DEFAULT_VIVA_LINKS: VivaResourceLink[] = [
  {
    id: 'link-default-1',
    title: 'DHIU External Board Interview Guidelines',
    url: 'https://dhiu.edu.eg',
    category: 'Official Board Portal',
    createdAt: 1700000000000
  },
  {
    id: 'link-default-2',
    title: 'Central Oral Examination Evaluation Standards',
    url: 'https://dhiu.edu.eg',
    category: 'Assessment Rubrics',
    createdAt: 1700000001000
  },
  {
    id: 'link-default-3',
    title: 'Darul Huda Live Oral Exam & Game Arena',
    url: 'https://dhiu.edu.eg',
    category: 'Live Interactive Channel',
    createdAt: 1700000002000
  }
];

export function getVivaResourceLinks(): VivaResourceLink[] {
  try {
    const raw = localStorage.getItem(RESOURCE_LINKS_KEY);
    if (!raw) {
      localStorage.setItem(RESOURCE_LINKS_KEY, JSON.stringify(DEFAULT_VIVA_LINKS));
      return DEFAULT_VIVA_LINKS;
    }
    let parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Normalize default item 3 title if present
      parsed = parsed.map((item: VivaResourceLink) => {
        if (item.title === 'Darul Huda Live Oral Exam & Game Channel') {
          return { ...item, title: 'Darul Huda Live Oral Exam & Game Arena' };
        }
        return item;
      });
      return parsed;
    }
    return DEFAULT_VIVA_LINKS;
  } catch (e) {
    console.error('Error reading viva resource links:', e);
    return DEFAULT_VIVA_LINKS;
  }
}

export function saveVivaResourceLink(link: Omit<VivaResourceLink, 'id' | 'createdAt'> & { id?: string }): VivaResourceLink[] {
  try {
    const current = getVivaResourceLinks();
    const newLink: VivaResourceLink = {
      id: link.id || `custom-link-${Date.now()}`,
      title: link.title,
      url: link.url.startsWith('http') ? link.url : `https://${link.url}`,
      category: link.category || 'External Web Resource',
      createdAt: Date.now()
    };
    const updated = [newLink, ...current.filter(l => l.id !== newLink.id)];
    localStorage.setItem(RESOURCE_LINKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving viva resource link:', e);
    return DEFAULT_VIVA_LINKS;
  }
}

