import contactService from "@/services/contact.service";
import { useAppToast } from "@/composable/useAppToast";
import { usePaginatedList } from "@/composable/usePaginatedList";
import { PROGRAM_MAP, GENDER_MAP } from "@/constants/mappings";

export function useContactList() {
  const toast = useAppToast();

  const paginated = usePaginatedList({
    fetchService: contactService.getContacts,
    transformItem: (sub, seqNum) => {
      const student = sub.student || {};
      const contact = sub.contactList || {};

      return {
        seq_num: seqNum,
        id: sub.id,
        name: student.khName || student.enName || student.email || "N/A",
        gender: GENDER_MAP[student.gender] || student.gender || "N/A",
        skill: PROGRAM_MAP[sub.program] || sub.program || "N/A",
        phone: student.phone || "—",
        telegram: student.telegramUsername || "—",
        contactNote: contact.contactNote || "",
        isContacted: Boolean(contact.isContacted),
        raw: sub,
      };
    },
  });

  const addContact = async (submissionId, contactNote = "") => {
    try {
      paginated.loading.value = true;
      const response = await contactService.addContact(submissionId, { contactNote });
      if (response.data?.success) {
        toast.success("បានបន្ថែមទៅបញ្ជីទំនាក់ទំនងដោយជោគជ័យ");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error(error.response?.data?.message || "បរាជ័យក្នុងការបន្ថែមទៅបញ្ជីទំនាក់ទំនង");
      return false;
    } finally {
      paginated.loading.value = false;
    }
  };

  const markContacted = async (submissionId) => {
    try {
      paginated.loading.value = true;
      const response = await contactService.markContact(submissionId);
      if (response.data?.success) {
        toast.success("បានសម្គាល់ថាបានទាក់ទងដោយជោគជ័យ");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error marking contacted:", error);
      toast.error(error.response?.data?.message || "បរាជ័យក្នុងការសម្គាល់ទំនាក់ទំនង");
      return false;
    } finally {
      paginated.loading.value = false;
    }
  };

  const deleteContact = async (submissionId) => {
    try {
      paginated.loading.value = true;
      const response = await contactService.deleteContact(submissionId);
      if (response.data?.success) {
        toast.success("បានលុបចេញពីបញ្ជីទំនាក់ទំនងដោយជោគជ័យ");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error(error.response?.data?.message || "បរាជ័យក្នុងការលុបចេញពីបញ្ជីទំនាក់ទំនង");
      return false;
    } finally {
      paginated.loading.value = false;
    }
  };

  return {
    loading: paginated.loading,
    students: paginated.students,
    totalSubmissions: paginated.totalSubmissions,
    pagination: paginated.pagination,
    fetchContacts: paginated.fetchList,
    addContact,
    markContacted,
    deleteContact,
  };
}

export default useContactList;
