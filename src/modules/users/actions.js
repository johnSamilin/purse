import { GlobalStore } from "../../store/globalStore";

const setActiveUser = function(user) {
  GlobalStore.modules.users.activeUser.value = user;
};

export const usersActions = {
  setActiveUser,
};
