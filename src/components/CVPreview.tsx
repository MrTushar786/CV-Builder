import { CVData } from '@/types/cv';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Linkedin, Download } from 'lucide-react';

interface CVPreviewProps {
  data: CVData;
}

export const CVPreview = ({ data }: CVPreviewProps) => {
  const handleDownload = () => {
    // For now, we'll implement print functionality
    // In a full implementation, you might want to use libraries like jsPDF
    window.print();
  };

  const formatDate = (startDate: string, endDate: string, current: boolean) => {
    const start = startDate || 'Present';
    const end = current ? 'Present' : (endDate || 'Present');
    return `${start} - ${end}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-cv-heading">CV Preview</h3>
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      {/* CV Preview */}
      <Card className="p-0 bg-white overflow-hidden shadow-lg print:shadow-none print:border-none">
        <div id="cv-content" className="p-8 max-w-4xl mx-auto bg-white text-black">
          {/* Header Section */}
          <div className="flex items-start gap-6 mb-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={data.personalInfo.profileImage} />
                <AvatarFallback className="bg-cv-blue text-white text-xl font-semibold">
                  {data.personalInfo.fullName ? 
                    data.personalInfo.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 
                    'U'
                  }
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name and Title */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-cv-heading mb-2">
                {data.personalInfo.fullName || 'Your Name'}
              </h1>
              <h2 className="text-lg text-cv-text mb-4 font-medium">
                {data.personalInfo.title || 'Your Professional Title'}
              </h2>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {data.personalInfo.email && (
                  <div className="flex items-center gap-2 text-cv-blue">
                    <Mail className="w-4 h-4" />
                    <span>{data.personalInfo.email}</span>
                  </div>
                )}
                {data.personalInfo.phone && (
                  <div className="flex items-center gap-2 text-cv-blue">
                    <Phone className="w-4 h-4" />
                    <span>{data.personalInfo.phone}</span>
                  </div>
                )}
                {data.personalInfo.location && (
                  <div className="flex items-center gap-2 text-cv-blue">
                    <MapPin className="w-4 h-4" />
                    <span>{data.personalInfo.location}</span>
                  </div>
                )}
                {data.personalInfo.linkedin && (
                  <div className="flex items-center gap-2 text-cv-blue">
                    <Linkedin className="w-4 h-4" />
                    <span>{data.personalInfo.linkedin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Work Experience */}
              {data.workExperience.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-cv-blue mb-4 uppercase tracking-wide">
                    Work Experience
                  </h3>
                  <div className="space-y-6">
                    {data.workExperience.map((exp) => (
                      <div key={exp.id}>
                        <h4 className="font-bold text-cv-heading text-lg">{exp.position}</h4>
                        <p className="text-cv-heading font-medium">{exp.company}</p>
                        <p className="text-sm text-cv-text italic mb-3">
                          {formatDate(exp.startDate, exp.endDate, exp.current)}
                        </p>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, index) => (
                            achievement.trim() && (
                              <li key={index} className="text-sm text-cv-text flex items-start">
                                <span className="mr-2 mt-1 block w-1 h-1 bg-cv-text rounded-full flex-shrink-0"></span>
                                <span>{achievement}</span>
                              </li>
                            )
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-cv-blue mb-4 uppercase tracking-wide">
                    Education
                  </h3>
                  <div className="space-y-4">
                    {data.education.map((edu) => (
                      <div key={edu.id}>
                        <h4 className="font-bold text-cv-heading">{edu.degree}</h4>
                        <p className="text-cv-heading font-medium">{edu.institution}, {edu.location}</p>
                        <p className="text-sm text-cv-text italic">
                          {edu.startYear} - {edu.endYear}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Skills */}
              {data.skills.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-cv-blue mb-4 uppercase tracking-wide">
                    Expertise & Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-cv-blue-light text-cv-blue border-cv-blue/20 px-3 py-1 text-sm font-medium"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {data.certifications.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-cv-blue mb-4 uppercase tracking-wide">
                    Certifications and Memberships
                  </h3>
                  <div className="space-y-3">
                    {data.certifications.map((cert) => (
                      <div key={cert.id}>
                        <h4 className="font-medium text-cv-heading">{cert.name}</h4>
                        <p className="text-sm text-cv-text italic">
                          {cert.issuer}
                          {cert.year && ` (${cert.year})`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {data.languages.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-cv-blue mb-4 uppercase tracking-wide">
                    Languages
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {data.languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium text-cv-heading">{lang.language}</span>
                        <span className="text-sm text-cv-text italic">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #cv-content, #cv-content * {
            visibility: visible;
          }
          #cv-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 0.5in;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};