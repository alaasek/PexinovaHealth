import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
};

export const getSecurityTip = async (email: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user ${email} is currently on the login page. Generate one short (max 15 words) pro-tip about digital security or privacy. Make it sound premium and helpful.`,
    });
    return response.text || "Enable 2FA for maximum account security.";
  } catch (error) {
    return "Use a unique password for every service you use.";
  }
};

export const analyzePasswordStrength = async (password: string): Promise<{score: number, label: string, feedback: string}> => {
    if (password.length < 1) return { score: 0, label: 'None', feedback: '' };
    if (password.length < 6) return { score: 1, label: 'Weak', feedback: 'Password is too short.' };
    
    try {
      const ai = getAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this password: "${password}". Return a JSON object with: 
        1. score (number 1-4)
        2. label (Weak, Fair, Good, Strong)
        3. feedback (short sentence why).
        Respond ONLY with the JSON.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{"score": 2, "label": "Checked", "feedback": "Consider adding symbols."}');
    } catch {
      return { score: 2, label: 'Fair', feedback: 'Ensure a mix of letters and numbers.' };
    }
};

export const generateDashboardInsight = async (name: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User ${name} has entered their dashboard. Provide a very brief, high-end "Daily Insight" or greeting (1 sentence).`,
    });
    return response.text || "Your security posture is currently optimal.";
  } catch {
    return "Welcome back to your secure workspace.";
  }
};
