import axios from "axios";

export async function getExistingShapes(roomId: string) {
  console.log("Fetching shapes for roomId:", roomId);
  try {
    const res = await axios.get(`http://localhost:5000/chats/${roomId}`);
    const data = res.data.chats || [];
    console.log(res.data.chats);

    const shapes = data.map((x: { message: string }) => {
      const messageData = JSON.parse(x.message);
      return messageData;
    });

    return shapes;
  } catch (e) {
    console.error("Error in getExistingShapes:", e);
    return [];
  }
}
