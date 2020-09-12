import { renderGetSingleVidReq } from "./renderGetSingleVidReq.js";
import { state } from "./client.js";
import api from "./api.js";
import { applyVoteStyle } from "./applyVoteStyle.js";
export default {
  ///////////////////////////////////////////////////////////
  updateVideoStatus: (videoId, newStatus, videoResValue = "") => {
    return api.videoReq
      .update(videoId, newStatus, (videoResValue = ""))
      .then((_) => window.location.reload());
  }, //end of Update VideoStatus,
  ///////////////////////////////////////////////////////////
  loadAllVidReqs: (
    sortBy = "newFirst",
    searchTerm = "",
    filterBy = "all",
    locaState = state
  ) => {
    const listOfVidsElm = document.getElementById("listOfRequests");
    api.videoReq.get(sortBy, searchTerm, filterBy).then((data) => {
      listOfVidsElm.innerHTML = "";
      data.forEach((vidInfo) => {
        renderGetSingleVidReq(vidInfo, locaState);
      }); //end of foreach
    }); //end of then
  }, //end of loadAllVidReqs
  ///////////////////////////////////////////////////////////
  addVideoReq(formData) {
    return api.videoReq.post(formData);
  }, //end of addVideoReq
  ///////////////////////////////////////////////////////////
  deleteVideoReq(id) {
    return api.videoReq.delete(id).then(() => window.location.reload());
  }, //end of deleteVideoReq
  updateVotes: (id, vote_type, user_id, isDone, state) => {
    const scoreVotesElm = document.getElementById(`score_votes_${id}`);
    return api.votes.update(id, vote_type, user_id).then((data) => {
      scoreVotesElm.innerText = data.votes.ups.length - data.votes.downs.length;
      applyVoteStyle(id, data.votes, isDone, state, vote_type);
    });
  },
}; //end of API;
