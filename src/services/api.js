export const sendMessage = async (message, history, toggle = false) => {
  try {
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message,
        history,
        toggle,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
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