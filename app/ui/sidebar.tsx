'use client';

function Step({
    step,
    children,
    isActive,
    isPassed,
}: {
    step: number;
    children: React.ReactNode;
    isActive: boolean;
    isPassed: boolean;
}) {
    return (
        <li className="step" data-state={isActive ? 'active' : isPassed ? 'passed' : 'upcoming'}>
            <span className="step__marker">{step}</span>
            <div className="step__heading">
                <span>step {step}</span>
                <span>{children}</span>
            </div>
        </li>
    );
}

export default function Sidebar({ active_step }: { active_step: number }) {
    const steps = ['Your Info', 'Select Plan', 'Add-Ones', 'Summary'];
    return (
        <ol className="form-sidebar">
            {steps.map((step_name, i) => {
                return (
                    <Step
                        step={i + 1}
                        key={i + 1}
                        isPassed={i + 1 < active_step}
                        isActive={i + 1 == active_step}
                    >
                        {step_name}{' '}
                    </Step>
                );
            })}
        </ol>
    );
}
