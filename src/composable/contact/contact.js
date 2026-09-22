import { ref } from "vue";
import contactService from "@/services/contact.service";
import { useAppToast } from "@/composable/useAppToast";

export function useContactList() {
  const toast = useAppToast();
  const students = ref([]);
  const loading = ref(false);
  const totalSubmissions = ref(0);
  const pagination = ref({
    current_page: 1,
    first_item: 1,
    last_item: 10,
    from: 1,
    to: 10,
    per_page: 10,
    total: 0,
    last_page: 1,
    totalPages: 1,
    on_first_page: true,
    has_more_pages: false,
  });

  const fetchContacts = async (params = {}) => {
    loading.value = true;
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || pagination.value.per_page || 10,
      };

      if (params.search && params.search.trim()) {
        queryParams.search = params.search.trim();
      }

      if (params.program) {
        queryParams.program = params.program;
      }

      if (params.shift) {
        queryParams.shift = params.shift;
      }

      if (params.isContacted !== undefined && params.isContacted !== null && params.isContacted !== "") {
        queryParams.isContacted = params.isContacted === "true" || params.isContacted === true;
      }

      if (params.sortBy) {
        queryParams.sortBy = params.sortBy;
      }
      if (params.sortOrder) {
        queryParams.sortOrder = params.sortOrder;
      }

      const response = await contactService.getContacts(queryParams);
      if (response.data?.success) {
        const data = response.data.data || {};
        const meta = data.pagination || {};
        const page = meta.page || 1;
        const limit = meta.per_page || meta.limit || 10;
        const total = meta.totalSubmissions || meta.total || 0;
        const totalPages = meta.totalPages || Math.ceil(total / limit) || 1;
        const startNumber = (page - 1) * limit + 1;

        totalSubmissions.value = total;
        pagination.value = {
          current_page: page,
          per_page: limit,
          total: total,
          last_page: totalPages,
          totalPages: totalPages,
          from: total === 0 ? 0 : startNumber,
          to: Math.min(page * limit, total),
          first_item: total === 0 ? 0 : startNumber,
          last_item: Math.min(page * limit, total),
          on_first_page: page === 1,
          has_more_pages: page < totalPages,
        };

        const programMap = {
          WEB_DEVELOPMENT: "Web Development",
          MOBILE_APP: "Mobile App",
        };
        const shiftMap = {
          MORNING: "វេនព្រឹក",
          AFTERNOON: "វេនរសៀល",
        };
        const genderMap = {
          MALE: "ប្រុស",
          FEMALE: "ស្រី",
        };
        const yearMap = {
          YEAR_1: "ឆ្នាំទី 1",
          YEAR_2: "ឆ្នាំទី 2",
          YEAR_3: "ឆ្នាំទី 3",
          YEAR_4: "ឆ្នាំទី 4",
          YEAR_5: "ឆ្នាំទី 5",
        };

        const submissionsList = Array.isArray(data.submissions)
          ? data.submissions
          : Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        students.value = submissionsList.map((sub, index) => {
          const cl = sub.contactList || {};
          const studentInfo = sub.student || {};

          let contactedDateText = null;
          if (cl.contactedAt) {
            try {
              contactedDateText = new Date(cl.contactedAt).toLocaleDateString("km-KH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            } catch {
              contactedDateText = cl.contactedAt;
            }
          }

          let addedDateText = null;
          if (cl.createdAt) {
            try {
              addedDateText = new Date(cl.createdAt).toLocaleDateString("km-KH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
            } catch {
              addedDateText = cl.createdAt;
            }
          }

          return {
            seq_num: startNumber + index,
            id: sub.id,
            studentId: sub.studentId || studentInfo.id,
            name:
              studentInfo.khName ||
              studentInfo.enName ||
              studentInfo.email ||
              "N/A",
            khName: studentInfo.khName || "N/A",
            enName: studentInfo.enName || "N/A",
            gender: genderMap[studentInfo.gender] || studentInfo.gender || "N/A",
            year: yearMap[sub.yearOfStudy] || sub.yearOfStudy || "N/A",
            skill: programMap[sub.program] || sub.program || "N/A",
            rawProgram: sub.program,
            study_shift: shiftMap[sub.shift] || sub.shift || "N/A",
            rawShift: sub.shift,
            phone: studentInfo.phone || "—",
            telegram: studentInfo.telegramUsername || "—",
            university: studentInfo.university?.name || studentInfo.universityOther || "—",
            // Contact list details
            contactListId: cl.id,
            isContacted: Boolean(cl.isContacted),
            contactedAt: contactedDateText,
            rawContactedAt: cl.contactedAt,
            contactNote: cl.contactNote || "",
            createdBy: cl.createdBy?.name || "—",
            createdByAvatar: cl.createdBy?.avatarPath || null,
            contactedBy: cl.contactedBy?.name || "—",
            contactedByAvatar: cl.contactedBy?.avatarPath || null,
            addedAt: addedDateText,
            rawCreatedAt: cl.createdAt,
            submitted_at: sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString("km-KH") : "N/A",
            raw: sub,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching contact list:", error);
      toast.error(error.response?.data?.message || "បរាជ័យក្នុងការទាញយកបញ្ជីទំនាក់ទំនង");
    } finally {
      loading.value = false;
    }
  };

  const addContact = async (submissionId, contactNote = "") => {
    try {
      loading.value = true;
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
      loading.value = false;
    }
  };

  const markContacted = async (submissionId) => {
    try {
      loading.value = true;
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
      loading.value = false;
    }
  };

  const deleteContact = async (submissionId) => {
    try {
      loading.value = true;
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
      loading.value = false;
    }
  };

  return {
    loading,
    students,
    totalSubmissions,
    pagination,
    fetchContacts,
    addContact,
    markContacted,
    deleteContact,
  };
}

export default useContactList;
