import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Target, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockStorage } from '../../lib/mockStorage';
import { UserSkill, SkillCategory } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { AddSkillModal } from '../../components/skills/AddSkillModal';
import { useToast } from '../../hooks/useToast';

const CATEGORIES: SkillCategory[] = [
  'Technical',
  'Data & AI',
  'Tools & Frameworks',
  'Soft Skills',
  'Design',
  'Business & Marketing',
];

export const SkillsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [skills, setSkills] = useState<UserSkill[]>(() => mockStorage.getUserSkills());
  const [targetRole, setTargetRole] = useState(() => mockStorage.getTargetRole());
  const [requiredSkillsText, setRequiredSkillsText] = useState(() => mockStorage.getTargetRoleSkills().join(', '));
  const [requiredSkills, setRequiredSkills] = useState<string[]>(() => mockStorage.getTargetRoleSkills());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    setSkills(mockStorage.getUserSkills());
    setTargetRole(mockStorage.getTargetRole());
    setRequiredSkills(mockStorage.getTargetRoleSkills());
    setRequiredSkillsText(mockStorage.getTargetRoleSkills().join(', '));
  };

  useEffect(() => {
    const handleStorage = (event: Event) => {
      const key = (event as CustomEvent<{ key?: string }>).detail?.key;
      if (!key || key === 'careerlaunch_user_skills' || key === 'careerlaunch_target_role' || key === 'careerlaunch_target_role_skills') loadData();
    };
    window.addEventListener('careerlaunch_storage_change', handleStorage);
    return () => window.removeEventListener('careerlaunch_storage_change', handleStorage);
  }, []);

  const handleSaveSkill = (skill: UserSkill) => {
    mockStorage.saveUserSkill(skill);
    loadData();
    showToast(`Added skill: ${skill.skillName}`, 'success');
  };

  const handleDeleteSkill = (id: string) => {
    mockStorage.deleteUserSkill(id);
    loadData();
    showToast('Skill removed', 'info');
  };

  const saveTargetRole = () => {
    const parsed = [...new Set(requiredSkillsText.split(',').map((item) => item.trim()).filter(Boolean))];
    mockStorage.setTargetRole(targetRole.trim());
    mockStorage.setTargetRoleSkills(parsed);
    setRequiredSkills(parsed);
    showToast('Your role requirements were saved', 'success');
  };
  const ownedSkillNames = new Set(skills.map((skill) => skill.skillName.trim().toLowerCase()));
  const matchedRequirements = requiredSkills.filter((skill) => ownedSkillNames.has(skill.toLowerCase()));
  const missingRequirements = requiredSkills.filter((skill) => !ownedSkillNames.has(skill.toLowerCase()));

  const getProficiencyBadge = (level: UserSkill['proficiencyLevel']) => {
    switch (level) {
      case 'Expert':
        return <Badge variant="green" size="sm">Expert</Badge>;
      case 'Advanced':
        return <Badge variant="blue" size="sm">Advanced</Badge>;
      case 'Intermediate':
        return <Badge variant="amber" size="sm">Intermediate</Badge>;
      default:
        return <Badge variant="default" size="sm">Beginner</Badge>;
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <PageHeader
        title="Skills & Role Gap Intelligence"
        subtitle="Track your skills and compare them with requirements you provide for your target role."
        breadcrumbs={[{ label: 'Skills' }]}
        badge={
          <Badge variant="blue" size="sm">
            {skills.length} Tracked Skills
          </Badge>
        }
        action={
          <Button
            size="md"
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Skill
          </Button>
        }
      />

      {/* Target Role Skill Gap Analysis Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-green-500" />
            Target Role Gap Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Add a role and its required skills from a real opportunity or your own career plan. This comparison uses only the skills on your profile.</p>
        </div>
        <Card className="p-5 space-y-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Target role
            <input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="e.g. Frontend Developer" className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Required skills (comma-separated)
            <textarea value={requiredSkillsText} onChange={(event) => setRequiredSkillsText(event.target.value)} placeholder="e.g. React, TypeScript, accessibility" rows={2} className="mt-1.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm" />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button size="sm" variant="primary" onClick={saveTargetRole}>Save role requirements</Button>
            {requiredSkills.length > 0 && <span className="text-xs text-slate-500">{matchedRequirements.length} of {requiredSkills.length} listed requirements also appear in your skills.</span>}
          </div>
          {requiredSkills.length > 0 && <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Skills listed on your profile</h3><p className="mt-1 text-slate-600 dark:text-slate-300">{matchedRequirements.join(', ') || 'None of the listed requirements yet.'}</p></div>
            <div><h3 className="font-semibold text-amber-700 dark:text-amber-400">Requirements not listed yet</h3><p className="mt-1 text-slate-600 dark:text-slate-300">{missingRequirements.join(', ') || 'All listed requirements appear in your skills.'}</p></div>
          </div>}
          <p className="text-[11px] text-slate-500">This is a simple text comparison, not an employer match or an assessment of proficiency.</p>
        </Card>
      </div>

      {/* Categorized Skills Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            My Skill Profile ({skills.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organized across technical domains, frameworks, and collaboration capabilities
          </p>
        </div>

        {skills.length === 0 ? (
          <EmptyState
            title="No skills added yet"
            description="Add your first skill to start analyzing role match gaps and improving your profile strength."
            icon={<Award className="w-10 h-10 text-slate-400" />}
            action={
              <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
                Add First Skill
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIES.map((cat) => {
              const catSkills = skills.filter((s) => s.category === cat);
              if (catSkills.length === 0) return null;

              return (
                <Card key={cat} className="p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {cat}
                    </h3>
                    <span className="text-xs font-semibold text-slate-400">
                      {catSkills.length} skills
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {catSkills.map((s) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{s.skillName}</div>
                          <div className="text-[11px] text-slate-400">{s.yearsOfExperience} yr(s) practical experience</div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getProficiencyBadge(s.proficiencyLevel)}
                          <button
                            onClick={() => handleDeleteSkill(s.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                            title="Remove skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AddSkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSkill}
        userId={user?.id || 'usr-teddy-001'}
      />
    </div>
  );
};
