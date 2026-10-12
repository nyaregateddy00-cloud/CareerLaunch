import React, { useState } from 'react';
import { UserSkill, SkillCategory, SkillProficiency } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: UserSkill) => void;
  userId: string;
}

const CATEGORIES: SkillCategory[] = [
  'Technical',
  'Soft Skills',
  'Tools & Frameworks',
  'Design',
  'Data & AI',
  'Business & Marketing',
];

const PROFICIENCIES: SkillProficiency[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const AddSkillModal: React.FC<AddSkillModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userId,
}) => {
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Technical');
  const [proficiencyLevel, setProficiencyLevel] = useState<SkillProficiency>('Intermediate');
  const [years, setYears] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    onSave({
      id: `sk-${Date.now()}`,
      userId,
      skillName: skillName.trim(),
      category,
      proficiencyLevel,
      yearsOfExperience: parseFloat(years) || 1,
    });
    setSkillName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Skill" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Skill Name"
          required
          placeholder="e.g. Docker, TypeScript, Graphic Design, Negotiation"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SkillCategory)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Proficiency Level
            </label>
            <select
              value={proficiencyLevel}
              onChange={(e) => setProficiencyLevel(e.target.value as SkillProficiency)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
            >
              {PROFICIENCIES.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Years of Experience"
          type="number"
          step="0.5"
          min="0"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Skill
          </Button>
        </div>
      </form>
    </Modal>
  );
};

