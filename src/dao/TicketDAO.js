import TicketModel from '../models/ticket.model.js'

export default class TicketDAO {

    async createTicket (ticket) {
        return await TicketModel.create(ticket)
    }

    async getTicketByFilter (filter,populate,populateFields) {
        if (populate)
            return await TicketModel.findOne(filter).populate(populateFields)
        return await TicketModel.findOne(filter)
    }

}