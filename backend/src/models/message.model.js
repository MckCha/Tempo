class Message {
    constructor(id, conversation_id, role, tokens, content, created_at) {
        this.id = id;
        this.conversation_id = conversation_id;
        this.role = role;
        this.tokens = tokens;
        this.content = content;
        this.created_at = created_at;
    }
}

export default Message;