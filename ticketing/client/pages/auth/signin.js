import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request' 

function Page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, 
            password
        },
        onSuccess: () => Router.push('/')
    })

    // const [successResponse, setResponse] = useState('')
    const onSubmit = async (event) => {
        event.preventDefault()
        await doRequest()
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign In</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="form=control" 
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form=control" 
                    type="password"
                />
            </div>
            {/* {successResponse && (
                <div className="success success-msg">
                    <h4>Congratulations!!</h4>
                    <ul className="my-1">
                        <li>Remember your info</li>
                    </ul>
                </div>
            )} */}
            {errors}
        <button className="btn btn-primary">Sign In</button>
    </form>
)
}

export default Page