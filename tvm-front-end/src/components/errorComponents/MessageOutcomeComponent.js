import "../../css/Error.css";
import { useEffect } from "react";

/**
 * This is a component which expects an useState,
 * containing success and error. If called,
 * will return a corresponding success or error message
 * and will disappear once 5 seconds have passed.
 * @param {*} outcomeHandler - the handler which contains the success and error
 * @param {*} setOutcomeHandler - the useState to set the success and error
 * @returns The MessageOutcomeComponent
 */
function MessageOutcomeComponent({ outcomeHandler, setOutcomeHandler }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (outcomeHandler.success || outcomeHandler.error)
                setOutcomeHandler({ success: null, error: null });
        }, 5000);

        return () => clearTimeout(timer);
    }, [outcomeHandler.error, outcomeHandler.success, setOutcomeHandler]);

    return (
        <>
            {outcomeHandler.success && (
                <div className="successComponent">{outcomeHandler.success}</div>
            )}
            {outcomeHandler.error && (
                <div className="errorComponent">{outcomeHandler.error}</div>
            )}
        </>
    );
}

export default MessageOutcomeComponent;
