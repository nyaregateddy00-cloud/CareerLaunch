export interface CareerPhotoSource {
  /** Local WebP asset basename in public/assets/career (without width or extension). */
  asset: string;
  alt: string;
}

export const careerPhotos = {
  nigeriaProfessional: {
    asset: 'career-hero-lagos',
    alt: 'A professional woman reviewing her laptop in Lagos, Nigeria.',
  },
  southAfricaRemoteWork: {
    asset: 'career-remote-professional',
    alt: 'A professional working at a laptop in a home workspace.',
  },
  kenyaDigitalLearning: {
    asset: 'career-student-collaboration',
    alt: 'A diverse group of students collaborating around a laptop.',
  },
  womenInTechnology: {
    asset: 'career-team-lagos',
    alt: 'Colleagues reviewing code together at a laptop in a Lagos workspace.',
  },
  africanTechTeam: {
    asset: 'career-team-lagos',
    alt: 'Colleagues reviewing code together at a laptop in a Lagos workspace.',
  },
  graduateSuccess: {
    asset: 'career-remote-professional',
    alt: 'A professional working at a laptop in a home workspace.',
  },
  creativeFreelancer: {
    asset: 'career-coding-yaba',
    alt: 'A developer working at a laptop in Yaba, Lagos.',
  },
  universityCollaboration: {
    asset: 'career-student-collaboration',
    alt: 'A diverse group of students collaborating around a laptop.',
  },
} satisfies Record<string, CareerPhotoSource>;
