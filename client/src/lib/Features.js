import moment from "moment"
const fileFormat=(url)=>{

    const ext=url.split('.').pop()

    if(ext==="mp4"||ext==="ogg"||ext==="webm"){
        return "video"
    }
    if(ext==="mp3"||ext==="wav"||ext==="audio"){
        return "audio"
    }
    if(ext==="png"||ext==="jpg"||ext==="jpeg"||ext==="gif"){
        return "image"
    }
    return "file"
}
const getLast7Days=()=>{
    const currentDate=moment()
    const last7days=[]
    for(let i=0;i<7;i++){
        const dayDate=currentDate.clone().subtract(i,"days")
        const dayName=dayDate.format("dddd")
        last7days.unshift(dayName)
    }
    console.log(last7days)
    return last7days
}
const transformImage=((url="",width=100)=>url)
export {fileFormat,transformImage,getLast7Days}