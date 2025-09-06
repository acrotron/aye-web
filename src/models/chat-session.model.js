export class ChatSession {
  constructor(
    id,
    name,
    messages = [],
    conversationHistory = [],
    createdAt = new Date(),
    lastUpdated = new Date(),
    isLoaded = false
  ) {
    this.id = id;
    this.name = name;
    this.messages = messages;
    this.conversationHistory = conversationHistory;
    this.createdAt = createdAt;
    this.lastUpdated = lastUpdated;
    this.isLoaded = isLoaded;
  }
}

