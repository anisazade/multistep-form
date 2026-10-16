'use client';
import Image from 'next/image';

import { useRef, useState } from 'react';
import Sidebar from '@/app/ui/sidebar';

interface formDataType {
    name: string;
    email: string;
    phone_number: string;
    plan: planType;
    billing: billingType;
}

type billingType = string;
type planType = string;

export default function SubscriptionForm() {
    const [step, setStep] = useState(1);
    const next_button = useRef(null);
    const [form_data, setData] = useState<formDataType>({
        name: '',
        email: '',
        phone_number: '',
        plan: 'arcade',
        billing: 'monthly',
    });

    function setForm1({
        name = form_data.name,
        email = form_data.email,
        phone_number = form_data.phone_number,
    }) {
        setData({ ...form_data, name, email, phone_number });
    }

    function setForm2({ plan = form_data.plan, billing = form_data.billing }) {
        setData({ ...form_data, plan, billing });
        console.log(plan);
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
                    {step === 1 && (
                        <Form_1
                            name={form_data.name}
                            email={form_data.email}
                            phone_number={form_data.phone_number}
                            onChange={setForm1}
                        />
                    )}

                    {step === 2 && (
                        <Form_2
                            plan={form_data.plan}
                            billing={form_data.billing}
                            onChange={setForm2}
                        />
                    )}

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
                    <span className="validation-message"></span>
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
                    <span className="validation-message"></span>
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
                            } else {
                                setValidity({
                                    ...validity,
                                    email: 'valid',
                                });
                            }

                            onChange({ email: event.target.value });
                        }}
                        required
                    />
                </div>
                <div className="control-box">
                    <label htmlFor="phone-number">Phone Number</label>
                    <span className="validation-message"></span>
                    <input
                        id="phone-number"
                        type="tel"
                        name="phone_number"
                        className="input--text"
                        value={phone_number}
                        placeholder="e.g. +1 234 567 890"
                        autoComplete="tel"
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

function Form_2({
    plan,
    billing,
    onChange,
}: {
    plan: planType;
    billing: billingType;
    onChange: ({ plan, billing }: { plan?: planType; billing?: billingType }) => void;
}) {
    const prices =
        billing === 'monthly'
            ? {
                  arcade: '$9/mo',
                  advanced: '$12/mo',
                  pro: '$15/mo',
              }
            : {
                  arcade: '$90/yr',
                  advanced: '$120/yr',
                  pro: '$150/yr',
              };

    return (
        <div className="stack-400">
            <div className="stack-200">
                <h1>Select your plan</h1>
                <p className="form_description">
                    You have the option of monthly or yearly billing.
                </p>
            </div>
            <div className="flex-300">
                <div className="radio-box">
                    <Image src="/icon-arcade.svg" height={40} width={40} alt="" />
                    <label htmlFor="radio-1">
                        <span className="plan-name">Arcade</span>
                        <span className="plan-cost">{prices.arcade}</span>
                    </label>
                    <input
                        id="radio-1"
                        type="radio"
                        name="plan-type"
                        value="arcade"
                        checked={plan === 'arcade'}
                        onChange={(event) => {
                            onChange({ plan: event.target.value });
                        }}
                        required
                    />
                </div>
                <div className="radio-box">
                    <Image src="/icon-advanced.svg" height={40} width={40} alt="" />
                    <label htmlFor="radio-2">
                        <span>Advanced</span>
                        <span className="plan-cost">{prices.advanced}</span>
                    </label>
                    <input
                        id="radio-2"
                        type="radio"
                        name="plan-type"
                        value="advanced"
                        checked={plan === 'advanced'}
                        onChange={(event) => {
                            onChange({ plan: event.target.value });
                        }}
                        required
                    />
                </div>
                <div className="radio-box">
                    <Image src="/icon-pro.svg" height={40} width={40} alt="" />
                    <label htmlFor="radio-3">
                        <span>Pro</span>
                        <span className="plan-cost">{prices.pro}</span>
                    </label>
                    <input
                        id="radio-3"
                        type="radio"
                        name="plan-type"
                        value="pro"
                        checked={plan === 'pro'}
                        onChange={(event) => {
                            onChange({ plan: event.target.value });
                        }}
                        required
                    />
                </div>
            </div>
            <div className="switch-box">
                <label htmlFor="monthly-billing">Monthly</label>
                <input
                    type="radio"
                    name="billing"
                    value="monthly"
                    id="monthly-billing"
                    checked={billing === 'monthly'}
                    onChange={(event) => {
                        onChange({ billing: event.target.value });
                    }}
                    required
                />

                <input
                    type="radio"
                    name="billing"
                    id="yearly-billing"
                    value="yearly"
                    checked={billing === 'yearly'}
                    onChange={(event) => {
                        onChange({ billing: event.target.value });
                    }}
                    required
                />
                <label htmlFor="yearly-billing">Yearly</label>
            </div>
        </div>
    );
}
