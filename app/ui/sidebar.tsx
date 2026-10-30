'use client';

function Step({
    step,
    step_name,
    isActive,
    isPassed,
    isDisabled,
    onClick,
}: {
    step: number;
    step_name: string;
    isActive: boolean;
    isPassed: boolean;
    isDisabled: boolean;
    onClick: () => void;
}) {
    return (
        <li className="step" data-state={isActive ? 'active' : isPassed ? 'passed' : 'upcoming'}>
            <button className="step__button" aria-current={isActive ? "step" : undefined} aria-label={`Step ${step}: ${step_name} ${isPassed && ", completed"}`} onClick={onClick} disabled={isDisabled} type="button">
                <span className="step__marker">{step}</span>
                <div className="step__heading">
                    <span>step {step}</span>
                    <span>{step_name}</span>
                </div>
            </button>
        </li>
    );
}

export default function Sidebar({ active_step, stepChange, steps }: { active_step: number, stepChange:(step_num: number) => void, steps:Array<string> }) {
    return (
        <nav aria-label="Subscription form steps" className="form__sidebar">
            <ol>
                {steps.map((step_name, i) => {
                    const step_num = i+1;
                    return (
                        <Step
                            step={step_num}
                            step_name={step_name}
                            key={step_num}
                            isPassed={step_num < active_step}
                            isActive={step_num == active_step}
                            onClick={()=>stepChange(step_num)}
                            isDisabled= {active_step === 5 || step_num > active_step}
                        />
                    );
                })}
            </ol>
        </nav>
    );
}
