export interface Chat {
    user1:string,
    user2:string,
    message: Message
}

export interface Message {
    user:string
    date: Date
    message: string
}

export interface Chats {
    user1:string,
    user2:string,
    messages: [Message]  
}