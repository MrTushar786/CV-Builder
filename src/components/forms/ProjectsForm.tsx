import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Trash2, Plus, Wand2, ExternalLink, Github } from 'lucide-react';
import { Project } from '@/types/cv';
import { AIService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
  aiService: AIService;
}

export const ProjectsForm = ({ data, onChange, aiService }: ProjectsFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      url: '',
      github: ''
    };
    onChange([...data, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onChange(data.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const deleteProject = (id: string) => {
    onChange(data.filter(project => project.id !== id));
  };

  const enhanceDescription = async (projectId: string, title: string, currentDescription: string) => {
    if (!title.trim()) {
      toast({
        title: "Project title required",
        description: "Please enter a project title first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Enhance this project description for a resume. Project: "${title}". Current description: "${currentDescription}". Make it professional, concise, and highlight impact. Focus on technologies, challenges solved, and results achieved.`;
      
      const enhancedDescription = await aiService.generateText(prompt);
      updateProject(projectId, 'description', enhancedDescription);
      
      toast({
        title: "Description enhanced!",
        description: "AI has improved your project description"
      });
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: "Failed to enhance description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const suggestTechnologies = async (projectId: string, title: string, description: string) => {
    if (!title.trim() && !description.trim()) {
      toast({
        title: "Project details required",
        description: "Please enter project title or description first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Based on this project: "${title}" - "${description}", suggest relevant technologies, frameworks, and tools that would typically be used. Return as a comma-separated list.`;
      
      const suggestedTech = await aiService.generateText(prompt);
      const techArray = suggestedTech.split(',').map(tech => tech.trim()).filter(tech => tech);
      updateProject(projectId, 'technologies', techArray);
      
      toast({
        title: "Technologies suggested!",
        description: "AI has suggested relevant technologies"
      });
    } catch (error) {
      toast({
        title: "Suggestion failed",
        description: "Failed to suggest technologies. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-cv-heading">Projects</h3>
        <Button onClick={addProject} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-cv-text">
          <p>No projects added yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((project) => (
            <Card key={project.id} className="p-4 border-cv-border">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <Label htmlFor={`title-${project.id}`}>Project Title</Label>
                      <Input
                        id={`title-${project.id}`}
                        value={project.title}
                        onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                        placeholder="E.g., E-commerce Platform"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`start-${project.id}`}>Start Date</Label>
                        <Input
                          id={`start-${project.id}`}
                          type="month"
                          value={project.startDate}
                          onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`end-${project.id}`}>End Date</Label>
                        <Input
                          id={`end-${project.id}`}
                          type="month"
                          value={project.endDate}
                          onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProject(project.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor={`description-${project.id}`}>Description</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => enhanceDescription(project.id, project.title, project.description)}
                      disabled={isGenerating}
                      className="h-6 px-2 text-xs"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      {isGenerating ? 'Enhancing...' : 'AI Enhance'}
                    </Button>
                  </div>
                  <Textarea
                    id={`description-${project.id}`}
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    placeholder="Describe your project, technologies used, and key achievements..."
                    rows={3}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor={`tech-${project.id}`}>Technologies</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => suggestTechnologies(project.id, project.title, project.description)}
                      disabled={isGenerating}
                      className="h-6 px-2 text-xs"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      {isGenerating ? 'Suggesting...' : 'AI Suggest'}
                    </Button>
                  </div>
                  <Input
                    id={`tech-${project.id}`}
                    value={project.technologies.join(', ')}
                    onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                    placeholder="React, Node.js, MongoDB, AWS..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`url-${project.id}`}>Live URL (Optional)</Label>
                    <div className="relative">
                      <Input
                        id={`url-${project.id}`}
                        value={project.url}
                        onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                        placeholder="https://myproject.com"
                      />
                      <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cv-text" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`github-${project.id}`}>GitHub URL (Optional)</Label>
                    <div className="relative">
                      <Input
                        id={`github-${project.id}`}
                        value={project.github}
                        onChange={(e) => updateProject(project.id, 'github', e.target.value)}
                        placeholder="https://github.com/username/project"
                      />
                      <Github className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cv-text" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};