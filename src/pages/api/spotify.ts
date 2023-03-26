import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}

// return await fetch(`https://api.spotify.com/v1/me/top/artists`, {
//       headers: {
//         Authorization: `Bearer ${this.accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });
