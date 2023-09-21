export const generatePrompt = (
  title: string,
  timeframe: string,
  type: string
): string => {
  return `Act as a professional tutor that creates study plans to help people to learn complex subjects. You will be provided with the goal of the student, their time commitment, and resource preferences. You will create a study plan with timelines and links to resources. Only include relevant and concise resources because time is limited. My first request = "I want to learn ${title}. I have ${timeframe} to learn it and would prefer ${type} resources. Create a study plan for me.`;
};
