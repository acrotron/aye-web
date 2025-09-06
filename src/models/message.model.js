export class Message {
  constructor(text = '', sender = 'bot', timestamp = new Date()) {
    this.text = text;
    this.sender = sender;
    this.timestamp = timestamp;
  }
}

