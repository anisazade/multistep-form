'use client';

import { useRef, useState } from 'react';
import Sidebar from '@/app/ui/sidebar';

export default function SubscriptionForm() {
    const [step, setStep] = useState(1);
    const next_button = useRef(null);
    return (
        <>
            <form noValidate onSubmit={(event)=>{
                event.preventDefault();
                if(event.currentTarget.checkValidity() && event.nativeEvent.submitter === next_button.current){
                    setStep(step + 1);
                }
                console.log(event.type);
            }}>
                <Sidebar active_step={step} />
                <div className="form__main">
                    <Form_1 />

                    <div className="form__buttons">
                        {step == 4 && <button className="button-light">Confirm</button>}

                        {step != 4 && (
                            <button
                                ref={next_button}
                                className="button-dark"
                            >
                                Next Step
                            </button>
                        )}

                        {step != 1 && (
                            <button
                                className="button-white"
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    setStep(step - 1);
                                }}
                            >
                                Go Back
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
}

function Form_1() {
    return (
        <div className="stack-400">
            <div className="stack-200">
                <h1>Personal info</h1>
                <p className="form_description">
                    Please provide your name, email address, and phone number.
                </p>
            </div>
            <div className="stack-300">
                <div className="control-box">
                    <label htmlFor="name">Name</label>
                    <span className="marker-required"></span>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        className="input--text"
                        placeholder="e.g. Stephen King"
                        required
                    />
                </div>
                <div className="control-box">
                    <label htmlFor="email-address">Email Address</label>
                    <span className="marker-required"></span>
                    <input
                        id="email-address"
                        type="email"
                        name="email"
                        className="input--text"
                        placeholder="e.g. stephenking@lorem.com"
                        required
                    />
                </div>
                <div className="control-box">
                    <label htmlFor="phone-number">Phone Number</label>
                    <span className="marker-required"></span>
                    <input
                        id="phone-number"
                        type="tel"
                        name="phone_number"
                        className="input--text"
                        placeholder="e.g. +1 234 567 890"
                        required
                    />
                </div>
            </div>
        </div>
    );
}
