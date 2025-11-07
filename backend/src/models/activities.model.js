class Activities {
    constructor({id, itinerary_day_id, poi_id, order_index, estimated_cost, currency, start_time, end_time}) {
        this.id = id;
        this.itinerary_day_id = itinerary_day_id;
        this.poi_id = poi_id;
        this.order_index = order_index;
        this.estimated_cost = estimated_cost;
        this.currency = currency;
        this.start_time = start_time;
        this.end_time = end_time;
    }
}

export default Activities;