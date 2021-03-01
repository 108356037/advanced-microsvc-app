import axios from 'axios'

const LandingPage = () => {
    // console.log(currentUser)
    axios.get('/api/users/currentuser')
    // console.log(response)
    return <h1>Landing Page</h1>
}

// LandingPage.getInitialProps = async () => {
//     const response = await axios.get('/api/users/currentuser')

//     return response.data
// }

export default LandingPage