const STORAGE_KEY = "chatbot_ui_chats";

export const saveChatsToStorage = (chats) => {
  try {
    const serializedChats = JSON.stringify(chats);
    sessionStorage.setItem(STORAGE_KEY, serializedChats);
  } catch (error) {
    console.error("Error saving chats to session storage:", error);
  }
};

export const loadChatsFromStorage = () => {
  try {
    const serializedChats = sessionStorage.getItem(STORAGE_KEY);
    if (serializedChats === null) {
      return [];
    }
    return JSON.parse(serializedChats);
  } catch (error) {
    console.error("Error loading chats from session storage:", error);
    return [];
  }
};

export const clearChatsFromStorage = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing chats from session storage:", error);
  }
};
