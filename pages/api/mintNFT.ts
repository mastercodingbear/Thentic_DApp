// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { AxiosResponse } from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'

type RequestData = {
  contract: string,
  id: number,
  data: string,
}

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AxiosResponse>
) {
  try {
    await runMiddleware(req, res, cors)

    const query = req.query;
    const response = await axios
      .post('https://thentic.tech/api/nfts/mint', {
        key: process.env.NEXT_PUBLIC_THENTIC_KEY,
        chain_id: 97,
        contract: req.query.contract,
        nft_id: req.query.nft_id,
        nft_data: req.query.nft_data,
        to: req.query.to
      });
    res.status(200).json(response.data)
  } catch (error: any) {
    console.error(error)
    return res.status(error.status || 500).end(error.message)
  }
}
