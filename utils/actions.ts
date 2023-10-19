import axios from 'axios'
const subscribe = async (streamer: string) => {
  try {
    const response = await axios.post('/api/subscribe', { streamer: streamer })
    return response.data.response
  } catch (error: any) {
    throw new Error(error.response.data.response)
  }
}


const deleteSub = async (streamer: string) => {
  try {
    const response = await axios.delete('/api/unsubscribe', {
      data: {
        streamer
      }
    }
    )
    console.log(response.data.response)
    return response.data.response
  } catch (error: any) {
    throw new Error(error.response.data.response)
  }
}




export { subscribe, deleteSub }