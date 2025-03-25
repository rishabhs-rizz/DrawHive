import axios from "axios";

async function getRoomId(slug: string) {
  const response = await axios.get(`http://localhost:5000/room/${slug}`);
  console.log(response.data);
  return response.data.id;
}

export default async function CallsServer({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug; //returns a promise, await was needed
  const roomId = getRoomId(slug);
}
