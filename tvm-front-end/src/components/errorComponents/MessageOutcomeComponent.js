import "../../css/Error.css";
import { useEffect } from "react";

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
