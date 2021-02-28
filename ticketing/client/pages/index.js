const LandingPage =  ({ color }) => {
    console.log(color)
    return <h1>Landing Page</h1>
}

LandingPage.getInitialProps = () => {
    console.log('In the server side now')
    return { color: 'red'}
}

export default LandingPage