interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateJobSuggestions(title: string, company: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a professional CV writing assistant. Provide 3-5 specific, quantifiable achievements for the given job title and company. Focus on measurable results, cost savings, efficiency improvements, and team management. Return only a JSON array of strings.'
            },
            {
              role: 'user',
              content: `Generate professional achievements for a ${title} position at ${company}. Focus on specific, quantifiable results.`
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data: PerplexityResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      try {
        return JSON.parse(content);
      } catch {
        // Fallback: split by lines and clean up
        return content.split('\n')
          .filter(line => line.trim() && line.includes('-'))
          .map(line => line.replace(/^[-•]\s*/, '').trim())
          .slice(0, 5);
      }
    } catch (error) {
      console.error('Error generating job suggestions:', error);
      return [];
    }
  }

  async generateSkillSuggestions(title: string, experience: string[]): Promise<string[]> {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a professional CV writing assistant. Suggest relevant technical and soft skills for the given job title. Return only a JSON array of skill names (strings).'
            },
            {
              role: 'user',
              content: `Suggest 8-12 relevant skills for a ${title} based on this experience: ${experience.join(', ')}`
            }
          ],
          temperature: 0.5,
          max_tokens: 300,
        }),
      });

      const data: PerplexityResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      try {
        return JSON.parse(content);
      } catch {
        // Fallback: extract skills from text
        return content.split(/[,\n]/)
          .map(skill => skill.trim().replace(/^[-•"']\s*/, ''))
          .filter(skill => skill && skill.length > 2)
          .slice(0, 12);
      }
    } catch (error) {
      console.error('Error generating skill suggestions:', error);
      return [];
    }
  }

  async improveCertificationDescription(certification: string): Promise<string> {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a professional CV writing assistant. Provide the full official name and issuing organization for the given certification acronym or partial name.'
            },
            {
              role: 'user',
              content: `What is the full name and issuing organization for this certification: ${certification}`
            }
          ],
          temperature: 0.3,
          max_tokens: 150,
        }),
      });

      const data: PerplexityResponse = await response.json();
      return data.choices[0]?.message?.content || certification;
    } catch (error) {
      console.error('Error improving certification:', error);
      return certification;
    }
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a professional CV writing assistant. Be precise and concise.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      const data: PerplexityResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating text:', error);
      return '';
    }
  }
}