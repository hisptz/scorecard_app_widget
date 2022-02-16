import { atom, selector } from "recoil";


const scorecardWidgetState = atom({
    key: "scorecardWidgetState",
    default:""
})



const scoreCardWidgetState = selector({
    key: "scoreCardWidgetSelectorState",
    get:({get})=>{
        return get(scorecardWidgetState)
    },
    set:({set},newValue)=>{
        set(scorecardWidgetState,newValue)
    }
})

export {scoreCardWidgetState}