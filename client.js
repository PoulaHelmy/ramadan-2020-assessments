const listOfVidsElm = document.getElementById("listOfRequests");
const SUPER_USER_ID = "5f5b7dc4c234ee12c849ede6";
const state = {
  sortBy: "newFirst",
  searchTerm: "",
  userId: "",
  isSuperUser: false,
};
function renderGetSingleVidReq(vidInfo, isPrePend = false) {
  const vidReqContainerElm = document.createElement("div");
  vidReqContainerElm.innerHTML = `
        <div class="card mb-3">
             ${
               state.isSuperUser
                 ? `
              <div class="card-header d-flex justify-content-between">
                <select class="custom-select w-25" id="admin_change_status_${
                  vidInfo._id
                }">
                  <option value="new">NEW</option>
                  <option value="planned">Planned</option>
                  <option value="done">Done</option>
                </select>
                <div class="input-group ml-2 mr-5 ${
                  vidInfo.status != "done" ? "d-none" : ""
                }" id="admin_video_res_container_${vidInfo._id}">
                  <input type="text" class="form-control" id="admin_video_res_${
                    vidInfo._id
                  }" placeholder="Paste here youtube video id">
                    <div class="input-group-append">
                      <button class="btn btn-outline-secondary" type='button' id="admin_save_video_res_${
                        vidInfo._id
                      }">Save</button>
                    </div>
                </div>
                <button class="btn btn-danger" id="admin_delete_video_req_${
                  vidInfo._id
                }">Delete</button>
              </div> `
                 : ""
             }
            <div class="card-body d-flex justify-content-between flex-row">
                <div class="d-flex flex-column">
                <h3>${vidInfo.topic_title}</h3>
                <p class="text-muted mb-2">${vidInfo.topic_details}</p>
                <p class="mb-0 text-muted">
                    ${
                      vidInfo.expected_result &&
                      `<strong>Expected results:</strong> ${vidInfo.expected_result}`
                    }
                </p>
                </div>
                <div class="d-flex flex-column text-center">
                <a id="votes_ups_${vidInfo._id}" class="btn btn-link">🔺</a>
                <h3 id="score_votes_${vidInfo._id}">
                ${vidInfo.votes.ups.length - vidInfo.votes.downs.length}</h3>
                <a id="votes_downs_${vidInfo._id}" class="btn btn-link">🔻</a>
                </div>
            </div>
            <div class="card-footer d-flex flex-row justify-content-between">
                <div>
                <span class="text-info">${vidInfo.status.toUpperCase()}</span>
                &bul; added by <strong>${vidInfo.author_name}</strong> on
                <strong>${new Date(
                  vidInfo.submit_date
                ).toLocaleDateString()}</strong>
                </div>
                <div
                class="d-flex justify-content-center flex-column 408ml-auto mr-2"
                >
                <div class="badge badge-success">
                ${vidInfo.target_level}
                </div>
                </div>
            </div>
        </div>
    `;

  isPrePend
    ? listOfVidsElm.prepend(vidReqContainerElm)
    : listOfVidsElm.appendChild(vidReqContainerElm);

  const adminChangeStatusElm = document.getElementById(
    `admin_change_status_${vidInfo._id}`
  );
  const adminVideoResElm = document.getElementById(
    `admin_video_res_${vidInfo._id}`
  );
  const adminSaveVideoResElm = document.getElementById(
    `admin_save_video_res_${vidInfo._id}`
  );
  const adminVideoResContainerElm = document.getElementById(
    `admin_video_res_container_${vidInfo._id}`
  );
  const adminDeleteVideoReqElm = document.getElementById(
    `admin_delete_video_req_${vidInfo._id}`
  );
  if (state.isSuperUser) {
    adminChangeStatusElm.value = vidInfo.status;
    adminVideoResElm.value = vidInfo.video_ref.link;
    // change Status select options
    adminChangeStatusElm.addEventListener("change", (e) => {
      if (e.target.value === "done") {
        adminVideoResContainerElm.classList.remove("d-none");
      } else {
        updateVideoStatus(vidInfo._id, e.target.value);
      }
    }); // End of change Status select options
    // Save video Link Button
    adminSaveVideoResElm.addEventListener("click", (e) => {
      e.preventDefault();
      if (!adminVideoResElm.value) {
        adminVideoResElm.classList.add("is-invalid");
        adminVideoResElm.addEventListener("input", () => {
          adminVideoResElm.classList.remove("is-invalid");
        });
        return;
      }
      updateVideoStatus(vidInfo._id, "done", adminVideoResElm.value);
    }); //End of Save video Link Button
    //Delete Buuton
    adminDeleteVideoReqElm.addEventListener("click", (e) => {
      e.preventDefault();
      const isSure = confirm(`Are Sure TO Delete "${vidInfo.topic_title}"`);
      if (!isSure) return;
      fetch("http://localhost:7777/video-request", {
        method: "DELETE",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify({
          id: vidInfo._id,
        }),
      })
        .then((res) => res.json())
        .then(() => window.location.reload());
    }); //End ofDelete Buuton
  }
  applyVoteStyle(vidInfo._id, vidInfo.votes);

  const scoreVotesElm = document.getElementById(`score_votes_${vidInfo._id}`);
  const votesElms = document.querySelectorAll(
    `[id^=votes_][id$=_${vidInfo._id}]`
  );
  votesElms.forEach((elm) => {
    if (state.isSuperUser) {
      return;
    }
    elm.addEventListener("click", function (e) {
      e.preventDefault();
      const [, vote_type, id] = e.target.getAttribute("id").split("_");
      fetch("http://localhost:7777/video-request/vote", {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ id, vote_type, user_id: state.userId }),
      })
        .then((blob2) => blob2.json())
        .then((data) => {
          scoreVotesElm.innerText =
            data.votes.ups.length - data.votes.downs.length;
          applyVoteStyle(id, data.votes, vote_type);
        });
    });
  });
} //end of getSingleVidReq
function applyVoteStyle(video_id, votes_list, vote_type) {
  const voteDownsElm = document.getElementById(`votes_downs_${video_id}`);
  const voteUpsElm = document.getElementById(`votes_ups_${video_id}`);
  if (state.isSuperUser) {
    voteDownsElm.style.opacity = "0.5";
    voteDownsElm.style.cursor = "not-allowed";
    voteUpsElm.style.opacity = "0.5";
    voteUpsElm.style.cursor = "not-allowed";

    return;
  }
  if (!vote_type) {
    if (votes_list.ups.includes(state.userId)) {
      vote_type = "ups";
    } else if (votes_list.downs.includes(state.userId)) {
      vote_type = "downs";
    } else {
      return;
    }
  }
  const voteDirElm = vote_type === "ups" ? voteUpsElm : voteDownsElm;
  const voteOtherDirElm = vote_type === "ups" ? voteDownsElm : voteUpsElm;
  if (votes_list[vote_type].includes(state.userId)) {
    voteDirElm.style.opacity = 1;
    voteOtherDirElm.style.opacity = "0.5";
  } else {
    voteOtherDirElm.style.opacity = 1;
  }
} //end of applyVoteStyle
function loadAllVidReqs(sortBy = "newFirst", searchTerm = "") {
  fetch(
    `http://localhost:7777/video-request?sortBy=${sortBy}&searchTerm=${searchTerm}`
  )
    .then((blobb) => blobb.json())
    .then((data) => {
      listOfVidsElm.innerHTML = "";
      data.forEach((vidInfo) => {
        renderGetSingleVidReq(vidInfo);
      }); //end of foreach
    }); //end of then
}
function debounce(fn, time) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), time);
  };
} //end of debounce
function checkValidty(formData) {
  // const name = formData.get("author_name");
  // const email = formData.get("author_email");
  const topic = formData.get("topic_title");
  const topic_details = formData.get("topic_details");

  // if (!name) {
  //   document.querySelector("[name=author_name]").classList.add("is-invalid");
  // }
  // const emailPattern = /^[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,6}?\.[a-zA-Z]{2,6}$/;
  // if (!email || !emailPattern.test(email)) {
  //   document.querySelector("[name=author_email]").classList.add("is-invalid");
  // }
  if (!topic || topic.length > 30) {
    document.querySelector("[name=topic_title]").classList.add("is-invalid");
  }
  if (!topic_details) {
    document.querySelector("[name=topic_details]").classList.add("is-invalid");
  }
  const allInvalidElms = document.querySelectorAll(".is-invalid");
  if (allInvalidElms.length) {
    allInvalidElms.forEach((Elm) => {
      Elm.addEventListener("input", function () {
        this.classList.remove("is-invalid");
      });
    });
    return false;
  }
  return true;
} //end of checkValidty
function updateVideoStatus(videoId, newStatus, videoResValue = "") {
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
} //end of Update VideoStatus
document.addEventListener("DOMContentLoaded", function () {
  const formVidReqElm = document.getElementById("formVedioRequest");
  const sortByElms = document.querySelectorAll("[id*=sort_by_]");
  const searchBox = document.getElementById("searchBox");
  const formLoginElm = document.querySelector(".login-form");
  const appContentElm = document.querySelector(".app-content");

  if (window.location.search) {
    state.userId = new URLSearchParams(window.location.search).get("id");
    if (state.userId === SUPER_USER_ID) {
      state.isSuperUser = true;
      document.querySelector(".normal-user-content").classList.add("d-none");
    }
    formLoginElm.classList.add("d-none");
    appContentElm.classList.remove("d-none");
  }
  loadAllVidReqs();
  //-------------------- SORT
  sortByElms.forEach((elm) => {
    elm.addEventListener("click", function (e) {
      e.preventDefault();
      state.sortBy = this.querySelector("input").value;
      loadAllVidReqs(state.sortBy, state.searchTerm);
      this.classList.add("active");
      if (state.sortBy === "topVotedFirst") {
        document.getElementById("sort_by_new").classList.remove("active");
      } else {
        document.getElementById("sort_by_top").classList.remove("active");
      }
    });
  }); //end of sort
  // ------------------- Search
  searchBox.addEventListener(
    "input",
    debounce((e) => {
      state.searchTerm = e.target.value;
      loadAllVidReqs(state.sortBy, state.searchTerm);
    }, 300)
  ); //end of search box
  // --------------------- Form
  formVidReqElm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formVidReqElm);
    formData.append("author_id", state.userId);
    const isValid = checkValidty(formData);
    if (!isValid) return;

    fetch("http://localhost:7777/video-request", {
      method: "POST",
      body: formData,
    })
      .then((bblob) => bblob.json())
      .then((result) => {
        renderGetSingleVidReq(result, true);
      });
  }); //end of form submit
}); //end of DOMContentLoaded
