'use client';

function Step({
    step,
    children,
    isActive,
}: {
    step: number;
    children: React.ReactNode;
    isActive: boolean;
}) {
    return (
        <li className={`step ${isActive && 'active'}`}>
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
            {steps.map((step, i) => {
                return (
                    <Step step={i + 1} key={i + 1} isActive={i+1 == active_step}>
                        {step}{' '}
                    </Step>
                );
            })}
        </ol>
    );
}
