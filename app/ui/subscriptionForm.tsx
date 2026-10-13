'use client';

import { useRef, useState } from 'react';
import Sidebar from '@/app/ui/sidebar';

export default function SubscriptionForm() {
    const [step, setStep] = useState(1);
    const next_button = useRef(null);
    const [form_data, setData] = useState({
        name: '',
        email: '',
        phone_number: '',
    });

    function setForm1({
        name = form_data.name,
        email = form_data.email,
        phone_number = form_data.phone_number,
    }) {
        setData({ ...form_data, name, email, phone_number });
    }

    return (
        <>
            <form
                noValidate
                onSubmit={(event) => {
                    event.preventDefault();
                    if (
                        event.currentTarget.checkValidity() &&
                        event.nativeEvent.submitter === next_button.current
                    ) {
                        setStep(step + 1);
                    }
                    console.log(event.type);
                }}
            >
                <Sidebar active_step={step} />
                <div className="form__main">
                    <Form_1
                        name={form_data.name}
                        email={form_data.email}
                        phone_number={form_data.phone_number}
                        onChange={setForm1}
                    />
                    <div className="form__buttons">
                        {step == 4 && <button className="button-light">Confirm</button>}

                        {step != 4 && (
                            <button ref={next_button} className="button-dark">
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

function Form_1({
    name,
    email,
    phone_number,
    onChange,
}: {
    name: string;
    email: string;
    phone_number: string;
    onChange: ({
        name,
        email,
        phone_number,
    }: {
        name?: string;
        email?: string;
        phone_number?: string;
    }) => void;
}) {
    const [validity, setValidity] = useState({
        name: 'valid',
        email: 'valid',
        phone_number: 'valid',
    });
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
                        name="full-name"
                        value={name}
                        className="input--text"
                        placeholder="e.g. Stephen King"
                        autoComplete="name"
                        data-invalid-type={validity.name}
                        onChange={(event) => {
                            onChange({ name: event.target.value });
                        }}
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
                        value={email}
                        className="input--text"
                        placeholder="e.g. stephenking@lorem.com"
                        data-invalid-type={validity.email}
                        onChange={(event) => {
                            if (!event.target.checkValidity()) {
                                setValidity({
                                    ...validity,
                                    email: event.target.validity.typeMismatch
                                        ? 'typemissmatch'
                                        : 'failed',
                                });
                            }
                            else{
                                setValidity({
                                    ...validity,
                                    email: 'valid'
                                });
                            }

                            onChange({ email: event.target.value });
                        }}
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
                        value={phone_number}
                        placeholder="e.g. +1 234 567 890"
                        data-invalid-type={validity.phone_number}
                        onChange={(event) => {
                            onChange({ phone_number: event.target.value });
                        }}
                        required
                    />
                </div>
            </div>
        </div>
    );
}
