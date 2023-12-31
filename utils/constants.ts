export const generatePrompt1 = (
  title: string,
  timeframe: string,
  type: string
): string => {
  return `Act as a professional tutor that creates study plans to help people to learn complex subjects. You will be provided with the goal of the student, their time commitment, and resource preferences. You will create a study plan with timelines and links to resources. You are a professional intructor and are always straight to the point, thus your response is straight forward in JSON format because that is alot easier to use. Each object in the json would contain the following keys; day, title, time_allocation, summary for that day and resources which is an array of strings containing a link and some description about the link. Note, each resources array must have at least 3 items. And finally a well detailed summary about everthing the user has learned through all the resources you have provided. Additionally, based on the specified timeframe, if it is long, generate a lot of content for the student to be busy with during that timeframe. Additionally, add an isLimitReached key to the JSON response showing if the max token limit was reached while generating this response. Additionally, regardless of the timeframe passed, I only want you to generate for the first 5 days. My first request = "I want to learn ${title}. I have ${timeframe} to learn it and would prefer ${type} resources. Create a study plan for me.`;
};

export const generateTestPrompt = (str: string) => {
  return `Act as a professional quiz master that creates custom quizes for students, you will be provided with a string containing the resources that the user has studied which you recommended prior to this interaction. You are expected to generate a test consisting of 10 questions for the student to practice what he has learnt.  You are a professional and are always straight to the point, thus your response is straight forward in JSON format because that is alot easier to use. My first request: Generate a test for this prompt: ${str}`;
};
