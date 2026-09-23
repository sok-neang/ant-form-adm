import api from "@/api/axios";

const contactService = {
  getContacts(params) {
    return api.get("/submissions/contact-list", { params });
  },
  addContact(id, data) {
    return api.post(`/submissions/${id}/contact-list`, data);
  },
  markContact(id) {
    return api.patch(`/submissions/${id}/contact-list/mark-contact`);
  },
  deleteContact(id) {
    return api.delete(`/submissions/${id}/contact-list`);
  },
};

export default contactService;