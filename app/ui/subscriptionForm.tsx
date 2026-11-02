'use client';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import Sidebar from '@/app/ui/sidebar';
import formInfo from '@/app/data/formInfo';

const form_steps = formInfo.steps;
const total_steps = form_steps.length;
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
    const [form_data, setData] = useState<formDataType>(initial_form_value);
    const [field_interacted, setInteracted] = useState({
        name: false,
        email: false,
        phone_number: false,
    });

    function setFormField(
        data_name: 'name' | 'email' | 'phone_number' | 'plan' | 'billing',
        data_value: string | planType | billingType,
    ) {
        setData({ ...form_data, [data_name]: data_value });
    }

    function setAddon(data_name: addonesType, data_value: boolean) {
        setData({ ...form_data, addones: { ...form_data.addones, [data_name]: data_value } });
    }

    function goToStep(step_num: number) {
        setStep(step_num);
    }

    function handleFiledBlur(field: 'name' | 'email' | 'phone_number') {
        setInteracted((prev) => ({ ...prev, [field]: true }));
    }

    const getFieldErrors = () => {
        const errors: { name?: string; email?: string; phone_number?: string } = {};

        //Name check
        const name = form_data.name.trim();
        if (!name) {
            errors.name = 'This field cannot be empty';
        }

        // Email check
        const email = form_data.email.trim();
        if (!email) {
            errors.email = 'This field cannot be empty';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'The entered email is invalid';
        }

        // Phone check
        const phoneDigits = form_data.phone_number.replace(/\D/g, '');
        if (!form_data.phone_number.trim()) {
            errors.phone_number = 'This field cannot be empty';
        } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
            errors.phone_number = 'Invalid phone number';
        }

        return errors;
    };

    const field_errors = getFieldErrors();

    useEffect(() => {
        const session_form = sessionStorage.getItem('form_data');
        const form_data_str = JSON.stringify(form_data);

        // set session value if form data is updated by user
        if (form_data !== initial_form_value) {
            sessionStorage.setItem('form_data', form_data_str);
        }
        // if the session value exists and the form is on the initial state, set the form value
        else if (session_form) {
            try {
                setData(JSON.parse(session_form));
            } catch (error) {
                console.error(error);
            }
        }
    }, [form_data]);

    return (
        <>
            <form
                noValidate
                onSubmit={(event) => {
                    event.preventDefault();
                    if (step === 1) {
                        setInteracted({ name: true, email: true, phone_number: true });
                        if (Object.keys(field_errors).length > 0) {
                            const firstFieldId = Object.keys(field_errors)[0];
                            document.getElementById(firstFieldId)?.focus();
                            return;
                        }
                    }
                    setStep((prev_step) => prev_step + 1);
                    if (step === total_steps - 1) {
                        setData(initial_form_value);
                        sessionStorage.setItem('form_data', '');
                    }
                }}
            >
                <Sidebar
                    steps={formInfo.steps.slice(0, -1).map((step) => step.sidebar_title)}
                    active_step={step}
                    stepChange={goToStep}
                />

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
                            <h2 className="form__heading">{form_steps[step - 1].title}</h2>
                            <p className="form__description">{form_steps[step - 1].description}</p>
                        </div>

                        {step === 1 && (
                            <Form_1
                                name={form_data.name}
                                email={form_data.email}
                                phone_number={form_data.phone_number}
                                errors={field_errors}
                                interacted={field_interacted}
                                onBlur={handleFiledBlur}
                                onChange={setFormField}
                            />
                        )}
                        {step === 2 && (
                            <Form_2
                                selected_plan={form_data.plan}
                                billing={form_data.billing}
                                onChange={setFormField}
                            />
                        )}
                        {step === 3 && (
                            <Form_3
                                billing={form_data.billing}
                                onChange={setAddon}
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
                            <button className="button button--light">Confirm</button>
                        ) : (
                            <button className="button button--dark">Next Step</button>
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
    errors,
    interacted,
    onBlur,
    onChange,
}: {
    name: string;
    email: string;
    phone_number: string;
    errors: { name?: string; email?: string; phone_number?: string };
    interacted: { name: boolean; email: boolean; phone_number: boolean };
    onBlur: (field: 'name' | 'email' | 'phone_number') => void;
    onChange: (data_name: 'name' | 'email' | 'phone_number', data_value: string) => void;
}) {
    return (
        <div className="stack-300">
            <div className="input-box">
                <label htmlFor="name">Name</label>
                {interacted.name && errors.name && (
                    <span id="name-error" className="validation-message" role="alert">
                        {errors.name}
                    </span>
                )}
                <input
                    id="name"
                    type="text"
                    name="full-name"
                    value={name}
                    className="input--text"
                    placeholder="e.g. Stephen King"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    onChange={(event) => {
                        onChange('name', event.target.value);
                    }}
                    onBlur={() => onBlur('name')}
                    required
                />
            </div>
            <div className="input-box">
                <label htmlFor="email-address">Email Address</label>
                {interacted.email && errors.email && (
                    <span id="email-error" className="validation-message" role="alert">
                        {errors.email}
                    </span>
                )}
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    className="input--text"
                    placeholder="e.g. stephenking@lorem.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    onChange={(event) => {
                        onChange('email', event.target.value);
                    }}
                    onBlur={() => onBlur('email')}
                    required
                    />
            </div>
            <div className="input-box">
                <label id="phone-error" htmlFor="phone_number">Phone Number</label>
                {interacted.phone_number && errors.phone_number && (
                    <span className="validation-message" role="alert">
                        {errors.phone_number}
                    </span>
                )}
                <input
                    id="phone_number"
                    type="tel"
                    name="phone_number"
                    className="input--text"
                    value={phone_number}
                    placeholder="e.g. +1 234 567 890"
                    aria-invalid={!!errors.phone_number}
                    autoComplete="tel"
                    aria-describedby={errors.phone_number ? "phone-error" : undefined}
                    onChange={(event) => {
                        onChange('phone_number', event.target.value);
                    }}
                    onBlur={() => onBlur('phone_number')}
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
