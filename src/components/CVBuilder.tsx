import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { WorkExperienceForm } from './forms/WorkExperienceForm';
import { SkillsForm } from './forms/SkillsForm';
import { EducationForm } from './forms/EducationForm';
import { CertificationsForm } from './forms/CertificationsForm';
import { LanguagesForm } from './forms/LanguagesForm';
import { CVPreview } from './CVPreview';
import { CVData } from '@/types/cv';
import { AIService } from '@/services/aiService';

const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: ''
  },
  workExperience: [],
  skills: [],
  education: [],
  certifications: [],
  languages: []
};

export const CVBuilder = () => {
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const [aiService] = useState(() => new AIService('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'));

  const updateCVData = (section: keyof CVData, data: any) => {
    setCVData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-cv-heading mb-2">Professional CV Builder</h1>
          <p className="text-cv-text">Create a professional resume with AI-powered suggestions</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="certifications">Certs</TabsTrigger>
                  <TabsTrigger value="languages">Languages</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="mt-6">
                  <PersonalInfoForm
                    data={cvData.personalInfo}
                    onChange={(data) => updateCVData('personalInfo', data)}
                  />
                </TabsContent>
                
                <TabsContent value="experience" className="mt-6">
                  <WorkExperienceForm
                    data={cvData.workExperience}
                    onChange={(data) => updateCVData('workExperience', data)}
                    aiService={aiService}
                  />
                </TabsContent>
                
                <TabsContent value="skills" className="mt-6">
                  <SkillsForm
                    data={cvData.skills}
                    onChange={(data) => updateCVData('skills', data)}
                    aiService={aiService}
                    jobTitle={cvData.personalInfo.title}
                    experience={cvData.workExperience}
                  />
                </TabsContent>
                
                <TabsContent value="education" className="mt-6">
                  <EducationForm
                    data={cvData.education}
                    onChange={(data) => updateCVData('education', data)}
                  />
                </TabsContent>
                
                <TabsContent value="certifications" className="mt-6">
                  <CertificationsForm
                    data={cvData.certifications}
                    onChange={(data) => updateCVData('certifications', data)}
                    aiService={aiService}
                  />
                </TabsContent>
                
                <TabsContent value="languages" className="mt-6">
                  <LanguagesForm
                    data={cvData.languages}
                    onChange={(data) => updateCVData('languages', data)}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          {/* Preview Section */}
          <div className="lg:sticky lg:top-6">
            <CVPreview data={cvData} />
          </div>
        </div>
      </div>
    </div>
  );
};