import { createSlice } from "@reduxjs/toolkit";

let containerIndex = 0, containerTitleIndex = 0, pageTitleIndex = 0;
//容器状态slice函数
export const containerSlice = createSlice({
    name: "containers",
    initialState: {},
    reducers: {

      addContainerAction: (state, action) => {
        const length = Object.keys(state).length;
        state[`container${containerIndex++}`] = {
          type: "container", 
          No: `${containerIndex}`, 
          top: action.payload.top, 
          left: action.payload.left, 
          title: `容器${containerIndex}`,
          minWidth: 160,
          minHeight: 160,
          width: 160, 
          height: 160, 
          borderWidth: 8,
          borderStyle: "solid",
          borderColor: "transparent",
          borderImage: "borderImg1",
          bgColor: {
            r: "255",
            g: "255",
            b: "255",
            a: "1"
          }, 
          bgImg: "containerImg1"
        }
      },

      resizeAction: (state, action) => {

        state[action.payload.id].width = action.payload.width;
        state[action.payload.id].height = action.payload.height;
      },

      dragAction: (state, action) => {

        state[action.payload.id].left = action.payload.left;
        state[action.payload.id].top = action.payload.top;
      },

      customlayoutAction: (state, action) => {
        state[action.payload.id][action.payload.current] = action.payload.value;
      },
      setBgColorAction: (state, action) => {
        state[action.payload.id].bgColor = action.payload.color;
      },

      setOpacityAction: (state, action) => {
        state[action.payload.id].bgColor.a = action.payload.opacity;
      },

      setBorderAction: (state, action) => {
        state[action.payload.id].borderImage = action.payload.borderImage;
      },
      setContainerBgImgAction: (state, action) => {
        state[action.payload.id].bgImg = action.payload.bgImg;
      },

      deleteContainerAction: (state, action) => {
        // state[action.payload.id] = undefined;
        delete state[action.payload]
      }
    },
});

export const {
  addContainerAction,
  resizeAction, 
  dragAction, 
  customlayoutAction, 
  setBgColorAction,
  setOpacityAction,
  setBorderAction,
  setContainerBgImgAction,
  deleteContainerAction
} = containerSlice.actions;

export const containerReducer = containerSlice.reducer;

