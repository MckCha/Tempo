class Conversation {
    constructor({ id, user_id, itinerary_id, session_id, title, created_at }) {
        this.id = id;
        this.user_id = user_id;
        this.itinerary_id = itinerary_id;
        this.session_id = session_id;
        this.title = title;
        this.created_at = created_at;
    }
}

export default Conversation;
