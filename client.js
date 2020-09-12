import { debounce } from "./debounce.js";
import { renderGetSingleVidReq } from "./renderGetSingleVidReq.js";
import { checkValidty } from "./checkValidty.js";
import dataService from "./dataService.js";
import api from "./api.js";
const SUPER_USER_ID = "15091997";
export const state = {
  sortBy: "newFirst",
  searchTerm: "",
  filterBy: "all",
  userId: "",
  isSuperUser: false,
};

document.addEventListener("DOMContentLoaded", function () {
  const formVidReqElm = document.getElementById("formVedioRequest");
  const sortByElms = document.querySelectorAll("[id*=sort_by_]");
  const filterBtElms = document.querySelectorAll("[id^=filter_by_]");
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
  dataService.loadAllVidReqs();
  //-------------------- Filter
  filterBtElms.forEach((elm) => {
    elm.addEventListener("click", function (e) {
      e.preventDefault();
      state.filterBy = e.target.getAttribute("id").split("_")[2];
      dataService.loadAllVidReqs(
        state.sortBy,
        state.searchTerm,
        state.filterBy
      );
      filterBtElms.forEach((elm) => elm.classList.remove("active"));
      this.classList.add("active");
    });
  }); //end of Filter
  //-------------------- SORT
  sortByElms.forEach((elm) => {
    elm.addEventListener("click", function (e) {
      e.preventDefault();
      state.sortBy = this.querySelector("input").value;
      dataService.loadAllVidReqs(
        state.sortBy,
        state.searchTerm,
        state.filterBy
      );
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
      dataService.loadAllVidReqs(
        state.sortBy,
        state.searchTerm,
        state.filterBy
      );
    }, 300)
  ); //end of search box
  // --------------------- Form
  formVidReqElm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formVidReqElm);
    formData.append("author_id", state.userId);
    const isValid = checkValidty(formData);
    if (!isValid) return;
    dataService.addVideoReq(formData).then((result) => {
      renderGetSingleVidReq(result, state, true);
    });
  }); //end of form submit
}); //end of DOMContentLoaded
