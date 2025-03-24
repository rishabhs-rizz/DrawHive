import axios from "axios";

async function getRoomId(slug: string) {
  const response = await axios.get(`http://localhost:5000/room/${slug}`);
  return response.data.id;
}

export default function CallsServer({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const roomId = getRoomId(slug);
}
