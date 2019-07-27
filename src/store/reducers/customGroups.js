import {
  CUSTOM_GROUP_CREATED,
  SET_SEARCHED_GROUP,
  SET_ALL_CUSTOM_GROUP_DATA
} from "../actions/actionTypes";

const initialState = {
  custom_group_created: false,
  join_group_status: 0,
  searched_group: null,
  admin_data: null,
  connections_data: null,
  activity_data: null,
  is_admin: null,
  only_admin_in_group: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CUSTOM_GROUP_CREATED:
      return {
        ...state,
        custom_group_created: action.status,
        searched_group: null //same action clears create and join
      };
    case SET_SEARCHED_GROUP:
      return {
        ...state,
        searched_group: {
          id: action.id,
          name: action.name,
          description: action.description,
          admin: action.admin,
          status: action.status
        }
      };
    case SET_ALL_CUSTOM_GROUP_DATA:
      return {
        ...state,
        admin_data: action.admin_data,
        // requested_members: action.admin_data.requested_members,
        // accepted_members: action.admin_data.accepted_members,
        // blocked_members: action.admin_data.blocked_members,
        connections_data: action.connections_data,
        activity_data: action.activity_data,
        is_admin: action.is_admin,
        only_admin_in_group: action.only_admin_in_group
      };
    default:
      return state;
  }
};

export default reducer;
