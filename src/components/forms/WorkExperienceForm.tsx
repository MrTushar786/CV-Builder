import { useState } from 'react';
import { WorkExperience } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { AIService } from '@/services/aiService';
import { toast } from 'sonner';

interface WorkExperienceFormProps {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
  aiService: AIService;
}

export const WorkExperienceForm = ({ data, onChange, aiService }: WorkExperienceFormProps) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      achievements: ['']
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    onChange(data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addAchievement = (id: string) => {
    const experience = data.find(exp => exp.id === id);
    if (experience) {
      updateExperience(id, 'achievements', [...experience.achievements, '']);
    }
  };

  const updateAchievement = (id: string, index: number, value: string) => {
    const experience = data.find(exp => exp.id === id);
    if (experience) {
      const newAchievements = [...experience.achievements];
      newAchievements[index] = value;
      updateExperience(id, 'achievements', newAchievements);
    }
  };

  const removeAchievement = (id: string, index: number) => {
    const experience = data.find(exp => exp.id === id);
    if (experience && experience.achievements.length > 1) {
      const newAchievements = experience.achievements.filter((_, i) => i !== index);
      updateExperience(id, 'achievements', newAchievements);
    }
  };

  const generateAISuggestions = async (id: string) => {
    const experience = data.find(exp => exp.id === id);
    if (!experience || !experience.position || !experience.company) {
      toast.error('Please fill in the position and company first');
      return;
    }

    setLoadingAI(id);
    try {
      const suggestions = await aiService.generateJobSuggestions(experience.position, experience.company);
      if (suggestions.length > 0) {
        updateExperience(id, 'achievements', suggestions);
        toast.success('AI suggestions generated successfully!');
      } else {
        toast.error('Could not generate suggestions. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to generate suggestions');
    } finally {
      setLoadingAI(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cv-heading">Work Experience</h3>
        <Button onClick={addExperience} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      {data.length === 0 && (
        <Card className="p-6 text-center text-cv-text">
          <p>No work experience added yet. Click "Add Experience" to get started.</p>
        </Card>
      )}

      {data.map((experience) => (
        <Card key={experience.id} className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-cv-heading">Work Experience</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateAISuggestions(experience.id)}
                disabled={loadingAI === experience.id}
                className="flex items-center gap-2"
              >
                {loadingAI === experience.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                AI Suggest
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeExperience(experience.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Position</Label>
              <Input
                value={experience.position}
                onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                placeholder="e.g., Chief Information Officer"
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={experience.company}
                onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                placeholder="e.g., Tech Corp Inc."
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                value={experience.startDate}
                onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                placeholder="MM/YYYY"
              />
            </div>
            <div>
              <Label>End Date</Label>
              <div className="space-y-2">
                <Input
                  value={experience.endDate}
                  onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                  placeholder="MM/YYYY"
                  disabled={experience.current}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={experience.current}
                    onCheckedChange={(checked) => {
                      updateExperience(experience.id, 'current', checked);
                      if (checked) {
                        updateExperience(experience.id, 'endDate', 'Present');
                      }
                    }}
                  />
                  <Label className="text-sm">Current position</Label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Key Achievements</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addAchievement(experience.id)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {experience.achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={achievement}
                    onChange={(e) => updateAchievement(experience.id, index, e.target.value)}
                    placeholder="Describe a key achievement with quantifiable results"
                    className="min-h-[60px]"
                  />
                  {experience.achievements.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeAchievement(experience.id, index)}
                      className="mt-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};