export class AdditionalInfo {
  constructor(type, title, content, timestamp = new Date()) {
    this.type = type; // 'code' | 'source' | 'note' | 'image'
    this.title = title;
    this.content = content;
    this.timestamp = timestamp;
  }
}

