import * as React from 'react';
import classNames from 'classnames';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { LANGUAGE } from "@/types/language"

import useLanguage from "@/hooks/useLanguage"

type PropsType = {
    alert?: React.ReactNode;
    components: React.ReactNode[];
    className?: string;
    steps: string[];
    FinishButton?: React.FC,
    resetStepperRef?: React.MutableRefObject<() => void>
}

const HorizontalLinearStepper = ({ alert, components, className, steps, FinishButton , resetStepperRef}: PropsType) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());

    const { language } = useLanguage()
    
    const isEnglish = language === LANGUAGE.ENGLISH

    const isLastStep = activeStep === steps.length - 1

    const isStepOptional = (step: number) => {
        return false //step === 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;

        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);

        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = React.useCallback(
        () => setActiveStep(0),
        []
    )

    React.useEffect(() => {
        if(resetStepperRef) {
            resetStepperRef.current = handleReset
        }
    }, [ handleReset, resetStepperRef ])

    return (
        <div className={classNames(className, "flex flex-col w-full")}>
            <Stepper activeStep={activeStep}>
                {
                    steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};

                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};

                        if (isStepOptional(index)) {
                            labelProps.optional = (
                                <Typography variant="caption">
                                    Optional
                                </Typography>
                            );
                        }

                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }

                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })
                }
        </Stepper>
      { activeStep === steps.length ? (
            <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset}>Reset</Button>
                </Box>
            </React.Fragment>
        ) : (
        <React.Fragment>
            <div className="grow mt-6">
                {
                    alert
                }
                {
                    components[activeStep]
                }
            </div>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                    >
                    { isEnglish ? "Back" : "Voltar" }
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {
                    isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                        Skip
                    </Button>
                )}
                {
                    isLastStep && FinishButton ? <FinishButton /> : (
                        <Button onClick={handleNext}>
                            { activeStep === steps.length - 1 ? (isEnglish ? 'Finish' : "Terminar") : ( isEnglish ? 'Next' : "Próximo" ) }
                        </Button>
                    )
                }
            </Box>
        </React.Fragment>
      )}
    </div>
  );
}

export default HorizontalLinearStepper
