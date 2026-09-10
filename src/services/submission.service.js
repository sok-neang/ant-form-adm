import api from "@/api/axios";

const submissionService = {

  //finale result 
  getAllFinalResult(params = {}){
    return api.get("/submissions/final", { params });
  },
  getPassFinalResult(params = {}){
    return api.get("/submissions/passed", { params });
  },
  getReservedFinalResult(params = {}){
    return api.get("/submissions/reserved", { params });
  },


  // short list
  getShortlist(params = {}) {
    return api.get("/submissions/shortlist", { params });
  },
  getFailShortlist(params = {}){
    return api.get('/submissions/failed-evaluation', { params });
  },
  getPassShortlist(params = {}){
    return api.get('/submissions/passed', { params });
  },

  //all request
  getSubmissions(params = {}){
    return api.get('/submissions/submitted', { params });
  },
  getFailSubmissions(params = {}){
    return api.get(`/submissions/failed-shortlist`, { params });
  },
  getPassSubmissions(params = {}){
    return api.get(`/submissions/shortlist`, { params });
  },

  // detail & promote submission status 
  getById(id) {
    return api.get(`/submissions/${id}`);
  },
  promoteStatus(id, params = {}) {
    return api.patch(`/submissions/${id}/status`, params);
  },

  //black list 
  getAllBlacklist(params = {}){
    return api.get(`/submissions/blacklist`, { params });
  },

};

export default submissionService;
