import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHackingSimulation } from './useHackingSimulation';
import BrowserFrame from './BrowserFrame';
import CodeEditor from './CodeEditor';
import Terminal from './Terminal';
import VictoryModal from './VictoryModal';

const RevealContainer = () => {
    const navigate = useNavigate();
    const {
        hackStep,
        sequenceIndex,
        displayCode,
        attackIndex,
        terminalStep,
        terminalTypedText,
        terminalLogs,
        currentAttack,
        nextAttack,
        resetSimulation
    } = useHackingSimulation();

    return (
        <BrowserFrame
            currentAttack={currentAttack}
            modal={
                hackStep >= 3 && (
                    <VictoryModal
                        attackIndex={attackIndex}
                        currentAttack={currentAttack}
                        nextAttack={() => nextAttack(navigate)}
                        resetSimulation={resetSimulation}
                    />
                )
            }
        >
            <CodeEditor
                currentAttack={currentAttack}
                hackStep={hackStep}
                displayCode={displayCode}
                attackIndex={attackIndex}
            />
            <Terminal
                hackStep={hackStep}
                terminalLogs={terminalLogs}
                terminalTypedText={terminalTypedText}
                attackIndex={attackIndex}
                terminalStep={terminalStep}
                currentAttack={currentAttack}
            />
        </BrowserFrame>
    );
};

export default RevealContainer;
