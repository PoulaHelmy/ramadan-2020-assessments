export function applyVoteStyle(
  video_id,
  votes_list,
  isDisabled = false,
  state,
  vote_type
) {
  const voteDownsElm = document.getElementById(`votes_downs_${video_id}`);
  const voteUpsElm = document.getElementById(`votes_ups_${video_id}`);
  if (isDisabled) {
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
