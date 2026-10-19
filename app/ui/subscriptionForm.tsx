'use client';
import Image from 'next/image';

import { useRef, useState } from 'react';
import Sidebar from '@/app/ui/sidebar';

const plans = [
    {
        title: 'arcade',
        price: {
            monthly: 9,
            yearly: 90,
        },
    },
    {
        title: 'advanced',
        price: {
            monthly: 12,
            yearly: 120,
        },
    },
    {
        title: 'pro',
        price: {
            monthly: 15,
            yearly: 150,
        },
    },
] as const;
const addones = [
    {
        title: 'online service',
        description: 'Access to multiplayer games',
        price: {
            monthly: 1,
            yearly: 10,
        },
    },
    {
        title: 'larger storage',
        description: 'Extra 1TB of cloud save',
        price: {
            monthly: 2,
            yearly: 20,
        },
    },
    {
        title: 'customizable profile',
        description: 'Custom theme on your profile',
        price: {
            monthly: 2,
            yearly: 20,
        },
    },
] as const;

type billingType = 'yearly' | 'monthly';
type planType = (typeof plans)[number]['title'];
type addonesType = (typeof addones)[number]['title'];

type addonesFormType = Record<(typeof addones)[number]['title'], boolean>;

interface formDataType {
    name: string;
    email: string;
    phone_number: string;
    plan: planType;
    billing: billingType;
    addones: addonesFormType;
}

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
            [addones[0].title]: true,
            [addones[1].title]: true,
            [addones[2].title]: false,
        },
    });

    function setForm1(data_name: 'name' | 'email' | 'phone_number', data_value: string) {
        setData({ ...form_data, [data_name]: data_value });
    }

    function setForm2(data_name: 'plan' | 'billing', data_value: planType | billingType) {
        setData({ ...form_data, [data_name]: data_value });
    }

    function setForm3(data_name: addonesType, data_value: boolean) {
        setData({ ...form_data, addones: { ...form_data.addones, [data_name]: data_value } });
    }

    function goToStep2(){
        setStep(2);
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
                            selected_plan={form_data.plan}
                            billing={form_data.billing}
                            onChange={setForm2}
                        />
                    )}

                    {step === 3 && (
                        <Form_3
                            billing={form_data.billing}
                            onChange={setForm3}
                            addones_value={form_data.addones}
                        />
                    )}

                    {step === 4 && (
                        <Form_4
                            billing={form_data.billing}
                            selected_plan={form_data.plan}
                            addones_value={form_data.addones}
                            onClick={goToStep2}
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
    selected_plan,
    billing,
    onChange,
}: {
    selected_plan: planType;
    billing: billingType;
    onChange: (data_name: 'plan' | 'billing', data_value: planType | billingType) => void;
}) {
    const price_postfix= `/${billing==="monthly"? 'mo' : 'yr'}`
    return (
        <div className="stack-400">
            <div className="stack-200">
                <h1>Select your plan</h1>
                <p className="form_description">
                    You have the option of monthly or yearly billing.
                </p>
            </div>
            <div className="flex-300">
                {plans.map((plan,i) => {
                    return (
                        <div key={plan.title} className="radio-box">
                            <Image src={`/icon-${plan.title}.svg`} height={40} width={40} alt="" />
                            <label htmlFor={`radio-1${i}`}>
                                <span className="heading-primary">{plan.title}</span>
                                <span className="heading-secondary">{`${plan.price[billing]}${price_postfix}`}</span>
                            </label>
                            <input
                                id={`radio-1${i}`}
                                type="radio"
                                name="plan-type"
                                value={plan.title}
                                checked={selected_plan === plan.title}
                                onChange={(event) => {
                                    onChange('plan', event.target.value as planType);
                                }}
                                required
                            />
                        </div>
                    );
                })}
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
    addones_value,
    billing,
    onChange,
}: {
    addones_value: addonesFormType;
    billing: billingType;
    onChange: (prop: addonesType, value: boolean) => void;
}) {
    const price_postfix= `/${billing==="monthly"? 'mo' : 'yr'}`
    return (
        <div className="stack-400">
            <div className="stack-200">
                <h1>Pick add-ones</h1>
                <p className="form_description">Add-ones help enhance your gaming experience.</p>
            </div>
            <div className="stack-300">
                {addones.map((addone, i) => {
                    return (
                        <div key={addone.title} className="checkbox">
                            <input
                                id={`checkbox-${i}`}
                                name="add-ones"
                                value={addone.title}
                                type="checkbox"
                                checked={addones_value[addone.title]}
                                onChange={(event) => {
                                    onChange(
                                        event.target.value as addonesType,
                                        event.target.checked,
                                    );
                                }}
                            />
                            <label htmlFor={`checkbox-${i}`}>
                                <span className="heading-primary">{addone.title}</span>
                                <span className="heading-thirdnary">{`+${addone.price[billing]}${price_postfix}`}</span>
                                <span className="heading-secondary">{addone.description}</span>
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function Form_4({
    selected_plan,
    addones_value,
    billing,
    onClick,
}: {
    selected_plan: planType;
    addones_value: addonesFormType;
    billing: billingType;
    onClick:()=>void;
}) {
    const price_postfix= `/${billing==="monthly"? 'mo' : 'yr'}`
    const selected_plan_price = plans.find(plan => plan.title === selected_plan)?.price[billing] as number;
    let total_cost :number= selected_plan_price;
    addones.forEach((addone) => {
                    if (addones_value[addone.title]) {
                        total_cost += addone.price[billing]
                    }
    });
    return (
        <div className="stack-400">
            <div className="stack-200">
                <h1>Finishing up</h1>
                <p className="form_description">
                    Double-check everything looks OK before confirming.
                </p>
            </div>
            <ul className="order-list">
                <li>
                    <span className="heading-primary">{`${selected_plan} (${billing})`}</span>
                    <span className="heading-primary">{`${selected_plan_price}${price_postfix}`}</span>
                    <button className="button-text" onClick={()=>{onClick();}}>Change</button>
                </li>
                {addones.map((addone) => {
                    if (addones_value[addone.title]) {
                        return (
                            <li key={addone.title}>
                                <span className="heading-secondary">{addone.title}</span>
                                <span className="font-300">{`+${addone.price[billing]}${price_postfix}`}</span>
                            </li>
                        );
                    }
                })}
            </ul>
            <div className="total-cost">
                <span className="heading-secondary">{`Total (per ${billing.slice(0,-2)})`}</span>
                <span className="heading-thirdnary">{`+${total_cost}${price_postfix}`}</span>
            </div>
        </div>
    );
}
