const sampleResponses = [
  "Hello! How can I help you today?",
  "That's an interesting question. Based on my knowledge, the answer would be that it depends on several factors...",
  "I'd be happy to help with that. Here's what you need to know...",
  "According to my information, the best approach would be to first analyze the requirements and then proceed with implementation.",
  "There are multiple ways to solve this problem. One efficient approach would be...",
  "I don't have specific information about that, but I can suggest some resources that might help you find what you're looking for.",
];

const sampleDetailedResponses = [
  {
    response: "Here's a comprehensive analysis of your question.",
    routes: ["knowledge_base", "reasoning_engine"],
    modified_context:
      "The question pertains to software architecture patterns, specifically microservices vs monolithic approaches.",
    algo: "Pattern matching against known software architecture models",
    data: "Comparison metrics between different architectural approaches",
    python_code:
      "import pandas as pd\n\ndef compare_architectures(arch_type):\n    data = {'microservices': {'scalability': 9, 'complexity': 8}, }\n    return data[arch_type]",
    execution_result: "{'scalability': 9, 'complexity': 8}",
  },
  {
    response: "I've analyzed your code and found a potential solution.",
    routes: ["code_analyzer", "solution_generator"],
    modified_context:
      "The user is trying to optimize a database query that's running slowly.",
    algo: "Query optimization using indexing strategy",
    data: "Performance metrics before and after optimization",
    python_code:
      "def optimize_query(query):\n    # Add index to frequently queried columns\n    optimized = query.replace('SELECT *', 'SELECT id, name')\n    return optimized",
    execution_result: "Execution time reduced by 65%",
  },
  {
    response: "Based on the data analysis, here are my findings.",
    routes: ["data_analysis", "statistical_engine"],
    modified_context:
      "The dataset shows customer purchase patterns over a 12-month period.",
    algo: "Time series analysis with seasonal decomposition",
    data: "Peak purchasing periods identified in March, July, and November",
    python_code:
      "import matplotlib.pyplot as plt\n\ndef plot_seasonal_data(data):\n    plt.figure(figsize=(10, 6))\n    plt.plot(data['dates'], data['purchases'])\n    plt.title('Seasonal Purchase Patterns')\n    return 'Plot generated successfully'",
    execution_result:
      "Plot generated successfully showing three distinct peaks",
  },
];

export const sendMessage = async (message, history, toggle = false) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (toggle) {
    const randomIndex = Math.floor(
      Math.random() * sampleDetailedResponses.length
    );
    return sampleDetailedResponses[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * sampleResponses.length);
    return { response: sampleResponses[randomIndex] };
  }
};

export const formatResponseForDisplay = (response) => {
  if (!response.routes || response.routes.length === 0) {
    return response.response;
  }

  let formattedResponse = `**📌 Triggered Routes**: ${response.routes.join(
    ", "
  )}\n\n`;

  if (response.modified_context) {
    formattedResponse += `**🔍 Analysis**:\n${response.modified_context}\n\n`;
  }

  if (response.algo) {
    formattedResponse += `**⚙️ Method**:\n${response.algo}\n\n`;
  }

  if (response.data) {
    formattedResponse += `**📊 Data Insight**:\n${response.data}\n\n`;
  }

  if (response.csv_file_path) {
    formattedResponse += `**📁 CSV File Path**:\n${response.csv_file_path}\n\n`;
  }

  if (response.json_file_path) {
    formattedResponse += `**📁 JSON File Path**:\n${response.json_file_path}\n\n`;
  }

  if (response.kafka_file_path) {
    formattedResponse += `**📁 Kafka File Path**:\n${response.kafka_file_path}\n\n`;
  }

  if (response.python_code) {
    formattedResponse += `**💻 Code Executed**:\n\`\`\`python\n${response.python_code}\n\`\`\`\n\n`;
  }

  if (response.execution_result) {
    formattedResponse += `**🔄 Execution Result**:\n\`\`\`\n${response.execution_result}\n\`\`\`\n\n`;
  }

  formattedResponse += `✅ **Final Answer:**\n${response.response}`;

  return formattedResponse;
};