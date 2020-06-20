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
    ``
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
      selected: false,
      from_username: contact.from_username || false,
      last_connected: contact.last_connected,
      relationship_days: contact.relationship_days,
      can_send_invite: contact.can_send_invite
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


export function firstNameOwnership(firstName) {
  formattedName = firstName + "'s"
  if (firstName.slice(-1) === "s") {
    formattedName = firstName + "'"
  }

  return formattedName
}

export function setCalendarWithData(schedule, arrayPosition) {
  let allTimes = this.allTimes(arrayPosition)
  return [
    {
      id: 1,
      time: "8:00am",
      status: allTimes["8:00am"] || schedule["8:00am"] || "busy"
    },
    {
      id: 2,
      time: "8:30am",
      status: allTimes["8:30am"] || schedule["8:30am"] || "busy"
    },
    {
      id: 3,
      time: "9:00am",
      status: allTimes["9:00am"] || schedule["9:00am"] || "busy",
    },
    {
      id: 4,
      time: "9:30am",
      status: allTimes["9:30am"] || schedule["9:30am"] || "busy"
    },
    {
      id: 5,
      time: "10:00am",
      status: allTimes["10:00am"] || schedule["10:00am"] || "busy"
    },
    {
      id: 6,
      time: "10:30am",
      status: allTimes["10:30am"] || schedule["10:30am"] || "busy"
    },
    {
      id: 7,
      time: "11:00am",
      status: allTimes["11:00am"] || schedule["11:00am"] || "busy"
    },
    {
      id: 8,
      time: "11:30am",
      status: allTimes["11:30am"] || schedule["11:30am"] || "busy",
    },
    {
      id: 9,
      time: "12:00pm",
      status: allTimes["12:00pm"] || schedule["12:00pm"] || "busy"
    },
    {
      id: 10,
      time: "12:30pm",
      status: allTimes["12:30pm"] || schedule["12:30pm"] || "busy",
    },
    {
      id: 11,
      time: "1:00pm",
      status: allTimes["1:00pm"] || schedule["1:00pm"] || "busy",
    },
    {
      id: 12,
      time: "1:30pm",
      status: allTimes["1:30pm"] || schedule["1:30pm"] || "busy",
    },
    {
      id: 13,
      time: "2:00pm",
      status: allTimes["2:00pm"] || schedule["2:00pm"] || "busy",
    },
    {
      id: 14,
      time: "2:30pm",
      status: allTimes["2:30pm"] || schedule["2:30pm"] || "busy",
    },
    {
      id: 15,
      time: "3:00pm",
      status: allTimes["3:00pm"] || schedule["3:00pm"] || "busy",
    },
    {
      id: 16,
      time: "3:30pm",
      status: allTimes["3:30pm"] || schedule["3:30pm"] || "busy",
    },
    {
      id: 17,
      time: "4:00pm",
      status: allTimes["4:00pm"] || schedule["4:00pm"] || "busy",
    },
    {
      id: 18,
      time: "4:30pm",
      status: allTimes["4:30pm"] || schedule["4:30pm"] || "busy",
    },
    {
      id: 19,
      time: "5:00pm",
      status: allTimes["5:00pm"] || schedule["5:00pm"] || "busy",
    },
    {
      id: 20,
      time: "5:30pm",
      status: allTimes["5:30pm"] || schedule["5:30pm"] || "busy",
    },
    {
      id: 21,
      time: "6:00pm",
      status: allTimes["6:00pm"] || schedule["6:00pm"] || "busy",
    },
    {
      id: 22,
      time: "6:30pm",
      status: allTimes["6:30pm"] || schedule["6:30pm"] || "busy",
    },
    {
      id: 23,
      time: "7:00pm",
      status: allTimes["7:00pm"] || schedule["7:00pm"] || "busy",
    },
    {
      id: 24,
      time: "7:30pm",
      status: allTimes["7:30pm"] || schedule["7:30pm"] || "busy",
    },
    {
      id: 25,
      time: "8:00pm",
      status: allTimes["8:00pm"] || schedule["8:00pm"] || "busy",
    },
    {
      id: 26,
      time: "8:30pm",
      status: allTimes["8:30pm"] || schedule["8:30pm"] || "busy",
    },
    {
      id: 27,
      time: "9:00pm",
      status: allTimes["9:00pm"] || schedule["9:00pm"] || "busy",
    },
    {
      id: 28,
      time: "9:30pm",
      status: allTimes["9:30pm"] || schedule["9:30pm"] || "busy",
    },
    {
      id: 29,
      time: "10:00pm",
      status: allTimes["10:00pm"] || schedule["10:00pm"] || "busy",
    },
    {
      id: 30,
      time: "10:30pm",
      status: allTimes["10:30pm"] || schedule["10:30pm"] || "busy",
    },
    {
      id: 31,
      time: "11:00pm",
      status: allTimes["11:00pm"] || schedule["11:00pm"] || "busy",
    },
    {
      id: 32,
      time: "11:30pm",
      status: allTimes["11:30pm"] || schedule["11:30pm"] || "busy"
    }
  ];
}

allTimes = arrayPosition => {
  let array = [
    "8:00am",
    "8:30am",
    "9:00am",
    "9:30am",
    "10:00am",
    "10:30am",
    "11:00am",
    "11:30am",
    "12:00pm",
    "12:30pm",
    "1:00pm",
    "1:30pm",
    "2:00pm",
    "2:30pm",
    "3:00pm",
    "3:30pm",
    "4:00pm",
    "4:30pm",
    "5:00pm",
    "5:30pm",
    "6:00pm",
    "6:30pm",
    "7:00pm",
    "7:30pm",
    "8:00pm",
    "8:30pm",
    "9:00pm",
    "9:30pm",
    "10:00pm",
    "10:30pm",
    "11:00pm",
    "11:30pm"
  ]

  let newArray = array.slice(0, arrayPosition)
  let pastTimes = {}

  newArray.forEach(element => {
    pastTimes[element] = "dont show"
  })

  return (
    pastTimes
  )
}

// export function allTimes() {
//   return (
//     ["8:00am",
//       "8:30am",
//       "9:00am",
//       "9:30am",
//       "10:00am",
//       "10:30am",
//       "11:00am",
//       "11:30am",
//       "12:00pm",
//       "12:30pm",
//       "1:00pm",
//       "1:30pm",
//       "2:00pm",
//       "2:30pm",
//       "3:00pm",
//       "3:30pm",
//       "4:00pm",
//       "4:30pm",
//       "5:00pm",
//       "5:30pm",
//       "6:00pm",
//       "6:30pm",
//       "7:00pm",
//       "7:30pm",
//       "8:00pm",
//       "8:30pm",
//       "9:00pm",
//       "9:30pm",
//       "10:00pm",
//       "10:30pm",
//       "11:00pm",
//       "11:30pm"]
//   )
// }
