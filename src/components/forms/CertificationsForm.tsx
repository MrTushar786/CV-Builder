import { useState } from 'react';
import { Certification } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { AIService } from '@/services/aiService';
import { toast } from 'sonner';

interface CertificationsFormProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
  aiService: AIService;
}

export const CertificationsForm = ({ data, onChange, aiService }: CertificationsFormProps) => {
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      year: ''
    };
    onChange([...data, newCertification]);
  };

  const removeCertification = (id: string) => {
    onChange(data.filter(cert => cert.id !== id));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    onChange(data.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const improveCertification = async (id: string) => {
    const certification = data.find(cert => cert.id === id);
    if (!certification || !certification.name.trim()) {
      toast.error('Please enter the certification name first');
      return;
    }

    setLoadingAI(id);
    try {
      const improved = await aiService.improveCertificationDescription(certification.name);
      if (improved && improved !== certification.name) {
        // Try to extract full name and issuer from AI response
        const lines = improved.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          const fullText = lines[0];
          // Simple pattern to extract issuer information
          const issuerMatch = fullText.match(/(?:issued by|from|by)\s+(.+?)(?:\s|$)/i);
          if (issuerMatch) {
            updateCertification(id, 'issuer', issuerMatch[1]);
          }
          updateCertification(id, 'name', fullText);
        }
        toast.success('Certification details improved!');
      }
    } catch (error) {
      toast.error('Failed to improve certification details');
    } finally {
      setLoadingAI(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cv-heading">Certifications & Memberships</h3>
        <Button onClick={addCertification} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Certification
        </Button>
      </div>

      {data.length === 0 && (
        <Card className="p-6 text-center text-cv-text">
          <p>No certifications added yet. Click "Add Certification" to get started.</p>
        </Card>
      )}

      {data.map((certification) => (
        <Card key={certification.id} className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-cv-heading">Certification</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => improveCertification(certification.id)}
                disabled={loadingAI === certification.id}
                className="flex items-center gap-2"
              >
                {loadingAI === certification.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                AI Improve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCertification(certification.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Certification Name</Label>
              <Input
                value={certification.name}
                onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                placeholder="e.g., CIPP, CSM, CGEIT"
              />
            </div>
            <div>
              <Label>Issuing Organization</Label>
              <Input
                value={certification.issuer}
                onChange={(e) => updateCertification(certification.id, 'issuer', e.target.value)}
                placeholder="e.g., IAPP, Scrum Alliance"
              />
            </div>
            <div>
              <Label>Year (Optional)</Label>
              <Input
                value={certification.year || ''}
                onChange={(e) => updateCertification(certification.id, 'year', e.target.value)}
                placeholder="e.g., 2021"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};