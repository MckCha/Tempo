class User {
    constructor({ id, email, password, created_at }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.created_at = created_at;
    }
}

export default User;