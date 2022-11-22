export type Filters = {
  tag?: string;
  feed?: boolean;
  author?: string;
  page: number;
  favourited?: boolean;
  isProfile?: boolean;
  userFeed?: boolean;
  globalFeed?: boolean;
  isFilterTag?: boolean;
  limit?: number;
};

type Actions = {
  type: string;
  pageNum?: number;
  tag?: string;
  author?: string;
};

export default function articleReducer(state: Filters, action: Actions) {
  switch (action.type) {
    case "GLOBAL_FEED":
      return {
        ...state,
        globalFeed: true,
        userFeed: false,
        isFilterTag: false,
        tag: "",
        feed: false,
        page: action.pageNum,
      };
    case "USER_FEED":
      return {
        ...state,
        userFeed: true,
        globalFeed: false,
        isFilterTag: false,
        tag: "",
        feed: true,
      };
    case "AUTHOR":
      return {
        ...state,
        userFeed: false,
        globalFeed: false,
        isFilterTag: false,
        tag: "",
        feed: false,
        author: action.author,
        favourited: false,
      };
    case "FAVOURITED":
      return {
        ...state,
        userFeed: false,
        globalFeed: false,
        isFilterTag: false,
        tag: "",
        feed: false,
        author: "",
        favourited: true,
      };
    case "FILTER_TAG":
      return {
        ...state,
        isFilterTag: true,
        userFeed: false,
        globalFeed: false,
        tag: action.tag,
        feed: false,
      };
    default:
      return state;
  }
}
