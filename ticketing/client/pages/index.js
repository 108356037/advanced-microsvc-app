import axios from 'axios'

const LandingPage = () => {
    // axios.get("/api/users/currentuser")
    return (<h1>Landing Page</h1>)
}

LandingPage.getInitialProps = async ({req}) => {
    console.log(req.headers)
    if (typeof window === 'undefined') {
        const { data } = await axios.get(
            'http://ingress.ingress.svc.cluster.local/api/users/currentuser', 
            {
                headers: req.headers
            }
        )
        return data

    } else {
        const { data } = await axios.get("/api/users/currentuser");
        console.log(data)
        return data
    }

}

export default LandingPage