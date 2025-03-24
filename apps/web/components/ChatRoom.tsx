import axios from "axios";

async function getChats(roomId: string) {
  const response = await axios.get(`http://localhost:5000/chats/${roomId}`);
  return response.data.chats;
}

export async function ChatRoom({ id }: { id: string }) {
  const chats = await getChats(id);
}
