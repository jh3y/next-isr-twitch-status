export default function Home({ username, onAir }) {
  return <h1>{`${username} is ${onAir ? 'LIVE' : 'offline 😭'}`}</h1>
}

export async function getStaticProps() {
  const URL = `https://api.twitch.tv/helix/search/channels?query=${process.env.TWITCH_USERNAME}`
  const TURL = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials&scope=channel:manage:broadcast`
  const DEETS = await (await fetch(TURL, { method: 'POST' })).json()
  const RES = await (
    await fetch(URL, {
      method: 'GET',
      headers: {
        'client-id': process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${DEETS.access_token}`,
      },
    })
  ).json()
  const STREAM_INFO = RES.data.filter(
    (r) => r.id === process.env.TWITCH_BROADCASTER_ID
  )[0]
  return {
    revalidate: 1,
    props: {
      username: process.env.TWITCH_USERNAME,
      onAir: STREAM_INFO.is_live,
    },
  }
}
