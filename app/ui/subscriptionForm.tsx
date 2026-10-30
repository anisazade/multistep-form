'use client';
import Image from 'next/image';

import { useRef, useState, useEffect } from 'react';
import Sidebar from '@/app/ui/sidebar';
import formInfo from '@/app/data/formInfo';

const form_steps = formInfo.steps;
const plans = formInfo.plans;
const addones = formInfo.addones;

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

const initial_form_value: formDataType = {
    name: '',
    email: '',
    phone_number: '',
    plan: plans[0].title,
    billing: 'monthly',
    addones: {
        [addones[0].title]: true,
        [addones[1].title]: true,
        [addones[2].title]: false,
    },
};

export default function SubscriptionForm() {
    const [step, setStep] = useState(1);
    const next_button = useRef(null);
    const confirm_button = useRef(null);
    const [form_data, setData] = useState<formDataType>(initial_form_value);

    function setForm1(data_name: 'name' | 'email' | 'phone_number', data_value: string) {
        setData({ ...form_data, [data_name]: data_value });
    }

    function setForm2(data_name: 'plan' | 'billing', data_value: planType | billingType) {
        setData({ ...form_data, [data_name]: data_value });
    }

    function setForm3(data_name: addonesType, data_value: boolean) {
        setData({ ...form_data, addones: { ...form_data.addones, [data_name]: data_value } });
    }

    function goToStep(step_num:number) {
        setStep(step_num);
    }

    useEffect(() => {
        const session_form = sessionStorage.getItem('form_data');
        const form_data_str = JSON.stringify(form_data);

        // set session value if form data is updated by user
        if (form_data !== initial_form_value) {
            sessionStorage.setItem('form_data', form_data_str);
        }
        // if the session value exists and the form is on the initial state, set the form value
        else if (session_form) {
            try{
                setData(JSON.parse(session_form));
            }
            catch(error){
                console.error(error)
            }
        }
    }, [form_data]);

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
                        setStep((step)=>step + 1);
                    } else if (event.nativeEvent.submitter === confirm_button.current) {
                        setStep(5);
                        setData(initial_form_value);
                        sessionStorage.setItem('form_data', '');
                    }
                    console.log(event.type);
                }}
            >
                <Sidebar steps={formInfo.steps.slice(0, -1).map((step)=> step.sidebar_title)} active_step={step} stepChange={goToStep}/>
                <div className="form__main">
                    <div className={step === 5 ? 'thanks-page' : 'stack-400'}>
                        {step === 5 && (
                            <Image
                                className="icon_big"
                                src={`/icon-thank-you.svg`}
                                height={80}
                                width={80}
                                alt=""
                            />
                        )}
                        <div className="stack-200">
                            <h1>{form_steps[step - 1].title}</h1>
                            <p className="form__description">{form_steps[step - 1].description}</p>
                        </div>

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
                            />
                        )}
                    </div>
                </div>

                {step !== 5 && (
                    <div className="form__buttons">
                        {step === 4 ? (
                            <button ref={confirm_button} className="button button--light">
                                Confirm
                            </button>
                        ) : (
                            <button ref={next_button} className="button button--dark">
                                Next Step
                            </button>
                        )}

                        {step !== 1 && (
                            <button
                                className="button button--white"
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
                )}
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
        <div className="stack-300">
            <div className="input-box">
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
            <div className="input-box">
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
            <div className="input-box">
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
    const price_postfix = `/${billing === 'monthly' ? 'mo' : 'yr'}`;
    return (
        <>
            <div className="radio-group">
                {plans.map((plan, i) => {
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
                    />
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
        </>
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
    const price_postfix = `/${billing === 'monthly' ? 'mo' : 'yr'}`;
    return (
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
                                onChange(event.target.value as addonesType, event.target.checked);
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
    );
}

function Form_4({
    selected_plan,
    addones_value,
    billing,
}: {
    selected_plan: planType;
    addones_value: addonesFormType;
    billing: billingType;
}) {
    const price_postfix = `/${billing === 'monthly' ? 'mo' : 'yr'}`;
    const selected_plan_price = plans.find((plan) => plan.title === selected_plan)?.price[
        billing
    ] as number;
    let total_cost: number = selected_plan_price;
    addones.forEach((addone) => {
        if (addones_value[addone.title]) {
            total_cost += addone.price[billing];
        }
    });
    return (
        <>
            <ul className="order-list">
                <li>
                    <span className="heading-primary">{`${selected_plan} (${billing})`}</span>
                    <span className="heading-primary">{`${selected_plan_price}${price_postfix}`}</span>
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
                <span className="heading-secondary">{`Total (per ${billing.slice(0, -2)})`}</span>
                <span className="heading-thirdnary">{`+${total_cost}${price_postfix}`}</span>
            </div>
        </>
    );
}
