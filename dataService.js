import { renderGetSingleVidReq } from "./renderGetSingleVidReq.js";
import { state } from "./client.js";
export default {
  ///////////////////////////////////////////////////////////
  updateVideoStatus: (videoId, newStatus, videoResValue = "") => {
    fetch("http://localhost:7777/video-request", {
      method: "PUT",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({
        id: videoId,
        status: newStatus,
        resVideo: videoResValue,
      }),
    })
      .then((res) => res.json())
      .then(() => window.location.reload());
  }, //end of Update VideoStatus,
  ///////////////////////////////////////////////////////////
  loadAllVidReqs: (
    sortBy = "newFirst",
    searchTerm = "",
    filterBy = "all",
    locaState = state
  ) => {
    const listOfVidsElm = document.getElementById("listOfRequests");
    fetch(
      `http://localhost:7777/video-request?sortBy=${sortBy}&searchTerm=${searchTerm}&filterBy=${filterBy}`
    )
      .then((blobb) => blobb.json())
      .then((data) => {
        listOfVidsElm.innerHTML = "";
        data.forEach((vidInfo) => {
          renderGetSingleVidReq(vidInfo, locaState);
        }); //end of foreach
      }); //end of then
  }, //end of loadAllVidReqs
}; //end of API;
