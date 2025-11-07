class Itinerary {
    constructor(id, user_id, title, destination_country, destination_city, trip_type, start_date, end_date) {
        this.id = id;
        this.user_id = user_id;
        this.title = title;
        this.destination_country = destination_country;
        this.destination_city = destination_city;
        this.trip_type = trip_type;
        this.start_date = start_date;
        this.end_date = end_date;
    }
}

export default Itinerary;