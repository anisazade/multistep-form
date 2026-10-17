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
    addones: addonesType;
}
interface addonesType {
    online_services: boolean;
    large_storage: boolean;
    custom_profile: boolean;
}
type addonesprop = 'online_services' | 'large_storage' | 'custom_profile';
type billingType = 'yearly' | 'monthly';
type planType = 'arcade' | 'advanced' | 'pro';

export default function SubscriptionForm() {
    const [step, setStep] = useState(1);
    const next_button = useRef(null);
    const [form_data, setData] = useState<formDataType>({
        name: '',
        email: '',
        phone_number: '',
        plan: 'arcade',
        billing: 'monthly',
        addones: {
            online_services: true,
            large_storage: true,
            custom_profile: false,
        },
    });

    function setForm1(data_name: 'name' | 'email' | 'phone_number', data_value: string) {
        setData({ ...form_data, [data_name]: data_value });
    }

    function setForm2(data_name: 'plan' | 'billing', data_value: planType | billingType) {
        setData({ ...form_data, [data_name]: data_value });
    }

    function setForm3(data_name: addonesprop, data_value: boolean) {
        setData({ ...form_data, addones: { ...form_data.addones, [data_name]: data_value } });
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

                    {step === 3 && (
                        <Form_3
                            billing={form_data.billing}
                            onChange={setForm3}
                            addones={form_data.addones}
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
    onChange: (data_name: 'name' | 'email' | 'phone_number', data_value: string) => void;
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
                            onChange('name', event.target.value);
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
                            onChange('email', event.target.value);
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
                            onChange('phone_number', event.target.value);
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
    onChange: (data_name: 'plan' | 'billing', data_value: planType | billingType) => void;
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
                        <span className="heading-primary">Arcade</span>
                        <span className="heading-secondary">{prices.arcade}</span>
                    </label>
                    <input
                        id="radio-1"
                        type="radio"
                        name="plan-type"
                        value="arcade"
                        checked={plan === 'arcade'}
                        onChange={(event) => {
                            onChange('plan', event.target.value as planType);
                        }}
                        required
                    />
                </div>
                <div className="radio-box">
                    <Image src="/icon-advanced.svg" height={40} width={40} alt="" />
                    <label htmlFor="radio-2">
                        <span className="heading-primary">Advanced</span>
                        <span className="heading-secondary">{prices.advanced}</span>
                    </label>
                    <input
                        id="radio-2"
                        type="radio"
                        name="plan-type"
                        value="advanced"
                        checked={plan === 'advanced'}
                        onChange={(event) => {
                            onChange('plan', event.target.value as planType);
                        }}
                        required
                    />
                </div>
                <div className="radio-box">
                    <Image src="/icon-pro.svg" height={40} width={40} alt="" />
                    <label htmlFor="radio-3">
                        <span className="heading-primary">Pro</span>
                        <span className="heading-secondary">{prices.pro}</span>
                    </label>
                    <input
                        id="radio-3"
                        type="radio"
                        name="plan-type"
                        value="pro"
                        checked={plan === 'pro'}
                        onChange={(event) => {
                            onChange('plan', event.target.value as planType);
                        }}
                        required
                    />
                </div>
            </div>
            <div className="switch-box">
                <label
                    htmlFor="monthly-billing"
                    data-switch-mode={billing === 'monthly' ? 'on' : 'off'}
                >
                    Monthly
                </label>
                <div className="switch-key">
                    <div
                        className="overlay"
                        onClick={() => {
                            if (billing === 'monthly') {
                                onChange('billing', 'yearly');
                            } else {
                                onChange('billing', 'monthly');
                            }
                        }}
                    ></div>
                    <input
                        type="radio"
                        name="billing"
                        value="monthly"
                        id="monthly-billing"
                        data-switch-mode="left"
                        checked={billing === 'monthly'}
                        onChange={(event) => {
                            onChange('billing', event.target.value as billingType);
                        }}
                        required
                    />
                    <input
                        type="radio"
                        name="billing"
                        id="yearly-billing"
                        value="yearly"
                        data-switch-mode="right"
                        checked={billing === 'yearly'}
                        onChange={(event) => {
                            onChange('billing', event.target.value as billingType);
                        }}
                        required
                    />
                </div>
                <label
                    htmlFor="yearly-billing"
                    data-switch-mode={billing === 'yearly' ? 'on' : 'off'}
                >
                    Yearly
                </label>
            </div>
        </div>
    );
}

function Form_3({
    addones,
    billing,
    onChange,
}: {
    addones: addonesType;
    billing: billingType;
    onChange: (prop: addonesprop, value: boolean) => void;
}) {
    const prices =
        billing === 'monthly'
            ? {
                  online_service: '+$1/mo',
                  large_storage: '+$2/mo',
                  custom_profile: '+$2/mo',
              }
            : {
                  online_service: '+$10/yr',
                  large_storage: '+$20/yr',
                  custom_profile: '+$20/yr',
              };

    return (
        <div className="stack-400">
            <div className="stack-200">
                <h1>Pick add-ones</h1>
                <p className="form_description">Add-ones help enhance your gaming experience.</p>
            </div>
            <div className="stack-300">
                <div className="checkbox">
                    <input
                        id="checkbox-1"
                        name="add-ones"
                        value="online_services"
                        type="checkbox"
                        checked={addones.online_services}
                        onChange={(event) => {
                            onChange(event.target.value as addonesprop, event.target.checked);
                        }}
                    />
                    <label htmlFor="checkbox-1">
                        <div>
                            <span className="heading-primary">Online service</span>
                            <span className="heading-secondary">Access to multiplayer games</span>
                        </div>
                        <span className="heading-thirdnary">{prices.online_service}</span>
                    </label>
                </div>
                <div className="checkbox">
                    <input
                        id="checkbox-2"
                        name="add-ones"
                        value="large_storage"
                        checked={addones.large_storage}
                        onChange={(event) => {
                            onChange(event.target.value as addonesprop, event.target.checked);
                        }}
                        type="checkbox"
                    />
                    <label htmlFor="checkbox-2">
                        <div>
                            <span className="heading-primary">Larger storage</span>
                            <span className="heading-secondary">Extra 1TB of cloud save</span>
                        </div>
                        <span className="heading-thirdnary">{prices.large_storage}</span>
                    </label>
                </div>
                <div className="checkbox">
                    <input
                        id="checkbox-3"
                        name="add-ones"
                        value="custom_profile"
                        checked={addones.custom_profile}
                        onChange={(event) => {
                            onChange(event.target.value as addonesprop, event.target.checked);
                        }}
                        type="checkbox"
                    />
                    <label htmlFor="checkbox-3">
                        <div>
                            <span className="heading-primary">Customizable profile</span>
                            <span className="heading-secondary">Custom theme on your profile</span>
                        </div>
                        <span className="heading-thirdnary">{prices.custom_profile}</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
