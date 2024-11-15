export const SampleChats = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Jhon Doe",
        _id: "1",
        groupChat: false,
        member: ["1", "2"]
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Rohan Deep",
        _id: "2",
        groupChat: false,
        member: ["1", "2"]

    }

]


export const SampleNotifications = [
    {
        sender: {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "Jhon Doe",
        },
        _id: "1",

    },
    {
        sender: {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "Rohan Deep",
        },
        _id: "2",

    }
]

export const SampleMessages=[
    {
        attachments:[{
            public_id:"sdfsf",
            url:"https://www.w3schools.com/howto/img_avatar.png",
        }],
        content:"Sample Message by another person",
        _id:"sfsdnfkmsf,",
        sender:{
            _id:"sdfnsdfksdfk",
            name:"Ayush"
        },
        chatId:"dsfsf,dsmf,sd",
        createdAt:"Tue Oct 08 2024 15:03:12 GMT+0530 (India Standard Time) "
    },
    {
        attachments:[{
            public_id:"sdfsf",
            url:"https://www.w3schools.com/howto/img_avatar.file",
        }],
        content:"Sample Message",
        _id:"sfsdnfkmsf,sd",
        sender:{
            _id:"random",
            name:"Suman"
        },
        chatId:"dsfsf,dsmf,sd",
        createdAt:"Tue Oct 08 2024 15:33:10 GMT+0530 (India Standard Time)"
    }
]


export const SampleUsers=[
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Jhon Doe",
        _id: "1",

    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Rohan Deep",
        _id: "2",
        
    }
]

export const dashboardData={
    users:[
        {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Jhon Doe",
        _id: "1",
        username:"jhone_doe",
        friends:20,
        groups:5,
    },
    {   avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "Rohan Deep",
        _id: "2",
        username:"rohan_deep",
        friends:20,
        groups:5,
    }
    ]
}
