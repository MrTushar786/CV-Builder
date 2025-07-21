import { Language } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface LanguagesFormProps {
  data: Language[];
  onChange: (data: Language[]) => void;
}

const proficiencyLevels = [
  'Native or Bilingual Proficiency',
  'Professional Working Proficiency',
  'Limited Working Proficiency',
  'Elementary Proficiency'
];

export const LanguagesForm = ({ data, onChange }: LanguagesFormProps) => {
  const addLanguage = () => {
    const newLanguage: Language = {
      language: '',
      proficiency: ''
    };
    onChange([...data, newLanguage]);
  };

  const removeLanguage = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    onChange(data.map((lang, i) => 
      i === index ? { ...lang, [field]: value } : lang
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cv-heading">Languages</h3>
        <Button onClick={addLanguage} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Language
        </Button>
      </div>

      {data.length === 0 && (
        <Card className="p-6 text-center text-cv-text">
          <p>No languages added yet. Click "Add Language" to get started.</p>
        </Card>
      )}

      {data.map((language, index) => (
        <Card key={index} className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-cv-heading">Language</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeLanguage(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Language</Label>
              <Input
                value={language.language}
                onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                placeholder="e.g., English, French, Spanish"
              />
            </div>
            <div>
              <Label>Proficiency Level</Label>
              <Select
                value={language.proficiency}
                onValueChange={(value) => updateLanguage(index, 'proficiency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  {proficiencyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};