//标题容器状态slice函数
export const titleSlice = createSlice({
  name: "title",
  initialState: {
    containerTitle: [],
    pageTitle: []
  },
  reducers: {
    addContainerTitle: (state, action) => {

      // let length = state.containerTitle.filter((title) => title.link === action.payload).length;
      state.containerTitle.push({
        id: `${action.payload}Title${containerTitleIndex++}`,//`${action.payload}Title${length}`
        type: "containerTitle",
        link: action.payload,
        top: 0,
        left: 0,
        minWidth: 100,
        minHeight: 20,
        width: 100,
        height: 20,
        title: "标题",
        fontSize: 14,
        fontWeight: "normal",
        fontColor: {
          r: "255",
          g: "255",
          b: "255",
          a: "1"
        },
        // bgColor: {
        //   r: "0",
        //   g: "0",
        //   b: "0",
        //   a: "1"
        // },
        bgImg: "titlebg1",
      })
    },
    addPageTitleAction: (state, action) => {
      state.pageTitle.push({
        id: `pageTitle${pageTitleIndex++}`,//`pageTitle${state.pageTitle.length}`
        type: "pageTitle",
        top: action.payload.top,
        left: action.payload.left,
        minWidth: 500,
        minHeight: 40,
        width: 600,
        height: 50,
        title: "title",
        fontSize: 20,
        fontWeight: "normal",
        fontColor: {
          r: "255",
          g: "255",
          b: "255",
          a: "1"
        },
        // bgColor: {
        //   r: "0",
        //   g: "0",
        //   b: "0",
        //   a: "1"
        // },
        bgImg: "titlebg1",
      })
    },

    resizeContainerTitleAction: (state, action) => {
      let index = state.containerTitle.findIndex((title) => title.id === action.payload.id);
      state.containerTitle[index].width = action.payload.width;
      state.containerTitle[index].height = action.payload.height;
    },
    dragContainerTitleAction: (state, action) => {
      let index = state.containerTitle.findIndex((title) => title.id === action.payload.id);
      state.containerTitle[index].top = action.payload.top;
      state.containerTitle[index].left = action.payload.left;
    },

    resizePageTitleAction: (state, action) => {
      let index = state.pageTitle.findIndex((title) => title.id === action.payload.id);
      state.pageTitle[index].width = action.payload.width;
      state.pageTitle[index].height = action.payload.height;
    },
    dragPageTitleAction: (state, action) => {
      let index = state.pageTitle.findIndex((title) => title.id === action.payload.id);
      state.pageTitle[index].top = action.payload.top;
      state.pageTitle[index].left = action.payload.left;

    },
    setTitleContentAction: (state, action) => {
      let index = state[action.payload.type].findIndex((title) => title.id === action.payload.id);
      state[action.payload.type][index].title = action.payload.title;

    },
    setFontSizeAction: (state, action) => {
      let index = state[action.payload.type].findIndex((title) => title.id === action.payload.id);
      state[action.payload.type][index].fontSize = action.payload.fontSize;
    },
    setFontWeightAction: (state, action) => {
      let index = state[action.payload.type].findIndex((title) => title.id === action.payload.id);
      state[action.payload.type][index].fontWeight = action.payload.fontWeight;
    },
    setTitleBgColorAction: (state, action) => {
      let index = state[action.payload.type].findIndex((title) => title.id === action.payload.id);
      state[action.payload.type][index].bgColor = action.payload.color;
    },
    setFontColorAction: (state, action) => {
      let index = state[action.payload.type].findIndex((title) => title.id === action.payload.id);
      state[action.payload.type][index].fontColor = action.payload.fontColor;
    },
    setTitleBgImgAction: (state, action) => {
      let index = state[action.payload.type].findIndex((title) => title.id === action.payload.id);
      state[action.payload.type][index].bgImg = action.payload.bgImg;
    },
    //单独删除title操作的action
    deleteSingleTitleAction: (state, action) => {
      let index = state[action.payload.type].findIndex((title) => title.id === action.payload.id);
      state[action.payload.type].splice(index, 1);
    },
    //在删除容器时打包删除容器内部所有title的action
    deleteBundleTitlesAction: (state, action) => {
      state.containerTitle = state.containerTitle.filter((title) => title.link != action.payload);
    }
  },
});

export const {
  addContainerTitle,
  addPageTitleAction,
  resizeContainerTitleAction,
  resizePageTitleAction,
  dragContainerTitleAction,
  dragPageTitleAction,
  setTitleContentAction,
  setFontSizeAction,
  setFontWeightAction,
  setTitleBgColorAction,
  setFontColorAction,
  setTitleBgImgAction,
  deleteSingleTitleAction,
  deleteBundleTitlesAction
} = titleSlice.actions;

export const titleReducer = titleSlice.reducer;

//画布状态slice函数
export const pageSlice = createSlice({
  name: "page",
  initialState: {
    type: "pageCanvas",
    title: "画布",
    autoLayout: true,
    minWidth: 1280, 
    minHeight: 800,
    width: 1280,
    height: 800,
    bgColor: {
      r: "255",
      g: "255",
      b: "255",
      a: "1"
    },
    bgImg: "bg"
  },
  reducers: {
    setAutoLayout: (state, action) => {

      state.autoLayout = action.payload;
      state.width = state.minWidth;
      state.height = state.minHeight;
    },

    setCustomLayout: (state, action) => {
      state[action.payload.current] = action.payload.value
    },

    setBgImg: (state, action) => {
      state.bgImg = action.payload;
    },

    setBgColor: (state, action) => {
      state.bgColor = action.payload;
    }
  },
});

export const { setAutoLayout, setCustomLayout, setBgImg, setBgColor } = pageSlice.actions;

export const pageReducer = pageSlice.reducer;

//当前focus状态slice函数
const initialState = {
  type: "pageCanvas",
  id: null,
}
export const focusOnSlice = createSlice({
  name: "focusOn",
  initialState: initialState,
  reducers: {
    focusOnAction: (state, action) => {
      state.type = action.payload.type,
      state.id = action.payload.id
    },
    focusOffAction: (state) => {
      state.id = null,
      state.isFocus = false
    }
  }
});

export const { focusOnAction, focusOffAction } = focusOnSlice.actions;

export const setCurrentFocusReducer = focusOnSlice.reducer;