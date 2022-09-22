type Icon = {
  type: string;
  name: string;
};
const solid = "fa-solid";
const regular = "fa-regular";

type Button = {
  text: string;
  icon: Icon;
};

export const selectButtons: Button[] = [
  {
    text: "Inbox",
    icon: {
      type: solid,
      name: "fa-inbox",
    },
  },
  {
    text: "Starred",
    icon: {
      type: regular,
      name: "fa-star",
    },
  },
  {
    text: "Important",
    icon: {
      type: regular,
      name: "fa-bookmark",
    },
  },
  {
    text: "Spam",
    icon: {
      type: solid,
      name: "fa-ban",
    },
  },
  {
    text: "Deleted",
    icon: {
      type: solid,
      name: "fa-trash",
    },
  },
];
