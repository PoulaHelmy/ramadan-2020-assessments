const listOfVidsElm = document.getElementById("listOfRequests");
function renderGetSingleVidReq(vidInfo, isPrePend = false) {
  const vidReqContainerElm = document.createElement("div");
  vidReqContainerElm.innerHTML = `
        <div class="card mb-3">
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
                ${vidInfo.votes.ups - vidInfo.votes.downs}</h3>
                <a id="votes_downs_${vidInfo._id}" class="btn btn-link">🔻</a>
                </div>
            </div>
            <div class="card-footer d-flex flex-row justify-content-between">
                <div>
                <span class="text-info">${vidInfo.status.toUpperCase()}</span>
                &bullet; added by <strong>${vidInfo.author_name}</strong> on
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
  const voteDownsElm = document.getElementById(`votes_downs_${vidInfo._id}`);
  const scoreVotesElm = document.getElementById(`score_votes_${vidInfo._id}`);
  const voteUpsElm = document.getElementById(`votes_ups_${vidInfo._id}`);

  voteUpsElm.addEventListener("click", (e) => {
    fetch("http://localhost:7777/video-request/vote", {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        id: vidInfo._id,
        vote_type: "ups",
      }),
    })
      .then((blob2) => blob2.json())
      .then((data) => {
        scoreVotesElm.innerText = data.votes.ups - data.votes.downs;
      });
  }); //end of votes up click

  voteDownsElm.addEventListener("click", (e) => {
    fetch("http://localhost:7777/video-request/vote", {
      method: "PUT",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        id: vidInfo._id,
        vote_type: "downs",
      }),
    })
      .then((blob22) => blob22.json())
      .then((data) => {
        scoreVotesElm.innerText = data.votes.ups - data.votes.downs;
      });
  }); //end of votes Down click
} //end of getSingleVidReq

function loadAllVidReqs(sortBy = "newFirst") {
  fetch(`http://localhost:7777/video-request?sortBy=${sortBy}`)
    .then((blobb) => blobb.json())
    .then((data) => {
      listOfVidsElm.innerHTML = "";
      data.forEach((vidInfo) => {
        renderGetSingleVidReq(vidInfo);
      }); //end of foreach
    }); //end of then
}

document.addEventListener("DOMContentLoaded", function () {
  const formVidReqElm = document.getElementById("formVedioRequest");
  const sortByElms = document.querySelectorAll("[id*=sort_by_]");
  loadAllVidReqs();
  sortByElms.forEach((elm) => {
    elm.addEventListener("click", function (e) {
      e.preventDefault();
      const sortBBY = this.querySelector("input");
      loadAllVidReqs(sortBBY.value);
      this.classList.add("active");
      if (sortBBY.value === "topVotedFirst") {
        document.getElementById("sort_by_new").classList.remove("active");
      } else {
        document.getElementById("sort_by_top").classList.remove("active");
      }
    });
  });

  formVidReqElm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formVidReqElm);
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
