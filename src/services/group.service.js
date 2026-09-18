import api from "@/api/axios";

const groupService = {
  getGroupSettings() {
    return api.get("/settings/groups");
  },

  assignGroups(data) {
    const params = new URLSearchParams();
    if (data?.numberOfGroups != null) params.append("numberOfGroups", String(data.numberOfGroups));
    if (data?.totalStudents != null) params.append("totalStudents", String(data.totalStudents));

    return api.post("/settings/groups/assign", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },
};

export default groupService;