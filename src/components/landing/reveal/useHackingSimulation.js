import { useState, useEffect } from 'react';
import { attacks, cmdSets } from './revealAttacks';
import { useNavigate } from 'react-router-dom';

export const useHackingSimulation = () => {

    // Live Hack Simulation State
    const [hackStep, setHackStep] = useState(0);
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [displayCode, setDisplayCode] = useState("");
    const [attackIndex, setAttackIndex] = useState(0);

    // 100% Kali Realism: Terminal Handshake State
    const [terminalStep, setTerminalStep] = useState(0);
    const [terminalTypedText, setTerminalTypedText] = useState("");
    const [terminalLogs, setTerminalLogs] = useState([]);

    const currentAttack = attacks[attackIndex];

    useEffect(() => {
        let timeout;

        // --- 1. Code Editor Typing Phase ---
        if (hackStep === 0) {
            if (sequenceIndex < currentAttack.keystrokes.length) {
                const char = currentAttack.keystrokes[sequenceIndex];
                const delay = Math.random() * 40 + 30; // High speed but smooth
                timeout = setTimeout(() => {
                    setDisplayCode(prev => prev + char);
                    setSequenceIndex(prev => prev + 1);
                }, delay);
            } else {
                // Done typing code: transition to terminal handshake
                timeout = setTimeout(() => setHackStep(1), 800);
            }
        }

        // --- 2. Terminal Handshake Phase ---
        else if (hackStep === 1) {

            const commands = cmdSets[attackIndex] || cmdSets[0];
            const currentEntry = commands[terminalStep];

            if (!currentEntry) {
                // All commands done — go to execution phase
                setHackStep(2);
            } else if (terminalTypedText.length < currentEntry.cmd.length) {
                // Type the command character by character
                const char = currentEntry.cmd[terminalTypedText.length];
                timeout = setTimeout(() => {
                    setTerminalTypedText(prev => prev + char);
                }, 45);
            } else {
                // Command typed — press "Enter": add command + output, advance
                timeout = setTimeout(() => {
                    setTerminalLogs(prev => [
                        ...prev,
                        { text: currentEntry.cmd, type: "command", dir: currentEntry.dir },
                        ...currentEntry.output
                    ]);
                    setTerminalStep(prev => prev + 1);
                    setTerminalTypedText("");
                }, 400);
            }
        }

        // --- 3. Execution Phase (Logs appearing) ---
        else if (hackStep === 2) {
            timeout = setTimeout(() => setHackStep(3), 6500);
        }

        return () => clearTimeout(timeout);
    }, [sequenceIndex, hackStep, terminalStep, terminalTypedText, currentAttack, attackIndex, terminalLogs]);

    const nextAttack = (navigate) => {
        if (attackIndex < attacks.length - 1) {
            setAttackIndex(prev => prev + 1);
            setSequenceIndex(0);
            setDisplayCode("");
            setHackStep(0);
            setTerminalStep(0);
            setTerminalTypedText("");
            setTerminalLogs([]);
        } else {
            navigate('/challenges');
        }
    };

    const resetSimulation = () => {
        setSequenceIndex(0);
        setDisplayCode("");
        setHackStep(0);
        setAttackIndex(0);
        setTerminalStep(0);
        setTerminalTypedText("");
        setTerminalLogs([]);
    };

    return {
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
    };
};
