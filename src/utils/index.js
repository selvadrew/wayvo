export function normalizeFriends(friends) {
  return friends.map(friend => {
    return {
      id: friend.id || "",
      fullname: friend.fullname || "",
      username: friend.username || "",
      phone_number: friend.phone_number || "",
      receive_notifications: friend.receive_notifications,
      send_notifications: friend.send_notifications
    };
  });
}

export function normalizeFriendRequests(friends) {
  return friends.map(friend => {
    return {
      id: friend.id || "",
      fullname: friend.fullname || "",
      username: friend.username || "",
      phone_number: friend.phone_number || "",
      created_at: friend.created_at || ""
    };
  });
}

export function normalizeActiveFriends(outgoing_calls) {
  return outgoing_calls.map(outgoing_call => {
    return {
      outgoing_id: outgoing_call.outgoing_id || "",
      fullname: outgoing_call.fullname || "",
      phone_number: outgoing_call.phone_number || "",
      active: outgoing_call.active || false,
      connected: outgoing_call.connected || false,
      ios: outgoing_call.ios
    };
  });
}

export function normalizeSayHelloData(say_hello_data, seconds_left) {
  return {
    connected_with: say_hello_data.connected_with || null,
    can_say_hello: say_hello_data.can_say_hello,
    seconds_left: seconds_left
  };
}
