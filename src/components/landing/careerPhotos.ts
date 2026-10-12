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
    alt: 'Two young professionals learning and collaborating on laptops in Nairobi.',
  },
  womenInTechnology: {
    imageId: 'photo-1573164713988-8665fc963095',
    alt: 'A Black African woman in technology leading a discussion with her team.',
  },
  africanTechTeam: {
    imageId: 'photo-1522071820081-009f0129c71c',
    alt: 'Young African tech professionals collaborating around a laptop in a modern innovation space.',
  },
  graduateSuccess: {
    imageId: 'photo-1534528741775-53994a69daeb',
    alt: 'Young African graduate preparing for technical interviews and professional opportunities.',
  },
  creativeFreelancer: {
    imageId: 'photo-1573496359142-b8d87734a5a2',
    alt: 'African product and UI/UX designer working on design systems and mobile prototypes.',
  },
  universityCollaboration: {
    imageId: 'photo-1531482615713-2afd69097998',
    alt: 'African university students engaged in collaborative technical project research.',
  },
} satisfies Record<string, CareerPhotoSource>;
