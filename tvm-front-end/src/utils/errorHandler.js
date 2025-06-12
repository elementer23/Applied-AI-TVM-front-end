/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for logging in.
 * @param {*} error
 * @returns a status and message
 */
export function LoginError(error) {
    if (error) {
        if (error.status === 400) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for registering.
 * @param {*} error
 * @returns a status and message
 */
export function RegisterError(error) {
    if (error) {
        if (error.status === 400) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * requests while talking to the AI.
 * @param {*} error
 * @returns a status and message
 */
export function RequestError(error) {
    if (error) {
        if (error.status === 500) {
            return {
                current_state: error.status,
                message:
                    "Something went wrong during the retrieval of the answer",
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * retrieving categories.
 * @param {*} error
 * @returns a status and message
 */
export function RetrieveCategoriesError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * category creation.
 * @param {*} error
 * @returns a status and message
 */
export function CreateCategoryError(error) {
    if (error) {
        if (error.status === 400) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        } else if (error.status === 403) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * retrieving a subcategory through a category id.
 * @param {*} error
 * @returns a status and message
 */
export function RetrieveSubCategoryByCategoryIdError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * creating advisory texts.
 * @param {*} error
 * @returns a status and message
 */
export function CreateAdvisoryTextError(error) {
    if (error) {
        if (error.status === 400) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        } else if (error.status === 403) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * Updating advisory texts.
 * @param {*} error
 * @returns a status and message
 */
export function UpdateAdvisoryTextError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        } else if (error.status === 403) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return { current_state: null, message: "Network error" };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * deleting advisory texts.
 * @param {*} error
 * @returns a status and message
 */
export function DeleteAdvisoryTextError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        } else if (error.status === 403) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return { current_state: null, message: "Network error" };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * updating category's.
 * @param {*} error
 * @returns a status and message
 */
export function UpdateCategoryError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        } else if (error.status === 403) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * deleting a category.
 * @param {*} error
 * @returns a status and message
 */
export function DeleteSingleCategoryError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        } else if (error.status === 403) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * retrieving conversation messages.
 * @param {*} error
 * @returns a status and message
 */
export function GetConversationMessagesError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * retrieving all advisory texts.
 * @param {*} error
 * @returns a status and message
 */
export function GetAllAdvisoryTextsError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * retrieving an advisory text by id.
 * @param {*} error
 * @returns a status and message
 */
export function GetAdvisoryTextByIdError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * retrieving an advisory text by subcategory id.
 * @param {*} error
 * @returns a status and message
 */
export function RetrieveAdvisoryTextBySubcategoryIdError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * retrieving a category by id.
 * @param {*} error
 * @returns a status and message
 */
export function GetSingleCategoryError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * retrieving all subcategories.
 * @param {*} error
 * @returns a status and message
 */
export function GetAllSubcategoriesError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}

/**
 * This function is a shorthand error storing fuction,
 * to retrieve and initialize messages and states depending on the
 * corresponding server errors. This one is specifically for
 * retrieving a subcategory by id.
 * @param {*} error
 * @returns a status and message
 */
export function GetSingleSubcategoryError(error) {
    if (error) {
        if (error.status === 404) {
            return {
                current_state: error.status,
                message: error.response.data.detail,
            };
        }
    }

    return {
        current_state: null,
        message: "Network error",
    };
}
