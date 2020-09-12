const apiRoot = "http://localhost:7777";
const videoEndPoint = "video-request";
export default {
  videoReq: {
    get: (sortBy, searchTerm, filterBy) => {
      return fetch(
        `${apiRoot}/${videoEndPoint}?sortBy=${sortBy}&searchTerm=${searchTerm}&filterBy=${filterBy}`
      ).then((blobb) => blobb.json());
    },
    post: (formData) => {
      return fetch(`${apiRoot}/${videoEndPoint}`, {
        method: "POST",
        body: formData,
      }).then((bblob) => bblob.json());
    },
    update: (videoId, newStatus, videoResValue = "") => {
      return fetch(`${apiRoot}/${videoEndPoint}`, {
        method: "PUT",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({
          id: videoId,
          status: newStatus,
          resVideo: videoResValue,
        }),
      }).then((res) => res.json());
    },
    delete: (id) => {
      return fetch(`${apiRoot}/${videoEndPoint}`, {
        method: "DELETE",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({
          id,
        }),
      }).then((res) => res.json());
    },
  },
  votes: {
    update: (id, vote_type, user_id) => {
      return fetch(`${apiRoot}/${videoEndPoint}/vote`, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ id, vote_type, user_id }),
      }).then((res) => res.json());
    },
  },
};
