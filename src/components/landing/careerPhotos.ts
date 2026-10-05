export interface CareerPhotoSource {
  imageId: string;
  alt: string;
}

export const careerPhotos = {
  nigeriaProfessional: {
    imageId: 'photo-1622554129902-bb01970e2540',
    alt: 'A Nigerian professional working at a computer in a shared workspace.',
  },
  southAfricaRemoteWork: {
    imageId: 'photo-1683534239440-3b741f48a7ea',
    alt: 'A young South African woman working at her laptop from home.',
  },
  kenyaDigitalLearning: {
    imageId: 'photo-1771935250558-48b750022c95',
    alt: 'Two people learning and working together on laptops in Nairobi.',
  },
  womenInTechnology: {
    imageId: 'photo-1573164713988-8665fc963095',
    alt: 'A Black woman working on a laptop during a technology meeting.',
  },
  lagosDeveloper: {
    imageId: 'photo-1544813813-2c73bec209ca',
    alt: 'A smiling young professional working on a laptop in an office in Lagos, Nigeria.',
  },
} satisfies Record<string, CareerPhotoSource>;
