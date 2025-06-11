import "../../css/Error.css";
import { useEffect, useState } from "react";

function ErrorComponent(errorStatus, errorMessage, active) {
    const [error, setError] = useState({
        status: null,
        message: null,
    });
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (active) {
            setIsActive(true);
            setError({ status: errorStatus, message: errorMessage });
        } else {
            setIsActive(false);
            setError(null);
        }
    }, []);

    return (
        <>
            {isActive && (
                <div className="errorComponent">
                    {...error && (
                        <>
                            {" "}
                            <strong>{error.status}</strong>{" "}
                            <span>{error.message}</span>{" "}
                        </>
                    )}
                </div>
            )}
        </>
    );
}

export default ErrorComponent;
