import { Education } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export const EducationForm = ({ data, onChange }: EducationFormProps) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startYear: '',
      endYear: ''
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(data.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cv-heading">Education</h3>
        <Button onClick={addEducation} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Education
        </Button>
      </div>

      {data.length === 0 && (
        <Card className="p-6 text-center text-cv-text">
          <p>No education added yet. Click "Add Education" to get started.</p>
        </Card>
      )}

      {data.map((education) => (
        <Card key={education.id} className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-cv-heading">Education</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeEducation(education.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Degree</Label>
              <Input
                value={education.degree}
                onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                placeholder="e.g., MSc in Technology Management"
              />
            </div>
            <div>
              <Label>Institution</Label>
              <Input
                value={education.institution}
                onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                placeholder="e.g., Columbia University"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={education.location}
                onChange={(e) => updateEducation(education.id, 'location', e.target.value)}
                placeholder="e.g., NY"
              />
            </div>
            <div>
              <Label>Start Year</Label>
              <Input
                value={education.startYear}
                onChange={(e) => updateEducation(education.id, 'startYear', e.target.value)}
                placeholder="e.g., 2009"
              />
            </div>
            <div>
              <Label>End Year</Label>
              <Input
                value={education.endYear}
                onChange={(e) => updateEducation(education.id, 'endYear', e.target.value)}
                placeholder="e.g., 2011"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};