'use client';

function Step({
    step,
    children,
    isActive,
    isPassed,
    onClick,
}: {
    step: number;
    children: React.ReactNode;
    isActive: boolean;
    isPassed: boolean;
    onClick: () => void;
}) {
    return (
        <li className="step" data-state={isActive ? 'active' : isPassed ? 'passed' : 'upcoming'}>
            <button className="step__button" onClick={onClick} disabled={!isPassed}>
                <span className="step__marker">{step}</span>
                <div className="step__heading">
                    <span>step {step}</span>
                    <span>{children}</span>
                </div>
            </button>
        </li>
    );
}

export default function Sidebar({ active_step, stepChange, steps }: { active_step: number, stepChange:(step_num: number) => void, steps:Array<string> }) {
    return (
        <ol className="form__sidebar">
            {steps.map((step_name, i) => {
                const step_num = i+1;
                return (
                    <Step
                        step={step_num}
                        key={step_num}
                        isPassed={step_num < active_step}
                        isActive={step_num == active_step}
                        onClick={()=>stepChange(step_num)}
                    >
                        {step_name}{' '}
                    </Step>
                );
            })}
        </ol>
    );
}
