import axios from 'axios'

const LandingPage = () => {
    return (<h1>Landing Page</h1>)
}

LandingPage.getInitialProps = async ({req}) => {
    console.log(req.headers)
    if (typeof window === 'undefined') {
        const { data } = await axios.get(
            'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
                headers: {
                    Host: 'ticketing.dev'
                }
            }
        )
        return data

    } else {

    }
}

export default LandingPage