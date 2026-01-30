import React, { useState } from "react";

import './Auth.css'
import icon from '../../../assets/icon.png'
const Auth = () => {

    const [isSignup, setIsSignup] = useState(false)

    const handleSwitch = () => {
        setIsSignup(!isSignup)
    }
    return(
        <section className="auth-section">
            <div className="auth-container">
               
                {isSignup && <img src={icon} alt="stack overflow" className="login-logo"/>}
                <form >
                    {
                        isSignup && (
                            <label htmlFor="name">
                                <h4>Display Name</h4>
                                <input type="text" id="name" name="name"></input>
                            </label>
                        )
                    
                    }
                    <label htmlFor="email">
                        <h4>Email</h4>
                        <input type="text" name="email" id="email" />
                    </label>
                     <label htmlFor="password">
                        <div>
                            <h4>Password</h4>
                            { !isSignup && <h4>forgot password?</h4>}

                        </div>
                        <input type="password" name="password" id="paasword" />
                        {isSignup && <p>Password must be contain at least eight <br />chracter,including  at 1 later and 1 <br />
                         number</p>}
                    </label>
                    {
                        isSignup && (
                            <label htmlFor="check">
                                <input type="checkbox" id="check" />
                                <p>Opt-in receive occasional,<br />
                                product updates, user research invitation, <br />
                                company announcenents, and digests
                                </p>
                            </label>
                        )
                    }
                    <button type="submit" className="auth-btn">{isSignup ? 'Sign up' : 'log in' }</button>
                    {
                        isSignup && (
                            <p>
                                By clicking "Sign up",you agree to our terms of service ,privacy policy anf cookies policy
                            </p>
                        )
                    }
                </form>
                <p>
                    {isSignup ? 'already have an account?' : "Don't have an account"}
                    <button type='button' className="auth-btn" onClick={handleSwitch}>{isSignup ? "Log in" : 'sign up'}</button>
                </p>
            </div>
        </section>
    )
}
export default Auth