import React from 'react';
import { useParams } from 'react-router-dom';
import { mockStorage } from '../../lib/mockStorage';
import { INITIAL_USER_TEDDY, INITIAL_USER_AMINA } from '../../lib/mockData';
import { PublicPortfolioView } from '../../components/portfolio/PublicPortfolioView';

export const PublicPortfolioPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  // Resolve user by slug
  const allUsers = mockStorage.getAllUsers();
  let user = allUsers.find(u => {
    const slug = u.fullName.toLowerCase().replace(/\s+/g, '');
    return slug === username?.toLowerCase();
  });

  if (!user) {
    if (username?.toLowerCase().includes('amina')) {
      user = INITIAL_USER_AMINA;
    } else {
      user = INITIAL_USER_TEDDY;
    }
  }

  const projects = mockStorage.getProjects();
  const experience = mockStorage.getExperience();
  const education = mockStorage.getEducation();
  const skills = mockStorage.getUserSkills();

  return (
    <PublicPortfolioView
      user={user}
      projects={projects}
      experience={experience}
      education={education}
      skills={skills}
    />
  );
};

