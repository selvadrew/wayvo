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

export function normalizeActivePlans(active_plans) {
  return active_plans.map(plan => {
    return {
      plan_id: plan.plan_id,
      group_name: plan.group_name,
      plan_creator: plan.plan_creator,
      activity: plan.activity,
      time: plan.time,
      exploding_offer_countdown: plan.exploding_offer_countdown,
      going: plan.going,
      is_happening: plan.is_happening
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


export function normalizeContacts(contacts) {
  return contacts.map(contact => {
    return {
      contactId: contact.recordID,
      givenName: contact.givenName || "",
      familyName: contact.familyName || "",
      phoneNumbers: contact.phoneNumbers || null,
      selected: false
    };
  });
}

export function sortContacts(normalizedContacts) {
  return normalizedContacts.sort(function (x, y) {
    return (
      x.givenName.localeCompare(y.givenName)
    )
  })
}
