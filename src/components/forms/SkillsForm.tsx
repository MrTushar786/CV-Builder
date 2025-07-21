import { useState } from 'react';
import { WorkExperience } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { AIService } from '@/services/aiService';
import { toast } from 'sonner';

interface SkillsFormProps {
  data: string[];
  onChange: (data: string[]) => void;
  aiService: AIService;
  jobTitle: string;
  experience: WorkExperience[];
}

export const SkillsForm = ({ data, onChange, aiService, jobTitle, experience }: SkillsFormProps) => {
  const [newSkill, setNewSkill] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(data.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const generateAISkills = async () => {
    if (!jobTitle.trim()) {
      toast.error('Please fill in your job title first');
      return;
    }

    setLoadingAI(true);
    try {
      const experienceTexts = experience.flatMap(exp => exp.achievements).filter(Boolean);
      const suggestions = await aiService.generateSkillSuggestions(jobTitle, experienceTexts);
      
      if (suggestions.length > 0) {
        // Add new skills that aren't already in the list
        const newSkills = suggestions.filter(skill => 
          skill && !data.some(existing => 
            existing.toLowerCase() === skill.toLowerCase()
          )
        );
        onChange([...data, ...newSkills]);
        toast.success(`Added ${newSkills.length} AI-suggested skills!`);
      } else {
        toast.error('Could not generate skill suggestions. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to generate skill suggestions');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cv-heading">Skills & Expertise</h3>
        <Button
          onClick={generateAISkills}
          disabled={loadingAI}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loadingAI ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          AI Suggest Skills
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a skill (e.g., Project Management, Python, Leadership)"
            className="flex-1"
          />
          <Button onClick={addSkill} disabled={!newSkill.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {data.length > 0 && (
          <div>
            <Label className="mb-3 block">Your Skills</Label>
            <div className="flex flex-wrap gap-2">
              {data.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-cv-blue-light text-cv-blue border-cv-blue/20 flex items-center gap-1 px-3 py-1"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.length === 0 && (
          <div className="text-center py-8 text-cv-text">
            <p>No skills added yet. Add your professional skills or use AI suggestions to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};