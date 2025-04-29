import axios from "axios";

export function generateSlug(roomID: string | number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let slug = "";
  let hash = Math.abs(hashCode(roomID.toString())); // Ensure positive hash

  while (slug.length < 10) {
    slug += characters[hash % characters.length];
    hash = Math.floor(hash / characters.length);
  }

  return slug;
}

// Standalone hashCode function
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 9) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return hash;
}

export const handleCreateRoom = async (
  roomName: string,
  slug: string,
  setSlug: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!roomName) return alert("Enter room name");
  console.log("Creating room with name:", roomName);
  const token = localStorage.getItem("token");
  const response = await axios.post(
    "http://localhost:5000/createRoom",
    { name: roomName },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = response.data;
  const roomId = data.roomID;
  const generatedSlug = generateSlug(roomId);
  setSlug(generatedSlug);
  navigator.clipboard.writeText(slug);
};

export const handleCopy = (slug: string) => {
  navigator.clipboard.writeText(slug);
  alert("Slug copied to clipboard!");
};
