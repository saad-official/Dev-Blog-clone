// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from 'next'
// {
//   res.status(200).json({ name: 'John Doe' })
// }
export default async (req, res) => {
  res.statusCode = 200;
  res.json({});
};
